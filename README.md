# Cue Tools

Cue Tools is a Visual Studio Code extension that streamlines creating CUE sheets from
1001Tracklists by converting copied tracklists into properly formatted CUE TRACK entries.

## Features

- Convert a copied 1001Tracklists page into CUE TRACK entries.
- Automatically detects:
  - Track numbers
  - Timestamps
  - Artists
  - Titles
  - Record labels
  - IDs
  - "w/" tracks
- Extracts useful tracklist metadata:
  - Title
  - Artists
  - Genre
  - Event date
  - Hosted shows
  - Related tracklists
- Generates an import report showing:
  - Tracks imported
  - Metadata extracted
  - Ignored metadata
  - Unknown lines

## Usage

1. Copy an entire tracklist page from 1001Tracklists.
2. Open a `.cue` file in VS Code.
3. Run **Cue Tools: Import Tracklist from Clipboard** from the Command Palette.
4. Paste or insert the generated TRACK entries.

## Development Status

This extension is currently in active development and has primarily been tested against 1001Tracklists pages.

## License

MIT