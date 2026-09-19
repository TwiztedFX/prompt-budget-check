# Show HN draft (ready to post)

Copy the title + body. Do not paste secrets. Do not mention employers.

**Suggested title (≤80 chars):**

Show HN: prompt-budget-check – fail CI when your LLM prompt file gets too fat

**Alternate titles:**

- Show HN: A 0-dep CLI that stops AI system prompts from silently bloating
- Show HN: Tiny MIT gate — estimate prompt tokens, fail the build if over budget

---

## Body (paste into HN)

Hi HN.

prompt-budget-check is a tiny MIT CLI: you point it at a prompt file, give it a budget, and it fails CI when the file is over that limit.

Why: system prompts in LLM apps quietly grow. Cost and latency go up, and nobody notices until the bill does. I wanted a speed bump that needs zero npm dependencies and no API keys.

It is *not* tiktoken. Counts are rough (chars/4, words×1.3, or max of both). That is on purpose — fast enough for a GitHub Action, good enough to catch bloat.

```
npx prompt-budget-check prompts/system.txt --budget 2000
```

Exit 0 = under budget, 1 = over, 2 = could not read the file.

Repo: https://github.com/TwiztedFX/prompt-budget-check

I built this as the free front door for Pragmex (small studio). If you need exact tokenizers, a CI pack for a monorepo, or paid help to automate three jobs in an operations team, there is a contact form — no sales spam from the tool itself:

https://www.pragmex-agentics.com/contact

Happy to hear what budget number you would actually set in production.

---

## Posting notes (for Ash)

- Post as a **Show HN** with the repo as the URL, or the GitHub README.
- Best window: weekday US morning; avoid dumping links in comments.
- First comment (optional): paste the `npx` one-liner + “MIT, Node 18+, no deps.”
- If people ask for tiktoken: agree, point to `/contact` for paid hardening, keep the OSS tool simple.
- Do not mention Ignition or any employer. Do not spend on ads.
