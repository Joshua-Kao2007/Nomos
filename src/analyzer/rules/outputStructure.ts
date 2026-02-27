/**
 * Rule A — Missing Output Structure
 *
 * Detects prompts that request structured output (using trigger words such as
 * "return", "give me", "list", "generate", "create", "output", "provide",
 * "explain", "write", "describe", "summarize", "tell me", "discuss", "help",
 * "analyze", or "compare")
 * but do not include any format or schema constraints (e.g. "json", "schema",
 * "format", "structure", "object", "array", "{", "}", "markdown", "bullet",
 * "numbered", or "table").
 *
 * When flagged, the rule advises the author to add explicit output format
 * instructions so the model's response is deterministic and machine-readable.
 */

import { RuleResult } from '../types';

const TRIGGER_WORDS: RegExp = /\b(return|give me|list|generate|create|output|provide|explain|write|describe|summarize|tell me|discuss|help|analyze|compare)\b/i;

const FORMAT_INDICATORS: RegExp =
    /\b(json|schema|format|structure|object|array|markdown|bullet|numbered|table)\b|[{}]/i;

/**
 * Analyzes a prompt string for missing output structure constraints.
 *
 * @param promptText - The raw prompt string to analyze.
 * @returns A RuleResult indicating whether the rule was flagged and why.
 */
export function analyzeOutputStructure(promptText: string): RuleResult {
    const hasTrigger = TRIGGER_WORDS.test(promptText);
    const hasFormatIndicator = FORMAT_INDICATORS.test(promptText);
    const flagged = hasTrigger && !hasFormatIndicator;

    return {
        flagged,
        ruleId: 'missing-output-structure',
        message: flagged
            ? 'Prompt requests structured output but no schema or format is defined.'
            : '',
        suggestion: flagged
            ? "Add explicit output format instructions, e.g. 'Return a JSON object with fields: ...'"
            : '',
        severity: 'warning',
    };
}
