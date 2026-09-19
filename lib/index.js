'use strict';

/**
 * Approximate token estimators for prompt budget checks.
 * Not a tokenizer — intentionally simple, dependency-free, CI-friendly.
 * For production-grade counting, inquire with Pragmex for hardening.
 */

const HEURISTICS = {
  // chars / 4 — common rough English estimate
  chars4: (text) => Math.ceil(text.length / 4),
  // whitespace-split words * 1.3 — slightly conservative for code/markdown
  words13: (text) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return Math.ceil(words * 1.3);
  },
  // max of both — safer for CI gates
  max: (text) => Math.max(HEURISTICS.chars4(text), HEURISTICS.words13(text)),
};

const MODEL_HINTS = {
  'gpt-4': { context: 8192, note: 'legacy 8k; use gpt-4-turbo / 4o for larger' },
  'gpt-4o': { context: 128000, note: 'OpenAI GPT-4o family' },
  'gpt-4-turbo': { context: 128000, note: 'OpenAI GPT-4 Turbo' },
  'claude-3': { context: 200000, note: 'Anthropic Claude 3 family' },
  'claude-3.5': { context: 200000, note: 'Anthropic Claude 3.5' },
  'gemini-1.5': { context: 1000000, note: 'Google Gemini 1.5' },
  default: { context: 8192, note: 'generic default' },
};

function estimateTokens(text, heuristic = 'max') {
  const fn = HEURISTICS[heuristic] || HEURISTICS.max;
  return fn(String(text ?? ''));
}

function checkBudget(text, options = {}) {
  const {
    budget = 4096,
    heuristic = 'max',
    model = null,
    label = 'prompt',
  } = options;

  const tokens = estimateTokens(text, heuristic);
  const chars = String(text ?? '').length;
  const words = String(text ?? '').trim()
    ? String(text).trim().split(/\s+/).length
    : 0;

  let effectiveBudget = Number(budget);
  let modelHint = null;
  if (model) {
    const key = String(model).toLowerCase();
    modelHint = MODEL_HINTS[key] || MODEL_HINTS.default;
    if (!Number.isFinite(effectiveBudget) || options.budget == null) {
      // if budget omitted but model given, use 75% of context as soft default
      effectiveBudget = Math.floor(modelHint.context * 0.75);
    }
  }

  const over = tokens > effectiveBudget;
  const ratio = effectiveBudget > 0 ? tokens / effectiveBudget : Infinity;

  return {
    ok: !over,
    label,
    tokens,
    chars,
    words,
    budget: effectiveBudget,
    overBy: over ? tokens - effectiveBudget : 0,
    utilization: Number.isFinite(ratio) ? Math.round(ratio * 1000) / 10 : null,
    heuristic,
    model: model || null,
    modelHint,
  };
}

function formatReport(result, { json = false } = {}) {
  if (json) return JSON.stringify(result, null, 2);

  const status = result.ok ? 'OK' : 'OVER BUDGET';
  const lines = [
    `prompt-budget-check: ${status}`,
    `  file/label : ${result.label}`,
    `  tokens     : ${result.tokens} (approx, heuristic=${result.heuristic})`,
    `  budget     : ${result.budget}`,
    `  utilization: ${result.utilization == null ? 'n/a' : result.utilization + '%'}`,
    `  chars/words: ${result.chars} / ${result.words}`,
  ];
  if (result.model) {
    lines.push(`  model      : ${result.model}${result.modelHint ? ` (${result.modelHint.note})` : ''}`);
  }
  if (!result.ok) {
    lines.push(`  over by    : ${result.overBy} tokens`);
    lines.push('');
    lines.push('Tip: shrink system/user prompt, move examples to RAG, or raise --budget.');
    lines.push('Need production tokenizers / CI hardening? → https://www.pragmex-agentics.com/contact');
  }
  return lines.join('\n');
}

module.exports = {
  HEURISTICS,
  MODEL_HINTS,
  estimateTokens,
  checkBudget,
  formatReport,
};
