import * as assert from 'assert';
import { analyzeToolUsage } from '../analyzer/rules/toolUsage';

suite('toolUsage', () => {
    test('flags "use the API" with no fallback specified', () => {
        const result = analyzeToolUsage('Use the API to retrieve the latest stock prices.');

        assert.strictEqual(result.flagged, true);
        assert.strictEqual(result.ruleId, 'tool-usage-no-fallback');
        assert.strictEqual(result.severity, 'warning');
    });

    test('flags "invoke the function" with no fallback specified', () => {
        const result = analyzeToolUsage('Invoke the function to calculate the total.');

        assert.strictEqual(result.flagged, true);
        assert.strictEqual(result.ruleId, 'tool-usage-no-fallback');
    });

    test('does not flag "use the API" when a fallback is specified', () => {
        const result = analyzeToolUsage(
            'Use the API to fetch data, fallback to cache if it fails.'
        );

        assert.strictEqual(result.flagged, false);
    });

    test('does not flag "call function" when error handling is specified', () => {
        const result = analyzeToolUsage(
            'Call function X to process the request, handle error if unavailable.'
        );

        assert.strictEqual(result.flagged, false);
    });

    test('does not flag an empty string', () => {
        const result = analyzeToolUsage('');

        assert.strictEqual(result.flagged, false);
    });
});
