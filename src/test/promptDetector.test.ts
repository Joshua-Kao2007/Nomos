import * as assert from 'assert';
import { detectPrompts, PromptMatch } from '../parser/promptDetector';
import * as vscode from 'vscode';

/** Builds a minimal TextDocument stub from a raw string. */
function makeDocument(content: string): vscode.TextDocument {
    return {
        getText: () => content,
        fileName: 'test.py',
    } as unknown as vscode.TextDocument;
}

suite('promptDetector', () => {
    test('detects a system_prompt variable assignment', () => {
        const doc = makeDocument(`system_prompt = "You are a helpful assistant."`);
        const matches: PromptMatch[] = detectPrompts(doc);

        assert.strictEqual(matches.length, 1);
        assert.strictEqual(matches[0].variableName, 'system_prompt');
        assert.strictEqual(matches[0].line, 0);
    });

    test('returns empty array when no prompt variables are present', () => {
        const doc = makeDocument(
            `x = 42\nname = "Alice"\nresult = x + 1`
        );
        const matches: PromptMatch[] = detectPrompts(doc);

        assert.strictEqual(matches.length, 0);
    });

    test('detects a bare triple-quoted string longer than 50 characters', () => {
        const longContent = 'A'.repeat(60);
        const doc = makeDocument(`"""\n${longContent}\n"""`);
        const matches: PromptMatch[] = detectPrompts(doc);

        assert.strictEqual(matches.length, 1);
        assert.strictEqual(matches[0].variableName, '');
        assert.strictEqual(matches[0].line, 0);
    });

    test('does NOT detect a bare triple-quoted string of 50 chars or fewer', () => {
        const shortContent = 'A'.repeat(50);
        const doc = makeDocument(`"""\n${shortContent}\n"""`);
        const matches: PromptMatch[] = detectPrompts(doc);

        assert.strictEqual(matches.length, 0);
    });

    test('detects prompt variable (case-insensitive)', () => {
        const doc = makeDocument(`PROMPT = "Do something useful."`);
        const matches: PromptMatch[] = detectPrompts(doc);

        assert.strictEqual(matches.length, 1);
        assert.strictEqual(matches[0].variableName.toLowerCase(), 'prompt');
    });

    test('detects named triple-quoted prompt variable', () => {
        const doc = makeDocument(
            `system_message = """\nYou are an expert assistant.\nAnswer clearly.\n"""`
        );
        const matches: PromptMatch[] = detectPrompts(doc);

        assert.strictEqual(matches.length, 1);
        assert.strictEqual(matches[0].variableName, 'system_message');
        assert.strictEqual(matches[0].line, 0);
    });

    test('detects f-string prompt assignment', () => {
        const doc = makeDocument(`instruction = f"Summarize this: {text}"`);
        const matches: PromptMatch[] = detectPrompts(doc);

        assert.strictEqual(matches.length, 1);
        assert.strictEqual(matches[0].variableName, 'instruction');
    });
});
