import * as vscode from 'vscode';
import { Track } from "./models";
import { formatCueTracks } from "./formatter";
import { parse1001Tracklist } from "./parser";
import { normalizeTracks } from "./normalizer";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('cue-tools.importFromClipboard', async () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage('Open a CUE file first.');
      return;
    }

    const clipboard = await vscode.env.clipboard.readText();
    const parsedTracks = parse1001Tracklist(clipboard);
    const normalizedTracks = normalizeTracks(parsedTracks);
    const cueText = formatCueTracks(normalizedTracks);

    await editor.edit(editBuilder => {
        editBuilder.insert(editor.selection.active, cueText);
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}