/**
 * Prompt Reliability Scorer
 *
 * Accepts the array of RuleResult objects produced by running all four lint
 * rules against a single prompt and computes a 0–100 reliability score.
 * The score starts at 100 and is decremented by a fixed penalty for each
 * rule that was flagged: -25 for missing output structure, -20 for an
 * ambiguous prompt, -20 for tool usage without a fallback, and -15 for
 * missing determinism guardrails. The minimum returned value is 0. A higher
 * score means the prompt is less likely to produce unreliable or inconsistent
 * model responses in production.
 */

import { RuleResult } from './types';

const PENALTIES: Record<string, number> = {
    'missing-output-structure': 25,
    'ambiguous-prompt': 20,
    'tool-usage-no-fallback': 20,
    'no-determinism-guardrails': 15,
};

/**
 * Computes a reliability score for a prompt based on which lint rules fired.
 *
 * @param results - Array of RuleResult objects, one per lint rule evaluated.
 * @returns An integer between 0 and 100 representing prompt reliability.
 */
export function scorePrompt(results: RuleResult[]): number {
    let score = 100;

    for (const result of results) {
        if (result.flagged) {
            const penalty = PENALTIES[result.ruleId] ?? 0;
            score -= penalty;
        }
    }

    return Math.max(0, score);
}
