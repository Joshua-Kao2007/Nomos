import * as assert from 'assert';
import { scorePrompt } from '../analyzer/scorer';
import { RuleResult } from '../analyzer/types';

const flagged = (ruleId: string): RuleResult => ({
    flagged: true,
    ruleId,
    message: '',
    suggestion: '',
    severity: 'warning',
});

const notFlagged = (ruleId: string): RuleResult => ({
    flagged: false,
    ruleId,
    message: '',
    suggestion: '',
    severity: 'warning',
});

suite('scorer', () => {
    test('returns 100 when no rules are flagged', () => {
        const results: RuleResult[] = [
            notFlagged('missing-output-structure'),
            notFlagged('ambiguous-prompt'),
            notFlagged('tool-usage-no-fallback'),
            notFlagged('no-determinism-guardrails'),
        ];

        assert.strictEqual(scorePrompt(results), 100);
    });

    test('deducts 25 when only missing-output-structure is flagged (score: 75)', () => {
        const results: RuleResult[] = [
            flagged('missing-output-structure'),
            notFlagged('ambiguous-prompt'),
            notFlagged('tool-usage-no-fallback'),
            notFlagged('no-determinism-guardrails'),
        ];

        assert.strictEqual(scorePrompt(results), 75);
    });

    test('deducts 20 when only ambiguous-prompt is flagged (score: 80)', () => {
        const results: RuleResult[] = [
            notFlagged('missing-output-structure'),
            flagged('ambiguous-prompt'),
            notFlagged('tool-usage-no-fallback'),
            notFlagged('no-determinism-guardrails'),
        ];

        assert.strictEqual(scorePrompt(results), 80);
    });

    test('deducts 20 when only tool-usage-no-fallback is flagged (score: 80)', () => {
        const results: RuleResult[] = [
            notFlagged('missing-output-structure'),
            notFlagged('ambiguous-prompt'),
            flagged('tool-usage-no-fallback'),
            notFlagged('no-determinism-guardrails'),
        ];

        assert.strictEqual(scorePrompt(results), 80);
    });

    test('deducts 15 when only no-determinism-guardrails is flagged (score: 85)', () => {
        const results: RuleResult[] = [
            notFlagged('missing-output-structure'),
            notFlagged('ambiguous-prompt'),
            notFlagged('tool-usage-no-fallback'),
            flagged('no-determinism-guardrails'),
        ];

        assert.strictEqual(scorePrompt(results), 85);
    });

    test('applies combined deductions when multiple rules are flagged', () => {
        // 100 - 25 (output structure) - 20 (ambiguity) = 55
        const results: RuleResult[] = [
            flagged('missing-output-structure'),
            flagged('ambiguous-prompt'),
            notFlagged('tool-usage-no-fallback'),
            notFlagged('no-determinism-guardrails'),
        ];

        assert.strictEqual(scorePrompt(results), 55);
    });

    test('returns score of 20 when all four rules are flagged (100 - 25 - 20 - 20 - 15)', () => {
        const results: RuleResult[] = [
            flagged('missing-output-structure'),
            flagged('ambiguous-prompt'),
            flagged('tool-usage-no-fallback'),
            flagged('no-determinism-guardrails'),
        ];

        assert.strictEqual(scorePrompt(results), 20);
    });

    test('never returns a score below 0 even when extra flagged results are supplied', () => {
        // Simulate more than enough deductions to drive the score below zero
        const results: RuleResult[] = [
            flagged('missing-output-structure'),
            flagged('ambiguous-prompt'),
            flagged('tool-usage-no-fallback'),
            flagged('no-determinism-guardrails'),
            // Duplicate flagged entries to push raw total well below 0
            flagged('missing-output-structure'),
            flagged('ambiguous-prompt'),
        ];

        assert.ok(scorePrompt(results) >= 0);
    });

    test('returns 100 when given an empty results array', () => {
        assert.strictEqual(scorePrompt([]), 100);
    });
});
