'use strict';

const assert = require('assert');
const path = require('path');
const { spawnSync } = require('child_process');
const { estimateTokens, checkBudget } = require('../lib/index.js');

const bin = path.join(__dirname, '..', 'bin', 'prompt-budget-check.js');
const sample = path.join(__dirname, '..', 'examples', 'sample-prompt.txt');
const fat = path.join(__dirname, '..', 'examples', 'fat-prompt.txt');

// unit
assert.strictEqual(estimateTokens('abcd'), 2); // default heuristic = max // chars4 → 1, words13 → 2 → max 2? wait 'abcd' is 1 word
// 'abcd' length 4 → chars4=1; words=1 → words13=2; max=2
assert.strictEqual(estimateTokens('abcd', 'chars4'), 1);
assert.strictEqual(estimateTokens('abcd', 'words13'), 2);
assert.strictEqual(estimateTokens('abcd', 'max'), 2);

const under = checkBudget('hello world', { budget: 100, label: 't' });
assert.strictEqual(under.ok, true);

const over = checkBudget('word '.repeat(500), { budget: 10, label: 't' });
assert.strictEqual(over.ok, false);
assert.ok(over.overBy > 0);

// CLI: under budget
let r = spawnSync(process.execPath, [bin, sample, '--budget', '500'], { encoding: 'utf8' });
assert.strictEqual(r.status, 0, r.stderr || r.stdout);
assert.match(r.stdout, /OK/);

// CLI: over budget
r = spawnSync(process.execPath, [bin, fat, '--budget', '50'], { encoding: 'utf8' });
assert.strictEqual(r.status, 1, r.stderr || r.stdout);
assert.match(r.stdout, /OVER BUDGET/);
assert.match(r.stdout, /pragmex-agentics\.com\/contact/);

// CLI: json
r = spawnSync(process.execPath, [bin, sample, '--budget', '500', '--json'], { encoding: 'utf8' });
assert.strictEqual(r.status, 0);
const parsed = JSON.parse(r.stdout);
assert.strictEqual(parsed.ok, true);
assert.ok(parsed.tokens > 0);

// CLI: version
r = spawnSync(process.execPath, [bin, '--version'], { encoding: 'utf8' });
assert.strictEqual(r.status, 0);
assert.match(r.stdout.trim(), /^\d+\.\d+\.\d+$/);

console.log('All tests passed.');
