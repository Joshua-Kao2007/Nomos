import * as assert from 'assert';
import { analyzeOutputStructure } from '../analyzer/rules/outputStructure';

suite('outputStructure', () => {
    test('flags a prompt that requests output with no format constraints', () => {
        const result = analyzeOutputStructure('Generate a summary of the meeting notes.');

        assert.strictEqual(result.flagged, true);
        assert.strictEqual(result.ruleId, 'missing-output-structure');
        assert.strictEqual(result.severity, 'warning');
    });

    test('does not flag a prompt that specifies a JSON output structure', () => {
        const result = analyzeOutputStructure(
            'Generate a JSON object with fields: title, summary, action_items.'
        );

        assert.strictEqual(result.flagged, false);
    });

    test('does not flag an empty string', () => {
        const result = analyzeOutputStructure('');

        assert.strictEqual(result.flagged, false);
    });
});
