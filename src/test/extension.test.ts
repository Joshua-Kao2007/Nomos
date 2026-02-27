import * as assert from 'assert';
import * as vscode from 'vscode';
import { activate, deactivate } from '../extension';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('activate and deactivate do not throw', () => {
        const mockContext = {
            subscriptions: [] as { dispose(): unknown }[],
        } as unknown as vscode.ExtensionContext;

        try {
            activate(mockContext);
        } catch (err) {
            assert.fail(`activate() threw an unexpected error: ${err}`);
        }

        try {
            deactivate();
        } catch (err) {
            assert.fail(`deactivate() threw an unexpected error: ${err}`);
        }
    });
});
