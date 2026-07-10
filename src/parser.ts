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
    let currentTrack: Track | undefined;
    let expectingWithTrack = false;

    while (i < lines.length) {
        const line = lines[i];

        if (classifyLine(line) === LineType.With) {
            expectingWithTrack = true;
            i++;
            continue;
        }

        if (expectingWithTrack && currentTrack && classifyLine(line) === LineType.Track) {
            const parsed = parseTrackLine(line);

            if (parsed) {
                currentTrack.withTracks.push({
                    performer: parsed.performer,
                    title: parsed.title
                });
            }

            expectingWithTrack = false;
            i++;
            continue;
        }

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

        if (expectingWithTrack && parsed && currentTrack) {
            currentTrack.withTracks.push({
                performer: parsed.performer,
                title: parsed.title
            });

            expectingWithTrack = false;
            i = trackLineIndex + 1;
            continue;
        }

        if (parsed) {
            const track: Track = {
                number,
                timestamp,
                performer: parsed.performer,
                title: parsed.title,
                withTracks: []
            };

            tracks.push(track);
            currentTrack = track;
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

    return {
        performer,
        title
    };
}
