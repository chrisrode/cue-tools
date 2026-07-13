import { LineType } from "../linetypes";

export function classifyTrackMetadata(
    line: string
): LineType | undefined {
    if (/^artwork placeholder$/iu.test(line)) {
        return LineType.ArtworkPlaceholder;
    }

    if (line.endsWith(" Artwork")) {
        return LineType.Artwork;
    }

    if (/^Save\s+\d+$/iu.test(line)) {
        return LineType.SaveCount;
    }

    if (/^Pre-Save\s+\d+$/iu.test(line)) {
        return LineType.PreSaveCount;
    }

    if (
        /^[\p{L}\p{N}_.-]+\([\d.,]+[kKmM]?\)$/u.test(line)
    ) {
        return LineType.ContributorSummary;
    }

    if (/^\([\d.,]+[kKmM]?\)$/u.test(line)) {
        return LineType.PopularityCount;
    }

    if (/^\d+\s+linked positions? found$/iu.test(line)) {
        return LineType.LinkedPositions;
    }

    if (/^Show$/iu.test(line)) {
        return LineType.Show;
    }

    return undefined;
}