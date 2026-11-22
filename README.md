# Plain Writing

Install the [OpenAI Writing style prompts](https://developers.openai.com/api/docs/guides/latest-model#writing-style) in your Codex `AGENTS.md`. The installer reads the three English prompt blocks from the official guide when you run it and writes their text in a marked block.

## Install

From the project root, run:

```sh
npx skills add ricardozhy/plain-writing --skill plain-writing --agent codex --copy -y
node .agents/skills/plain-writing/scripts/agents-md.mjs install AGENTS.md
```

The first command installs the Skill. The second writes the prompts. Open a new Codex session in the project to load them. To do the second step in Codex, ask `$plain-writing install in this project's AGENTS.md`.

If PowerShell blocks `npx.ps1`, use `npx.cmd` in the first command.

For user-level instructions, replace the last argument `AGENTS.md` with `--global`. That uses the `AGENTS.md` in `CODEX_HOME` or, by default, in your home directory's `.codex`. If your active file is `AGENTS.override.md`, pass its full path explicitly. [How Codex loads AGENTS.md](https://developers.openai.com/codex/guides/agents-md/)

## Remove

Run the installer with `remove` and the same target:

```sh
node .agents/skills/plain-writing/scripts/agents-md.mjs remove AGENTS.md
```

Or ask `$plain-writing remove from this project's AGENTS.md` in Codex. For manual removal, delete the section from the `plain-writing:begin` comment through the `plain-writing:end` comment, including both comments. Keep your own instructions outside those markers.

Open a new Codex session after removing the block. To also uninstall the Skill package, run `npx skills remove plain-writing` from the project. Add `--global` if the package was installed globally.

[MIT](LICENSE)
