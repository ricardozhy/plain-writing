# Plain Writing

An English-language Agent Skill for writing prose people can follow. Use it on everyday emails, messages, reports, or explanations, and on research papers, abstracts, results, and reviewer replies. It follows the language and register of your assignment.

## Install in Codex

Run this in your project directory. The current Skills CLI requires Node.js 22.20.0 or later.

```sh
npx skills add ricardozhy/plain-writing --skill plain-writing --agent codex --copy -y
```

The command copies the skill into `.agents/skills/plain-writing/`. Add `--global` to install for your user account. Use `ricardozhy/plain-writing@v2.0.0` as the source to pin this release. If PowerShell blocks `npx.ps1`, run the same command with `npx.cmd`.

For manual installation, [download the repository](https://github.com/ricardozhy/plain-writing/archive/refs/heads/main.zip) and copy `skills/plain-writing` into your project's `.agents/skills/`. Keep the folder intact so the examples and picker configuration accompany `SKILL.md`. Open Codex in that project and select `$plain-writing`.

[Skills CLI reference](https://github.com/vercel-labs/skills/blob/main/docs/commands.md) · [Codex skills documentation](https://developers.openai.com/codex/skills/)

## Use it

Paste your source material after one of these prompts, or describe your own assignment.

```text
$plain-writing 把下面的消息改成一封发给同事的短邮件。开头写清要他做什么、什么时候交。
```

```text
$plain-writing Edit the following results paragraph for a machine learning paper. Lead with the measured outcome, keep the baseline and evaluation conditions, and preserve the citation keys.
```

| Material | What the skill looks for |
| --- | --- |
| Message or email | The reader's next action, the owner, and the deadline |
| Report or explanation | A result or decision with enough context to stand on its own |
| Abstract or introduction | The research problem, the specific gap, and the best-supported contribution |
| Methods or results | Technical terms, definitions, comparison, experimental conditions, and uncertainty |
| Reviewer reply | A direct answer with the evidence or the location of the revision |

The [worked examples](skills/plain-writing/references/examples.md) show a Chinese email, an English message with a missing detail, a results paragraph, and a reviewer reply.

## Source and versions

The starting point was OpenAI's public *Using GPT-6.2* API guide. Its [Writing style](https://developers.openai.com/api/docs/guides/latest-model#writing-style) examples describe direct language and self-contained delivery. Its [Task completion](https://developers.openai.com/api/docs/guides/latest-model#task-completion) examples discuss finishing work and using reversible assumptions. This package applies those ideas through original instructions and examples for everyday and scholarly writing.

This release is named `plain-writing`. The first release remains available at [v1.0.0](https://github.com/ricardozhy/plain-writing/releases/tag/v1.0.0).

## License

[MIT](LICENSE) · Maintained by ricardozhy
