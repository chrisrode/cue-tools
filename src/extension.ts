import * as vscode from 'vscode';
import { Track } from "./models";
import { formatCueTracks } from "./formatter";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('cue-tools.insertSampleTrack', async () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage('Open a CUE file first.');
      return;
    }

    const tracks: Track[] = [
        {
            number: 1,
            timestamp: "00:00:00",
            performer: "ChatGPT",
            title: "Hello World [Mixed]",
            withTracks: [
                {
                    performer: "Example Artist",
                    title: "Example Acappella"
                }
            ]
        }
    ];

    const cueText = formatCueTracks(tracks);

    await editor.edit(editBuilder => {
        editBuilder.insert(editor.selection.active, cueText);
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}