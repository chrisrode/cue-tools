import { Track } from "./models";
import { classifyLine } from "./classifier";
import { LineType } from "./linetypes";

export function parse1001Tracklist(text: string): Track[] {
    const lines = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const tracks: Track[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (classifyLine(line) !== LineType.TrackNumber) {
            i++;
            continue;
        }

        const number = parseInt(line, 10);
        let timestamp = "00:00:00";
        let trackLineIndex = i + 1;

        if (classifyLine(lines[i + 1] ?? "") === LineType.Timestamp) {
            timestamp = normalizeTimestamp(lines[i + 1]);
            trackLineIndex = i + 2;
        }

        const trackLine = lines[trackLineIndex];

        if (!trackLine) {
            i++;
            continue;
        }

        const parsed = parseTrackLine(trackLine);

        if (parsed) {
            tracks.push({
                number,
                timestamp,
                performer: parsed.performer,
                title: parsed.title,
                withTracks: []
            });
        }

        i = trackLineIndex + 1;
    }

    return tracks;
}

function normalizeTimestamp(timestamp: string): string {
    const parts = timestamp.split(":").map(Number);

    if (parts.length === 2) {
        const [minutes, seconds] = parts;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:00`;
    }

    if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;
        const totalMinutes = hours * 60 + minutes;
        return `${totalMinutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:00`;
    }

    return timestamp;
}

function parseTrackLine(line: string): { performer: string; title: string } | undefined {
    const separator = line.indexOf(" - ");

    if (separator < 0) {
        return undefined;
    }

    const performer = line.substring(0, separator).trim();
    let title = line.substring(separator + 3).trim();

    title = stripLikelyLabel(title);

    return {
        performer,
        title
    };
}

function stripLikelyLabel(title: string): string {
    const knownLabels = [
        "SOUKSONIC/STMPD",
        "DIM MAK",
        "STMPD",
        "HMG",
        "ARMADA",
        "REVEALED",
        "SPINNIN'",
        "BLACK HOLE",
        "COLDHARBOUR",
        "PRYDA",
        "AXTONE",
        "FREE"
    ];

    for (const label of knownLabels.sort((a, b) => b.length - a.length)) {
        if (title.endsWith(` ${label}`)) {
            return title.slice(0, -label.length).trim();
        }
    }

    return title
        .replace(/\s{2,}[A-Z0-9&'().:/ -]+$/u, "")
        .trim();
}