# prompt-budget-check

**Tiny, MIT-licensed CLI** that estimates prompt token budgets and fails CI when a prompt file is over limit.

Zero npm dependencies. Node 18+.

Useful for agentic / LLM apps where system prompts quietly bloat until latency and cost spike.

```bash
npx prompt-budget-check prompts/system.txt --budget 2000
# or locally:
node bin/prompt-budget-check.js prompts/system.txt --budget 2000
```

Exit code `0` = under budget · `1` = over budget · `2` = read error.

---

## Install (local / publish-ready)

```bash
# from this package root
npm install -g .          # optional global link
npm link                  # or link for local bin
npm test                  # run self-tests
npm run check:example     # demo on examples/sample-prompt.txt
```

After npm publish (see `PUBLISH.md`):

```bash
npm i -g prompt-budget-check
prompt-budget-check ./my-prompt.md --budget 1500
```

---

## Usage

```bash
prompt-budget-check <file> [--budget N] [--heuristic chars4|words13|max] [--model NAME] [--json]
cat prompt.txt | prompt-budget-check --stdin --budget 2000
```

| Flag | Meaning |
|------|---------|
| `--budget <n>` | Max allowed tokens (default `4096`) |
| `--heuristic` | `chars4` (len/4), `words13` (words×1.3), or `max` of both (default) |
| `--model` | Soft hint: `gpt-4`, `gpt-4o`, `claude-3`, `claude-3.5`, `gemini-1.5` |
| `--json` | Print machine-readable report |
| `--stdin` | Read prompt from stdin |

### CI example (GitHub Actions)

```yaml
- name: Prompt budget gate
  run: npx prompt-budget-check ./prompts/system.txt --budget 2500
```

### Library use

```js
const { checkBudget, estimateTokens } = require('prompt-budget-check');
const result = checkBudget(fs.readFileSync('prompt.txt', 'utf8'), { budget: 2000 });
if (!result.ok) process.exit(1);
```

---

## What this is / is not

| Is | Is not |
|----|--------|
| Fast CI gate with approximate counts | Exact tiktoken / Anthropic tokenizer |
| Dependency-free scaffold | Full prompt ops platform |
| Funnel to paid hardening | Free commercial support SLA |

Estimates are intentionally simple. For production-grade tokenizers, multi-model budgets, monorepo prompt lint, or agentic platform builds — **inquire with the studio**.

---

## Paid support & studio inquire

Built by **[Pragmex Agentics](https://www.pragmex-agentics.com)** — agentic platform design studio (Umhlanga; US/EU/SA operators).

| Need | Path |
|------|------|
| Paid hardening of this tool (real tokenizers, CI templates) | [Contact](https://www.pragmex-agentics.com/contact) |
| Custom feature / monorepo prompt lint | [Contact](https://www.pragmex-agentics.com/contact) |
| Full agentic platform build (Package B) | [Contact](https://www.pragmex-agentics.com/contact) |

**CTA only:** Inquire / Start a conversation / Contact the studio → https://www.pragmex-agentics.com/contact

See `monetization.md` for the free OSS → paid support → Package B ladder.

---

## License

MIT © 2026 Pragmex Agentics

---

## Maintainers

- Intended GitHub org/user: **TwiztedFX** (or Cursor Origin) — see `PUBLISH.md`
- Do not push secrets. Prefer public MIT repo; npm publish optional.
