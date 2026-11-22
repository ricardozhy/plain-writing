---
name: plain-writing
description: Copy the official OpenAI Writing style prompts into a user-selected AGENTS.md and remove them later. Use for installing, removing, or inspecting this writing-style configuration.
---

# Plain Writing

Use the three prompt blocks under [Writing style in OpenAI's API guide](https://developers.openai.com/api/docs/guides/latest-model#writing-style) as the source. The installer reads the [official Markdown](https://developers.openai.com/api/docs/guides/latest-model.md) at install time.

When the user asks to install or remove the prompts, run `scripts/agents-md.mjs` from this skill directory with Node.js. Use the action and location the user requested:

- Project: `node /path/to/agents-md.mjs install /path/to/project/AGENTS.md`
- User: `node /path/to/agents-md.mjs install --global`
- Remove: run the same command with `remove` and the same file or `--global`.

Use the project root's `AGENTS.md` when the user gives no location. Pass an explicit `AGENTS.override.md` path if the user asks to edit an override. Report the exact file and the result. Open a new Codex session in the project to load the change.

The installer wraps the copied prompt text in `plain-writing:begin` and `plain-writing:end` markers. The remove command acts on that block. Use these actions when the user asks to change their configuration.
