# Plain Chinese Editor

An Agent Skill with English instructions for writing natural Chinese. It works on WeChat official account articles, notices, and technical explainers. Give it a draft or source notes and tell it who will read the result.

## Install in Codex

From your project directory, run the command below. The current Skills CLI requires Node.js 22.20.0 or later. This command installs a project copy under `.agents/skills/`.

```sh
npx skills add ricardozhy/plain-chinese-editor --skill plain-chinese-editor --agent codex --copy -y
```

Add `--global` to install for your user account. For a release-pinned installation, use `ricardozhy/plain-chinese-editor@v1.0.0` as the source.

If Windows PowerShell blocks `npx.ps1`, run the same command with `npx.cmd`.

To install manually, [download the repository](https://github.com/ricardozhy/plain-chinese-editor/archive/refs/heads/main.zip) and copy the entire `skills/plain-chinese-editor` directory into your project's `.agents/skills/` directory. The result should contain `.agents/skills/plain-chinese-editor/SKILL.md` and the accompanying `references/` directory. Use your home directory's `.agents/skills/` for a user-level installation. Open Codex in the project directory and use the skill picker. If you have an existing copy, update it in place so the picker shows one entry.

[Skills CLI command reference](https://github.com/vercel-labs/skills/blob/main/docs/commands.md) · [Codex skills documentation](https://developers.openai.com/codex/skills/)

## Use it

Start a Codex message with `$plain-chinese-editor` and paste your notes or draft. Specify the audience and any edits or facts that matter.

```text
$plain-chinese-editor 把下面的论文笔记写成公众号开头，读者第一次听说这项研究。保留型号、测试条件和出处。先写读者能理解的例子。
```

```text
$plain-chinese-editor 把下面的通知写给正准备出门的读者。把时间、地点和受影响的服务放在前面。
```

The English instructions guide the editing process. New drafts are in Chinese by default. For edits, the skill follows the source language and the requested tone.

## How it edits

| When you give it | What it does |
| --- | --- |
| Notes for a WeChat article | Opens with a specific event or result and builds the headline around a question the piece answers |
| An operational notice | Surfaces the time, affected service, and action the reader can take |
| Technical results or a paper | Explains terms in context and preserves metrics, model names, experimental conditions, and attribution |
| A paragraph to polish | Keeps the author's voice and edits at the requested scale |
| A source with a missing fact | Finishes the grounded draft and lists the exact missing fact for verification |

**Before**

> 为进一步优化阅读环境，本馆将组织开展照明设施更换工作，届时部分区域暂停对外开放，敬请广大读者合理安排到馆时间。

**After, using the source notes**

> 12 月 5 日 14:00–16:00，图书馆二楼阅览室换灯，暂停开放。只来还书的话，一楼还书台照常开放。

See [worked examples](skills/plain-chinese-editor/references/examples.md) for a paper explainer and a draft with a missing date. The repository contains instructions, examples, and Codex picker metadata. Once installed, the skill uses your existing agent.

## License

[MIT](LICENSE) · Maintained by 西方魔蚊
