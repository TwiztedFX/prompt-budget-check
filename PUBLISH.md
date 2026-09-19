# Publish checklist — Ash / TwiztedFX (or Origin)

**Status on box:** Local package complete. **Not pushed. Not npm-published.**  
LogiQ will not push unless `gh` is free, authenticated, and low secrets-risk — verify below before any remote action.

## Preflight (run on Ash machine or box with gh)

```bash
# 1) Auth + identity (expect TwiztedFX or approved org)
gh auth status
gh api user --jq .login

# 2) No lingering secrets in package
rg -n "API_KEY|SECRET|TOKEN|password|private.?key" . --glob '!node_modules' || true

# 3) Self-test
cd /path/to/prompt-budget-check
npm test
node bin/prompt-budget-check.js examples/sample-prompt.txt --budget 200
```

**Gate:** Proceed only if `gh auth status` is happy, login is TwiztedFX (or Ash-approved), and `rg` finds no secrets.

If `gh` is missing, unauthenticated, or org is wrong → **stop**. Keep local scaffold; Ash creates the repo in the UI and pushes manually.

## Option A — GitHub (TwiztedFX) free public repo

```bash
cd prompt-budget-check
git init
git add .
git commit -m "feat: initial MIT release of prompt-budget-check"

# Create empty public repo (no README — we already have one)
gh repo create TwiztedFX/prompt-budget-check --public --source=. --remote=origin --push

# Topics for discovery
gh repo edit TwiztedFX/prompt-budget-check \
  --description "Stop AI prompts from getting too long. Tiny MIT CLI: estimate tokens and fail CI when over budget." \
  --homepage "https://www.pragmex-agentics.com/contact" \
  --add-topic cli --add-topic llm --add-topic prompt --add-topic agents --add-topic mit \
  --add-topic openai --add-topic anthropic --add-topic github-actions --add-topic ci \
  --add-topic tokens --add-topic prompt-engineering --add-topic nodejs
```

Update `package.json` `repository.url` if the final owner/name differs.

## Option B — Cursor Origin

If Ash prefers Origin instead of GitHub:

1. Create private/public Origin codebase from this folder.
2. Keep MIT + README CTA identical.
3. Skip npm until a public GitHub mirror exists (npm prefers a public repo URL).

## Option C — npm publish (optional, free)

```bash
npm login          # Ash personal or pragmex scope — Ash only
npm whoami
npm pack           # inspect tarball; should be tiny, no secrets
npm publish --access public
```

Scoped alternative: `@pragmex/prompt-budget-check` (requires npm org).

## Post-publish

- [ ] Pin README CTA: https://www.pragmex-agentics.com/contact
- [ ] Add repo link to Pragmex site footer or `/stack` later (zero spend)
- [ ] One Dev.to / LinkedIn mention (drafts already in `pragmex-revenue/`)
- [ ] Label inbound FormSubmit with tool name in subject when possible

## Do not

- Force-push, `--no-verify`, or commit `.env` / credentials
- Contact Ignition
- Spend on ads to promote the package
- Auto-email star-gazers or issue authors from LogiQ
