# Changelog

# Changelog

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
