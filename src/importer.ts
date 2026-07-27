import { formatCueTracks } from "./formatter";
import {
    createImportReport,
    ImportReport
} from "./importReport";
import { Track } from "./models";
import { normalizeTracks } from "./normalizer";
import { parseTracklist } from "./parser";
import { tryParseStructuredTracklist } from "./structuredTracklist";
import { TracklistMetadata } from "./tracklistMetadata";

export interface ImportOptions {
    sourceTitle?: string;
    appendLosslessCutEndMarker?: boolean;
}

export interface ImportResult {
    cueText: string;
    report: ImportReport;
    metadata: TracklistMetadata;
    endMarkerAppended: boolean;
}

interface ImportSource {
    tracks: Track[];
    metadata: TracklistMetadata;
    report: ImportReport;
    mediaDurationSeconds?: number;
}

export function importCue(
    text: string,
    options: ImportOptions = {}
): ImportResult {
    const source = createImportSource(text);

    const sourceTitle =
        options.sourceTitle ??
        source.metadata.title;

    const normalizedTracks = normalizeTracks(
        source.tracks,
        sourceTitle
    );

    source.report.identifiedTracks = countIds(normalizedTracks);

    const formatted = formatCueTracks(normalizedTracks, {
        appendEndMarker:
            options.appendLosslessCutEndMarker === true,
        ...(source.mediaDurationSeconds !== undefined
            ? { mediaDurationSeconds: source.mediaDurationSeconds }
            : {})
    });

    return {
        cueText: formatted.cueText,
        report: source.report,
        metadata: source.metadata,
        endMarkerAppended: formatted.endMarkerAppended
    };
}

function createImportSource(text: string): ImportSource {
    const structured = tryParseStructuredTracklist(text);

    if (structured) {
        const report = createImportReport("structured-json");

        report.importedTracks = structured.tracks.length;
        report.importedWithTracks = structured.tracks.reduce(
            (sum: number, track: Track) =>
                sum + track.withTracks.length,
            0
        );

        return {
            tracks: structured.tracks,
            metadata: structured.metadata,
            report,
            ...(structured.mediaDurationSeconds !== undefined
                ? {
                    mediaDurationSeconds:
                        structured.mediaDurationSeconds
                }
                : {})
        };
    }

    const parsed = parseTracklist(text);

    return {
        tracks: parsed.tracks,
        metadata: parsed.metadata,
        report: parsed.report
    };
}

function countIds(tracks: Track[]): number {
    return tracks.reduce((total, track) => {
        const mainId = /^ID\d+(?:\s|$)/u.test(track.title)
            ? 1
            : 0;

        const withTrackIds = track.withTracks.filter(
            withTrack =>
                /^ID\d+(?:\s|$)/u.test(withTrack.title)
        ).length;

        return total + mainId + withTrackIds;
    }, 0);
}
