/**
 * @file extension.ts
 * @description Entry point for the Prompt Reliability Linter VSCode extension.
 *
 * On activation this module:
 *  1. Creates a persistent output channel ("Prompt Linter") used for all
 *     diagnostic messages throughout the extension's lifetime.
 *  2. Registers an editor-change listener that fires whenever the active
 *     text editor switches to a Python (.py) or TypeScript (.ts) file and
 *     logs the filename being analyzed.
 *  3. Calls detectPrompts on file open and on every save.
 *
 * Both the output channel and the listeners are pushed onto
 * `context.subscriptions` so VSCode disposes them automatically when the
 * extension host tears down.
 */

import * as vscode from 'vscode';
import { detectPrompts, setOutputChannel } from './parser/promptDetector';

/** The single shared output channel for the extension. */
let outputChannel: vscode.OutputChannel | undefined;

function isSupportedFile(fileName: string): boolean {
    return fileName.endsWith('.py') || fileName.endsWith('.ts');
}

function runDetection(document: vscode.TextDocument): void {
    if (!isSupportedFile(document.fileName)) {
        return;
    }
    outputChannel?.appendLine(`Analyzing file: ${document.fileName}`);
    detectPrompts(document);
}

/**
 * Called by VSCode when the extension is first activated.
 */
export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Prompt Linter');
    outputChannel.appendLine('Prompt Reliability Linter: Active ✓');
    context.subscriptions.push(outputChannel);

    setOutputChannel(outputChannel);

    // Run detection when the active editor changes (file open).
    const editorListener = vscode.window.onDidChangeActiveTextEditor(
        (editor: vscode.TextEditor | undefined) => {
            if (editor) {
                runDetection(editor.document);
            }
        }
    );
    context.subscriptions.push(editorListener);

    // Run detection on every save.
    const saveListener = vscode.workspace.onDidSaveTextDocument(
        (document: vscode.TextDocument) => {
            runDetection(document);
        }
    );
    context.subscriptions.push(saveListener);
}

/**
 * Called by VSCode when the extension is deactivated.
 */
export function deactivate(): void {
    outputChannel?.dispose();
    outputChannel = undefined;
}
