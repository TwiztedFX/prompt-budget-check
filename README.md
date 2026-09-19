# prompt-budget-check

**Stop your AI prompts from getting too long.**

When you give ChatGPT (or any similar tool) a big instruction file, that file costs money and can make answers slower. This tiny program **counts how big the file is** and **fails your build** if it is over a limit you choose.

Free. MIT license. No extra packages. Needs Node 18+.

```bash
npx prompt-budget-check prompts/system.txt --budget 2000
```

Under the limit → exit `0`. Over the limit → exit `1`. Can’t read the file → exit `2`.

---

## What it does (plain English)

1. You save your AI instructions in a text file.
2. You pick a max size (a “budget”), like `2000`.
3. The tool guesses how many tokens that file uses. (A token is a small chunk of text. This guess is **rough on purpose** — fast, no secret keys, good enough to catch bloat.)
4. If the file is too big, CI turns red so the prompt cannot sneak into production.

That’s it. It is a **speed bump**, not a full tokenizer.

---

## Install

**Try it with no install:**

```bash
npx prompt-budget-check ./examples/sample-prompt.txt --budget 200
```

**Install for real (after the package is on npm, or from this folder):**

```bash
npm i -g prompt-budget-check
# or from a clone of this repo:
npm install -g .
```

**Run the built-in tests:**

```bash
npm test
```

---

## Example

Sample prompt in this repo:

```bash
node bin/prompt-budget-check.js examples/sample-prompt.txt --budget 200
```

You should see a short report: OK or OVER BUDGET, plus the guessed token count.

**In GitHub Actions:**

```yaml
- name: Prompt budget gate
  run: npx prompt-budget-check ./prompts/system.txt --budget 2500
```

**Pipe from stdin:**

```bash
cat prompt.txt | prompt-budget-check --stdin --budget 2000
```

**Flags**

| Flag | Meaning |
|------|---------|
| `--budget <n>` | Max allowed tokens (default `4096`) |
| `--heuristic` | `chars4` (length ÷ 4), `words13` (words × 1.3), or `max` of both (default) |
| `--model` | Soft hint: `gpt-4`, `gpt-4o`, `claude-3`, `claude-3.5`, `gemini-1.5` |
| `--json` | Print a JSON report |
| `--stdin` | Read from a pipe instead of a file |

**Use it from JavaScript:**

```js
const fs = require('fs');
const { checkBudget } = require('prompt-budget-check');

const result = checkBudget(fs.readFileSync('prompt.txt', 'utf8'), { budget: 2000 });
if (!result.ok) process.exit(1);
```

---

## Want this to do more? Talk to Pragmex.

This free tool is the **small end**. If you need exact counts, a CI pack for many repos, or **paid help to automate three real jobs** in your business (intake → sort → humans only on the messy cases), start here:

**[Contact Pragmex](https://www.pragmex-agentics.com/contact)** → https://www.pragmex-agentics.com/contact

We build the bigger system around the prompts. This CLI only keeps the prompts from getting fat.

---

## License

MIT © 2026 Pragmex Agentics
