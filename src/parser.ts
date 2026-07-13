import { Track } from "./models";
import { LineType } from "./linetypes";
import { Token } from "./token";
import { tokenize } from "./tokenizer";
import {
    createImportReport,
    ImportReport,
    incrementCount
} from "./importReport";
import { extractTracklistMetadata } from "./metadataExtractor";
import { TracklistMetadata } from "./tracklistMetadata";

export interface ParseResult {
    tracks: Track[];
    report: ImportReport;
    metadata: TracklistMetadata;
}

interface ParserResult {
    tracks: Track[];
    report: ImportReport;
}

export function parseTracklist(text: string): ParseResult {
    const tokens = tokenize(text);
    const metadata = extractTracklistMetadata(tokens);
    const result = new Parser(tokens).parse();

    return {
        ...result,
        metadata
    };
}

class Parser {
    private readonly tokens: Token[];
    private index = 0;

    private readonly tracks: Track[] = [];
    private currentTrack: Track | undefined;
    private expectingWithTrack = false;

    private readonly report = createImportReport();

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    public parse(): ParserResult {
        while (!this.atEnd()) {
            const token = this.current();

            if (!token) {
                break;
            }

            switch (token.type) {
                case LineType.With:
                    this.expectingWithTrack = true;
                    this.advance();
                    break;

                case LineType.TrackNumber:
                    this.parseTrack();
                    break;

                case LineType.Track:
                    if (this.expectingWithTrack && this.currentTrack) {
                        this.parseWithTrack();
                    } else {
                        this.advance();
                    }
                    break;

                default:
                    this.recordIgnoredToken(token);
                    this.advance();
                    break;
            }
        }

        this.report.importedTracks = this.tracks.length;

        this.report.importedWithTracks = this.tracks.reduce(
            (total, track) => total + track.withTracks.length,
            0
        );

        return {
            tracks: this.tracks,
            report: this.report
        };
    }

    private parseTrack(): void {
        const numberToken = this.current();

        if (!numberToken) {
            return;
        }

        const number = parseInt(numberToken.text, 10);
        let timestamp = "00:00:00";

        this.advance();

        if (this.current()?.type === LineType.Timestamp) {
            timestamp = this.normalizeTimestamp(this.current()!.text);
            this.advance();
        }

        const trackToken = this.current();

        if (!trackToken || trackToken.type !== LineType.Track) {
            return;
        }

        const parsed = this.parseTrackLine(trackToken.text);

        if (parsed) {
            const track: Track = {
                number,
                timestamp,
                performer: parsed.performer,
                title: parsed.title,
                withTracks: []
            };

            this.tracks.push(track);
            this.currentTrack = track;
        }

        this.advance();
    }

    private parseWithTrack(): void {
        const token = this.current();

        if (!token || token.type !== LineType.Track || !this.currentTrack) {
            this.expectingWithTrack = false;
            return;
        }

        const parsed = this.parseTrackLine(token.text);

        if (parsed) {
            this.currentTrack.withTracks.push({
                performer: parsed.performer,
                title: parsed.title
            });
        }

        this.expectingWithTrack = false;
        this.advance();
    }

    private parseTrackLine(
        line: string
    ): { performer: string; title: string } | undefined {
        const separator = line.indexOf(" - ");

        if (separator < 0) {
            return undefined;
        }

        return {
            performer: line.substring(0, separator).trim(),
            title: line.substring(separator + 3).trim()
        };
    }

    private normalizeTimestamp(timestamp: string): string {
        const parts = timestamp.split(":").map(Number);

        if (parts.length === 2) {
            const [minutes, seconds] = parts;

            return (
                `${minutes.toString().padStart(2, "0")}:` +
                `${seconds.toString().padStart(2, "0")}:00`
            );
        }

        if (parts.length === 3) {
            const [hours, minutes, seconds] = parts;
            const totalMinutes = hours * 60 + minutes;

            return (
                `${totalMinutes.toString().padStart(2, "0")}:` +
                `${seconds.toString().padStart(2, "0")}:00`
            );
        }

        return timestamp;
    }

    private current(): Token | undefined {
        return this.tokens[this.index];
    }

    private peek(offset = 1): Token | undefined {
       return this.tokens[this.index + offset];
    }   

    private advance(): Token | undefined {
        const token = this.current();
        this.index++;
        return token;
    }

    private atEnd(): boolean {
        return this.index >= this.tokens.length;
    }

    private recordIgnoredToken(token: Token): void {
        if (token.type === LineType.Unknown) {
            this.recordUnknownWithContext();
            return;
        }

        incrementCount(this.report.ignoredLineTypes, token.type);
    }

    private recordUnknownWithContext(): void {
        const previous = this.tokens[this.index - 1]?.text ?? "<start>";
        const current = this.tokens[this.index]?.text ?? "<missing>";
        const next = this.tokens[this.index + 1]?.text ?? "<end>";

        const description =
            `Previous: ${previous}\n` +
            `Unknown:  ${current}\n` +
            `Next:     ${next}`;

        incrementCount(this.report.ignoredLines, description);
    }
}