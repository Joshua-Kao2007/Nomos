import * as vscode from 'vscode';

export type PromptMatch = {
    line: number;
    text: string;
    variableName: string;
};

const PROMPT_VAR_NAMES = [
    'prompt',
    'system_prompt',
    'system_message',
    'instruction',
    'user_message',
];

// Matches: varName = "...", varName = '...', varName = f"...", varName = f'...'
const SINGLE_LINE_PATTERN = new RegExp(
    `^\\s*(${PROMPT_VAR_NAMES.join('|')})\\s*=\\s*f?['"]{1}`,
    'i'
);

// Matches: varName = """  or  varName = '''
const TRIPLE_QUOTE_START_PATTERN = new RegExp(
    `^\\s*(${PROMPT_VAR_NAMES.join('|')})\\s*=\\s*(?:"""|\'\'\')`,
    'i'
);

// Matches any triple-quoted string start (no variable name required)
const BARE_TRIPLE_QUOTE_PATTERN = /"""|'''/;

let outputChannel: vscode.OutputChannel | undefined;

export function setOutputChannel(channel: vscode.OutputChannel): void {
    outputChannel = channel;
}

function logMatch(lineIndex: number, text: string): void {
    const preview = text.length > 50 ? text.slice(0, 50) + '...' : text;
    outputChannel?.appendLine(`Found prompt at line ${lineIndex + 1}: ${preview}`);
}

export function detectPrompts(document: vscode.TextDocument): PromptMatch[] {
    const matches: PromptMatch[] = [];
    const lines = document.getText().split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Check for named variable with triple-quoted string
        const tripleVarMatch = TRIPLE_QUOTE_START_PATTERN.exec(line);
        if (tripleVarMatch) {
            const variableName = tripleVarMatch[1];
            const quoteChar = line.includes('"""') ? '"""' : "'''";
            const startIdx = line.indexOf(quoteChar) + 3;
            let content = line.slice(startIdx);
            let j = i + 1;

            // Collect lines until closing triple quote
            while (j < lines.length && !lines[j].includes(quoteChar)) {
                content += '\n' + lines[j];
                j++;
            }
            if (j < lines.length) {
                const closeIdx = lines[j].indexOf(quoteChar);
                content += '\n' + lines[j].slice(0, closeIdx);
            }

            const fullText = line.trimStart();
            logMatch(i, fullText);
            matches.push({ line: i, text: fullText, variableName });
            i = j + 1;
            continue;
        }

        // Check for named variable with single/double quoted string
        const singleLineMatch = SINGLE_LINE_PATTERN.exec(line);
        if (singleLineMatch) {
            const variableName = singleLineMatch[1];
            const fullText = line.trimStart();
            logMatch(i, fullText);
            matches.push({ line: i, text: fullText, variableName });
            i++;
            continue;
        }

        // Check for bare triple-quoted string > 50 chars (no variable name)
        if (BARE_TRIPLE_QUOTE_PATTERN.test(line)) {
            const quoteChar = line.includes('"""') ? '"""' : "'''";
            const startIdx = line.indexOf(quoteChar) + 3;
            let content = line.slice(startIdx);
            let j = i + 1;

            while (j < lines.length && !lines[j].includes(quoteChar)) {
                content += '\n' + lines[j];
                j++;
            }
            if (j < lines.length) {
                const closeIdx = lines[j].indexOf(quoteChar);
                content += '\n' + lines[j].slice(0, closeIdx);
            }

            if (content.trim().length > 50) {
                const fullText = line.trimStart();
                logMatch(i, fullText);
                matches.push({ line: i, text: fullText, variableName: '' });
            }
            i = j + 1;
            continue;
        }

        i++;
    }

    return matches;
}
