/**
 * Shared types for the Prompt Reliability Linter analyzer layer.
 * All lint rules return a RuleResult; the scorer and extension consume it.
 */

export type RuleResult = {
    flagged: boolean;
    ruleId: string;
    message: string;
    suggestion: string;
    severity: 'warning' | 'error';
};
