import { Track } from "./models";

export interface FormatCueOptions {
    appendEndMarker?: boolean;
    mediaDurationSeconds?: number;
}

export interface FormatCueResult {
    cueText: string;
    endMarkerAppended: boolean;
}

export function formatCueTracks(
    tracks: Track[],
    options: FormatCueOptions = {}
): FormatCueResult {
    const lines: string[] = [];

    for (const track of tracks) {
        const performers = [
            track.performer,
            ...track.withTracks.map(t => t.performer)
        ].join(" / ");

        const titles = [
            track.title,
            ...track.withTracks.map(t => t.title)
        ].join(" / ");

        lines.push(`TRACK ${track.number.toString().padStart(2, "0")} AUDIO`);
        lines.push(`  TITLE "${ensureMixed(titles)}"`);
        lines.push(`  PERFORMER "${performers}"`);
        lines.push(`  INDEX 01 ${track.timestamp}`);
    }

    const shouldAppend =
        options.appendEndMarker === true &&
        options.mediaDurationSeconds !== undefined &&
        Number.isFinite(options.mediaDurationSeconds) &&
        options.mediaDurationSeconds > 0;

    if (shouldAppend) {
        const nextTrackNumber = tracks.reduce(
            (maximum, track) => Math.max(maximum, track.number),
            0
        ) + 1;

        lines.push(
            `TRACK ${nextTrackNumber.toString().padStart(2, "0")} AUDIO`
        );
        lines.push(
            `  INDEX 01 ${formatCueTimestamp(options.mediaDurationSeconds!)}`
        );
    }

    return {
        cueText: lines.join("\n"),
        endMarkerAppended: shouldAppend
    };
}

function formatCueTimestamp(durationSeconds: number): string {
    const totalFrames = Math.max(
        0,
        Math.floor(durationSeconds * 75)
    );
    const minutes = Math.floor(totalFrames / (75 * 60));
    const seconds = Math.floor(totalFrames / 75) % 60;
    const frames = totalFrames % 75;

    return (
        `${minutes.toString().padStart(2, "0")}:` +
        `${seconds.toString().padStart(2, "0")}:` +
        frames.toString().padStart(2, "0")
    );
}

function ensureMixed(title: string): string {
    if (title.endsWith("[Mixed]")) {
        return title;
    }

    return `${title} [Mixed]`;
}
