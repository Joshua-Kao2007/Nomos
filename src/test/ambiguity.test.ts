import * as assert from 'assert';
import { analyzeAmbiguity } from '../analyzer/rules/ambiguity';

suite('ambiguity', () => {
    test('flags a prompt with "explain" and no constraints', () => {
        const result = analyzeAmbiguity('Can you explain quantum computing?');

        assert.strictEqual(result.flagged, true);
        assert.strictEqual(result.ruleId, 'ambiguous-prompt');
        assert.strictEqual(result.severity, 'warning');
    });

    test('flags a prompt with "discuss" and no constraints', () => {
        const result = analyzeAmbiguity('Please discuss the history of the Roman Empire.');

        assert.strictEqual(result.flagged, true);
        assert.strictEqual(result.ruleId, 'ambiguous-prompt');
    });

    test('does not flag a prompt with "explain" when "format" is present', () => {
        const result = analyzeAmbiguity('Explain the process in a numbered format.');

        assert.strictEqual(result.flagged, false);
    });

    test('does not flag a prompt with "explain" when "brief" is present', () => {
        const result = analyzeAmbiguity('Explain the concept briefly.');

        assert.strictEqual(result.flagged, false);
    });

    test('does not flag an empty string', () => {
        const result = analyzeAmbiguity('');

        assert.strictEqual(result.flagged, false);
    });
});
