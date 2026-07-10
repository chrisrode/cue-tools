import * as vscode from "vscode";

let outputChannel: vscode.OutputChannel | undefined;

export function log(message: string): void {
    getChannel().appendLine(message);
}

export function warn(message: string): void {
    getChannel().appendLine(`[warn] ${message}`);
}

export function showLog(): void {
    getChannel().show();
}

function getChannel(): vscode.OutputChannel {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel("Cue Tools");
    }

    return outputChannel;
}
