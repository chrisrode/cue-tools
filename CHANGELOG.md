# Changelog

# Changelog

## 0.5.2

### Added
- When tracks have no timecodes, Cue Tools prompts you to group them with the
  preceding track or keep them as separate CUE tracks at `00:00:00` for manual
  timing. Existing timecodes are preserved, and each track's "w/" entries stay
  with their parent. Dismissing the prompt cancels the import.
  
## 0.5.1

### Changed
- Update dependencies

## 0.5.0

### Added
- Regression coverage for timestamp-based grouping, including the Steve Aoki Tomorrowland tracklist.

### Changed
- Tracks without timestamps now join the preceding timestamped track, with titles and performers separated by ` / `.
- When no preceding timestamped track exists, the first track starts an initial group at `00:00:00`.
- Each track's `withTracks` entries remain immediately after their parent within the group.
- Explicitly timestamped tracks start new, sequentially numbered CUE tracks.
- Grouping applies to both structured JSON and copied tracklist text, preserving title normalization, ID numbering, and the final `[Mixed]` suffix.

## 0.4.2

### Added
- Optional LosslessCut end marker, enabled through `cue-tools.appendLosslessCutEndMarker`.
- Support for `mediaDurationSeconds` in structured JSON. When the end-marker setting is enabled, a titleless terminal CUE track is appended at the media endpoint so LosslessCut treats the final track as a segment.

## 0.4.1

### Fixed
- ID normalization now recognizes titles with parenthetical details, such as `ID (Intro Edit)`.
- Parenthetical ID details are preserved alongside the source title, with any trailing `(DJ Mix)` removed from the source title.

### Added
- Golden-file regression coverage for parenthetical IDs.

## 0.4.0

### Added
- Support for structured JSON exported by the Cue Tools browser extension.
- Import of track titles, performers, timestamps, and `withTracks` entries from structured JSON.
- Extraction of title, genre, and author metadata from structured JSON.
- Structured JSON parser tests and golden-file regression cases.

### Changed
- Structured JSON and copied tracklist text now use the same normalization and CUE formatting pipeline.

## v0.3.0

### Added
- Structured TracklistMetadata extraction
- Metadata extractor
- Artist profile detection
- Hosted show detection
- Event type extraction
- Related tracklist extraction
- Alias and membership extraction
- Modular lexer architecture
- Page metadata classification
- Lexer unit tests

### Changed
- Import report now includes extracted metadata.
- Unknown lines now include contextual information during development.
- Lexer refactored into classifier modules.

### Fixed
- Username detection is now context-aware.
- Eliminated stale output caused by moved TypeScript files.


## 0.2.0

### Added
- Tokenizer and token-based parser
- Stateful Parser class
- Title normalization pipeline
- Golden-file regression tests
- Shared CUE import pipeline entry point

### Changed
- Separated parsing, normalization, and formatting responsibilities


## 0.1.0

### Added
- Initial 1001Tracklists parser
- CUE formatter
- Track and WithTrack models
- Title normalization pipeline
- Producer credit removal
- Parenthesis normalization
- Record label stripping
- w/ track support
- Logger
