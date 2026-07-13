import { LineType } from "../linetypes";

export function classifyStructural(
    line: string
): LineType | undefined {
    if (/^\d{2}$/u.test(line)) {
        return LineType.TrackNumber;
    }

    if (
        /^\d{1,2}:\d{2}$/u.test(line) ||
        /^\d{1,2}:\d{2}:\d{2}$/u.test(line)
    ) {
        return LineType.Timestamp;
    }

    if (line === "w/") {
        return LineType.With;
    }

    if (line === "/") {
        return LineType.ContributorSeparator;
    }

    if (line.includes(" - ")) {
        return LineType.Track;
    }

    return undefined;
}