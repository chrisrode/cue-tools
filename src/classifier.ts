import { LineType } from "./linetypes";

export function classifyLine(line: string): LineType {

    if (/^\d{2}$/.test(line)) {
        return LineType.TrackNumber;
    }

    if (/^\d{1,2}:\d{2}$/.test(line) ||
        /^\d{1,2}:\d{2}:\d{2}$/.test(line)) {
        return LineType.Timestamp;
    }

    if (line === "w/") {
        return LineType.With;
    }

    if (line.endsWith("Artwork")) {
        return LineType.Artwork;
    }

    if (/^Save\s+\d+/.test(line) ||
        /^Pre-Save\s+\d+/.test(line)) {
        return LineType.SaveCount;
    }

    if (/^\(\d/.test(line)) {
        return LineType.UserCount;
    }

    if (line.includes(" - ")) {
        return LineType.Track;
    }

    return LineType.Unknown;
}