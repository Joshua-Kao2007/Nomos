/**
 * Rule C — Tool Usage Without Fallback
 *
 * Detects prompts that instruct the model to invoke an external tool or
 * function ("use tools", "call function", "use the", "invoke", "run the")
 * but do not include any failure-handling language ("if it fails",
 * "fallback", "if unavailable", "error", "handle", "fallback to",
 * "otherwise"). Prompts that trigger tool calls without specifying what
 * the model should do when a tool is unavailable or returns an error leave
 * the system in an undefined state, causing silent failures or unhelpful
 * model responses.
 *
 * When flagged, the rule advises the author to add explicit fallback
 * instructions so the model can degrade gracefully when a tool cannot
 * be invoked.
 */

import { RuleResult } from '../types';

const TOOL_TRIGGER: RegExp =
    /\b(use tools|call function|use the|invoke|run the)\b/i;

const FALLBACK_INDICATORS: RegExp =
    /\b(if it fails|fallback|if unavailable|error|handle|fallback to|otherwise)\b/i;

/**
 * Analyzes a prompt string for tool usage instructions that lack fallback handling.
 *
 * @param promptText - The raw prompt string to analyze.
 * @returns A RuleResult indicating whether the rule was flagged and why.
 */
export function analyzeToolUsage(promptText: string): RuleResult {
    const hasTool = TOOL_TRIGGER.test(promptText);
    const hasFallback = FALLBACK_INDICATORS.test(promptText);
    const flagged = hasTool && !hasFallback;

    return {
        flagged,
        ruleId: 'tool-usage-no-fallback',
        message: flagged
            ? 'No failure handling or tool-call fallback specified.'
            : '',
        suggestion: flagged
            ? "Add a fallback instruction such as 'If the tool is unavailable, respond with the best available information instead.'"
            : '',
        severity: 'warning',
    };
}
