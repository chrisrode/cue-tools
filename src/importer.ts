import { formatCueTracks } from "./formatter";
import { ImportReport } from "./importReport";
import { normalizeTracks } from "./normalizer";
import { parseTracklist } from "./parser";
import { TracklistMetadata } from "./tracklistMetadata";

export interface ImportOptions {
    sourceTitle?: string;
}

export interface ImportResult {
    cueText: string;
    report: ImportReport;
    metadata: TracklistMetadata;
}

export function importCue(
    text: string,
    options: ImportOptions = {}
): ImportResult {
    const parseResult = parseTracklist(text);

    const normalizedTracks = normalizeTracks(
        parseResult.tracks,
        options.sourceTitle
    );

    parseResult.report.identifiedTracks = countIds(normalizedTracks);

    return {
        cueText: formatCueTracks(normalizedTracks),
        report: parseResult.report,
        metadata: parseResult.metadata
};
}

function countIds(
    tracks: ReturnType<typeof normalizeTracks>
): number {
    return tracks.reduce((total, track) => {
        const mainId = /^ID\d+(?:\s|$)/u.test(track.title) ? 1 : 0;

        const withIds = track.withTracks.filter(withTrack =>
            /^ID\d+(?:\s|$)/u.test(withTrack.title)
        ).length;

        return total + mainId + withIds;
    }, 0);
}