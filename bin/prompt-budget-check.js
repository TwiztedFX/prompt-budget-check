#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { checkBudget, formatReport } = require('../lib/index.js');

const USAGE = `
prompt-budget-check — estimate prompt token budget (zero deps)

Usage:
  prompt-budget-check <file> [options]
  prompt-budget-check --stdin [options]
  cat prompt.txt | prompt-budget-check --stdin --budget 2000

Options:
  --budget <n>       Max tokens allowed (default: 4096)
  --heuristic <name> chars4 | words13 | max (default: max)
  --model <name>     gpt-4 | gpt-4o | claude-3 | claude-3.5 | gemini-1.5
                     (sets soft default budget to 75% context if --budget omitted)
  --json             Machine-readable JSON report
  --help, -h         Show this help
  --version, -v      Show version

Exit codes:
  0  under budget
  1  over budget or invalid usage
  2  file read error

Paid hardening / custom features / studio Package B:
  https://www.pragmex-agentics.com/contact
`.trim();

function parseArgs(argv) {
  const args = { file: null, stdin: false, budget: undefined, heuristic: 'max', model: null, json: false };
  const a = argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    const t = a[i];
    if (t === '--help' || t === '-h') return { help: true };
    if (t === '--version' || t === '-v') return { version: true };
    if (t === '--stdin') { args.stdin = true; continue; }
    if (t === '--json') { args.json = true; continue; }
    if (t === '--budget') { args.budget = Number(a[++i]); continue; }
    if (t === '--heuristic') { args.heuristic = a[++i]; continue; }
    if (t === '--model') { args.model = a[++i]; continue; }
    if (t.startsWith('-')) {
      console.error(`Unknown option: ${t}`);
      return { error: true };
    }
    if (!args.file) args.file = t;
    else {
      console.error(`Unexpected argument: ${t}`);
      return { error: true };
    }
  }
  return args;
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => chunks.push(c));
    process.stdin.on('end', () => resolve(chunks.join('')));
    process.stdin.on('error', reject);
    if (process.stdin.isTTY) {
      reject(new Error('No stdin data (TTY). Pass a file or pipe text.'));
    }
  });
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(USAGE);
    process.exit(0);
  }
  if (args.version) {
    const pkg = require('../package.json');
    console.log(pkg.version);
    process.exit(0);
  }
  if (args.error || (!args.file && !args.stdin)) {
    console.error(USAGE);
    process.exit(1);
  }
  if (args.budget !== undefined && (!Number.isFinite(args.budget) || args.budget < 0)) {
    console.error('--budget must be a non-negative number');
    process.exit(1);
  }

  let text;
  let label;
  try {
    if (args.stdin) {
      text = await readStdin();
      label = 'stdin';
    } else {
      const abs = path.resolve(args.file);
      text = fs.readFileSync(abs, 'utf8');
      label = path.relative(process.cwd(), abs) || abs;
    }
  } catch (err) {
    console.error(`Read error: ${err.message}`);
    process.exit(2);
  }

  const opts = {
    heuristic: args.heuristic,
    model: args.model,
    label,
  };
  if (args.budget !== undefined) opts.budget = args.budget;

  const result = checkBudget(text, opts);
  console.log(formatReport(result, { json: args.json }));
  process.exit(result.ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(2);
});
