import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, realpath, rename, rm, stat, unlink, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { promisify } from "node:util";

const url = "https://developers.openai.com/api/docs/guides/latest-model";
const markdownUrl = url + ".md";
const startMarker = "<!-- plain-writing:begin -->";
const createdMarker = "<!-- plain-writing:begin created -->";
const endMarker = "<!-- plain-writing:end -->";

async function readTarget(path) {
  try {
    return await readFile(path);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function findBlock(text) {
  const markers = [...text.matchAll(/^<!-- plain-writing:(begin(?: created)?|end) -->\r?$/gm)];
  if (markers.length === 0) return null;
  if (markers.length !== 2 || !markers[0][1].startsWith("begin") || markers[1][1] !== "end") {
    throw new Error("The plain-writing markers are incomplete or duplicated. Check the marked block in AGENTS.md.");
  }
  const [start, end] = markers;
  const afterEnd = end.index + end[0].length;
  return {
    start: start.index,
    end: afterEnd + Number(text[afterEnd] === "\n"),
    created: start[1] === "begin created",
  };
}

async function readOfficialMarkdown() {
  if (process.env.HTTPS_PROXY || process.env.https_proxy) {
    try {
      const { stdout } = await promisify(execFile)("curl", [
        "--fail", "--silent", "--show-error", "--proto", "=https",
        "--max-time", "20", markdownUrl,
      ], { maxBuffer: 1_000_000, windowsHide: true });
      return stdout;
    } catch (error) {
      if (error.code !== "ENOENT") throw new Error("Could not read the OpenAI guide through the configured proxy.");
    }
  }
  const response = await fetch(markdownUrl, { redirect: "error", signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`OpenAI's guide returned HTTP ${response.status}.`);
  return await response.text();
}

async function officialPrompts() {
  const lines = (await readOfficialMarkdown()).replace(/\r\n/g, "\n").split("\n");
  const first = lines.findIndex((line) => line.trimEnd() === "### Writing style");
  const next = lines.findIndex((line, index) => index > first && /^#{1,3} /.test(line));
  const section = lines.slice(first + 1, next === -1 ? undefined : next).join("\n");
  const prompt = /^```text[ \t]*\n([\s\S]+?)\n```[ \t]*$/gm;
  const blocks = [...section.matchAll(prompt)].map((m) => m[1]);
  if (first < 0 || blocks.length !== 3 || blocks.some((block) => !block.trim() || block.includes("<!-- plain-writing:"))) {
    throw new Error("Could not identify the three prompt blocks in OpenAI's Writing style section.");
  }
  return blocks.join("\n\n");
}

async function assertCurrent(path, original) {
  const current = await readTarget(path);
  if (original ? !current?.equals(original) : current !== null) {
    throw new Error("AGENTS.md changed while the command was running. Run the command again.");
  }
}

async function replaceFile(path, original, text) {
  const directory = dirname(path);
  await mkdir(directory, { recursive: true });
  const temp = join(directory, `.${basename(path)}.${randomUUID()}.tmp`);
  const mode = original ? (await stat(path)).mode & 0o777 : 0o666;
  try {
    await writeFile(temp, text, { encoding: "utf8", flag: "wx", mode });
    await assertCurrent(path, original);
    await rename(temp, path);
  } finally {
    await rm(temp, { force: true });
  }
}

async function main() {
  const [action, target = "AGENTS.md", ...extra] = process.argv.slice(2);
  if (!["install", "remove"].includes(action) || extra.length) {
    throw new Error("Usage: node agents-md.mjs <install|remove> [AGENTS.md|--global]");
  }
  const requested = target === "--global"
    ? resolve(process.env.CODEX_HOME || join(homedir(), ".codex"), "AGENTS.md")
    : resolve(target);
  if (!["AGENTS.md", "AGENTS.override.md"].includes(basename(requested))) {
    throw new Error("Choose an AGENTS.md or AGENTS.override.md file.");
  }
  const original = await readTarget(requested);
  const path = original ? await realpath(requested) : requested;
  const decoded = original ? new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(original) : "";
  const bom = decoded.startsWith("\uFEFF") ? "\uFEFF" : "";
  const text = decoded.slice(bom.length);
  const block = findBlock(text);
  if (action === "install") {
    if (block) {
      console.log(`Plain Writing is already installed in ${requested}`);
      return;
    }
    const prompts = await officialPrompts();
    const nl = text.includes("\r\n") ? "\r\n" : "\n";
    const managed = [original ? startMarker : createdMarker, "## OpenAI Writing style",
      `[Source](${url}#writing-style)`, "", prompts, endMarker, ""].join("\n").replaceAll("\n", nl);
    await replaceFile(path, original, bom + text + (text ? nl + nl : "") + managed);
    console.log(`Installed 3 Writing style prompts in ${requested}`);
    return;
  }
  if (!block) {
    console.log(`No Plain Writing block in ${requested}`);
    return;
  }
  const after = text.slice(block.end);
  const before = text.slice(0, block.start);
  const remainder = (after ? before : before.replace(/(?:\r?\n){2}$/, "")) + after;
  if (block.created && remainder === "" && !bom) {
    await assertCurrent(path, original);
    await unlink(path);
  } else {
    await replaceFile(path, original, bom + remainder);
  }
  console.log(`Removed the Plain Writing block from ${requested}`);
}

try {
  await main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
