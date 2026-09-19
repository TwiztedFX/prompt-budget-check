# Contributing

Thanks for looking at **prompt-budget-check**. This is a tiny, free MIT tool. Keep it small: no extra packages, no API keys, no secrets in the repo.

## How to run checks

```bash
npm test
node bin/prompt-budget-check.js examples/sample-prompt.txt --budget 200
```

Sample should pass. The fat example should fail a low budget:

```bash
node bin/prompt-budget-check.js examples/fat-prompt.txt --budget 50
# exit code 1 is expected
```

Copy-paste GitHub Actions for *your* repo: [examples/github-actions.yml](examples/github-actions.yml). This repo’s own workflow is [.github/workflows/ci.yml](.github/workflows/ci.yml).

## What we will merge

- Clearer docs in plain English
- Small bug fixes in the estimator or CLI
- Extra examples that stay free of secrets

We will not merge paid-only tokenizers, tracking, or anything that needs a secret key.

## Paid work and extra reading

This CLI only fails the build when a prompt file is too long. If you need exact token counts, a CI pack for many repos, or help automating three real jobs in a business:

- **Talk to the studio:** [https://www.pragmex-agentics.com/contact](https://www.pragmex-agentics.com/contact)  
  Written assessment by email. Not a live call.
- **Free shelf (checklist, this tool, more):** [https://www.pragmex-agentics.com/resources](https://www.pragmex-agentics.com/resources)

Please do not open issues asking for employer contacts or ads. Use the contact form for paid work.

## GitHub Sponsors (optional, free)

If you like the tool and want to send a few dollars, use GitHub Sponsors when the account is live:

- [https://github.com/sponsors/TwiztedFX](https://github.com/sponsors/TwiztedFX)

If that page is not open yet, the click path for the repo owner (Ash / TwiztedFX) is in [docs/github-sponsors-setup.md](docs/github-sponsors-setup.md). Contributors do not need to set this up.

## License

By sending a pull request you agree the change is MIT, same as [LICENSE](LICENSE).
