/**
 * Rule D — No Determinism Guardrails
 *
 * Detects prompts that either explicitly invoke consistency expectations
 * ("always", "every time", "consistent") or—more broadly—simply lack any
 * deterministic formatting directive ("format", "structure", "always respond",
 * "must", "required", "exactly"). A prompt that sets a consistency expectation
 * without enforcing it, or that provides no structural anchors at all, is
 * likely to produce variable output across separate model invocations. This
 * makes the system harder to test, harder to integrate, and less reliable in
 * production.
 *
 * When flagged, the rule advises the author to add explicit deterministic
 * instructions (e.g. "Always respond in the following JSON format …") so
 * the model is constrained to a predictable output shape.
 */

import { RuleResult } from '../types';

const CONSISTENCY_TRIGGER: RegExp =
    /\b(always|every time|consistent)\b/i;

const DETERMINISM_GUARDRAILS: RegExp =
    /\b(format|structure|always respond|must|required|exactly)\b/i;

/**
 * Analyzes a prompt string for missing deterministic formatting guardrails.
 *
 * @param promptText - The raw prompt string to analyze.
 * @returns A RuleResult indicating whether the rule was flagged and why.
 */
export function analyzeDeterminism(promptText: string): RuleResult {
    const hasConsistencyTrigger = CONSISTENCY_TRIGGER.test(promptText);
    const hasGuardrails = DETERMINISM_GUARDRAILS.test(promptText);

    // Flag if the prompt uses consistency language but has no guardrails,
    // OR if the prompt has no guardrails at all.
    const flagged = hasConsistencyTrigger
        ? !hasGuardrails
        : !hasGuardrails;

    return {
        flagged,
        ruleId: 'no-determinism-guardrails',
        message: flagged
            ? 'Prompt may produce variable outputs. Consider adding deterministic formatting instructions.'
            : '',
        suggestion: flagged
            ? "Add a formatting directive such as 'Always respond using the following structure: …' to ensure consistent, predictable output."
            : '',
        severity: 'warning',
    };
}
