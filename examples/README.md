# Examples

These files are safe to copy. They contain no keys, tokens, or customer data.

| File | What it is | Typical check |
|------|------------|----------------|
| [sample-prompt.txt](sample-prompt.txt) | Short triage prompt | Should **pass** `--budget 200` |
| [fat-prompt.txt](fat-prompt.txt) | Bloated prompt (repeated filler) | Should **fail** `--budget 50` |
| [github-actions.yml](github-actions.yml) | CI you can paste into another repo | Uses `npx`; no secrets |

```bash
node bin/prompt-budget-check.js examples/sample-prompt.txt --budget 200
node bin/prompt-budget-check.js examples/fat-prompt.txt --budget 50
```

## After you see a red build

1. Cut repeated policy text. Move long examples out of the system prompt.
2. Raise `--budget` only if the prompt is genuinely required.
3. If the problem is “we have twenty prompt files and a real bill,” that is paid work, not this CLI.

**Contact (written assessment):** [https://www.pragmex-agentics.com/contact](https://www.pragmex-agentics.com/contact)

**Free tools and checklist:** [https://www.pragmex-agentics.com/resources](https://www.pragmex-agentics.com/resources)

This package is also listed on the resources page as the open-source spend check. The paid path on that page is the 21-day / three-job build after a written assessment — not a meeting.
