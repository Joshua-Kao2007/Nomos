/**
 * Rule B — Ambiguous Prompt
 *
 * Detects prompts that use vague, open-ended verbs ("explain", "write about",
 * "discuss", "help with", "tell me about", "describe") without pairing them
 * with any output constraint such as a word count, length qualifier, format
 * specifier, audience indicator, tone directive, or structural hint (bullet,
 * numbered, paragraph). Prompts that match only trigger words but carry no
 * constraints are likely to produce inconsistent, unpredictable responses
 * from the model.
 *
 * When flagged, the rule advises the author to add at least one explicit
 * constraint so that the model has clear guidance on the shape and scope of
 * its reply.
 */

import { RuleResult } from '../types';

const VAGUE_VERBS: RegExp =
    /\b(explain|write about|discuss|help with|tell me about|describe)\b/i;

const CONSTRAINT_INDICATORS: RegExp =
    /\b(word count|length|format|audience|tone|short|long|briefly?|detailed|bullet|numbered|paragraph)\b/i;

/**
 * Analyzes a prompt string for ambiguous language lacking output constraints.
 *
 * @param promptText - The raw prompt string to analyze.
 * @returns A RuleResult indicating whether the rule was flagged and why.
 */
export function analyzeAmbiguity(promptText: string): RuleResult {
    const hasVagueVerb = VAGUE_VERBS.test(promptText);
    const hasConstraint = CONSTRAINT_INDICATORS.test(promptText);
    const flagged = hasVagueVerb && !hasConstraint;

    return {
        flagged,
        ruleId: 'ambiguous-prompt',
        message: flagged
            ? 'Prompt lacks output constraints. Consider specifying format, length, or audience.'
            : '',
        suggestion: flagged
            ? "Add a constraint such as 'in 3 bullet points', 'in under 100 words', or 'for a technical audience' to reduce response variability."
            : '',
        severity: 'warning',
    };
}
