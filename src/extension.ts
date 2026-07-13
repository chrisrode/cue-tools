import * as vscode from "vscode";
import { importCue } from "./importer";
import { writeImportReport } from "./logger";

export function activate(context: vscode.ExtensionContext): void {
    const clipboardCommand = vscode.commands.registerCommand(
        "cue-tools.importTracklist",
        async () => {
            const clipboardText = await vscode.env.clipboard.readText();

            await importIntoActiveEditor(clipboardText);
        }
    );

    context.subscriptions.push(clipboardCommand);
}

export function deactivate(): void {}

async function importIntoActiveEditor(sourceText: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage("Open a CUE file first.");
        return;
    }

    const sourceTitle = extractDocumentTitle(editor.document.getText());

    const result = importCue(sourceText, {
        sourceTitle
    });

    const cueText = result.cueText;

    if (!cueText.trim()) {
        vscode.window.showWarningMessage(
            "Cue Tools did not find any tracks in the supplied text."
        );
        return;
    }

    const inserted = await editor.edit(editBuilder => {
        editBuilder.insert(editor.selection.active, cueText);
    });

    if (!inserted) {
        vscode.window.showErrorMessage(
            "Cue Tools could not edit the active document."
        );
        return;
    }

    writeImportReport(result.report, result.metadata);

    vscode.window.showInformationMessage(
        `Cue Tools imported ${result.report.importedTracks} ` +
        `track${result.report.importedTracks === 1 ? "" : "s"}.`
    );
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
}

function extractDocumentTitle(documentText: string): string | undefined {
    const match = documentText.match(/^TITLE\s+"([^"]+)"\s*$/mu);

    return match?.[1];
}