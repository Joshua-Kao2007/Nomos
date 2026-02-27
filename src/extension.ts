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
import { analyzeOutputStructure } from './analyzer/rules/outputStructure';

/** The single shared output channel for the extension. */
let outputChannel: vscode.OutputChannel | undefined;
let diagnosticCollection: vscode.DiagnosticCollection | undefined;

function isSupportedFile(fileName: string): boolean {
    return fileName.endsWith('.py') || fileName.endsWith('.ts');
}

function runDetection(document: vscode.TextDocument): void {
    if (!isSupportedFile(document.fileName)) {
        diagnosticCollection?.delete(document.uri);
        return;
    }
    outputChannel?.appendLine(`Analyzing file: ${document.fileName}`);
    const matches = detectPrompts(document);

    const diagnostics: vscode.Diagnostic[] = [];
    for (const match of matches) {
        const result = analyzeOutputStructure(match.content);
        if (result.flagged) {
            const startPos = new vscode.Position(match.line, 0);
            const endLineText = document.lineAt(match.endLine).text;
            const endPos = new vscode.Position(match.endLine, endLineText.length);
            const range = new vscode.Range(startPos, endPos);

            const diagnostic = new vscode.Diagnostic(
                range,
                result.message,
                vscode.DiagnosticSeverity.Warning
            );
            diagnostic.source = 'Prompt Linter';
            diagnostics.push(diagnostic);
        }
    }
    diagnosticCollection?.set(document.uri, diagnostics);
}

/**
 * Called by VSCode when the extension is first activated.
 */
export function activate(context: vscode.ExtensionContext): void {
    outputChannel = vscode.window.createOutputChannel('Prompt Linter');
    outputChannel.appendLine('Prompt Reliability Linter: Active ✓');
    context.subscriptions.push(outputChannel);

    diagnosticCollection = vscode.languages.createDiagnosticCollection('prompt-linter');
    context.subscriptions.push(diagnosticCollection);

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
    diagnosticCollection?.dispose();
    diagnosticCollection = undefined;
}
