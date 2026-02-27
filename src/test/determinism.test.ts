import * as assert from 'assert';
import { analyzeDeterminism } from '../analyzer/rules/determinism';

suite('determinism', () => {
    test('flags a prompt with no format, structure, must, required, or exactly mentions', () => {
        const result = analyzeDeterminism('Tell me something interesting about space.');

        assert.strictEqual(result.flagged, true);
        assert.strictEqual(result.ruleId, 'no-determinism-guardrails');
        assert.strictEqual(result.severity, 'warning');
    });

    test('does not flag a prompt that explicitly mentions "format"', () => {
        const result = analyzeDeterminism(
            'Respond in a consistent format: title, then body, then conclusion.'
        );

        assert.strictEqual(result.flagged, false);
    });

    test('does not flag a prompt that mentions "must"', () => {
        const result = analyzeDeterminism(
            'You must always include a confidence score at the end of your answer.'
        );

        assert.strictEqual(result.flagged, false);
    });

    test('flags an empty string because it contains no determinism guardrails', () => {
        const result = analyzeDeterminism('');

        assert.strictEqual(result.flagged, true);
    });
});
