import { Track } from "./models";

export function formatCueTracks(tracks: Track[]): string {

    const lines: string[] = [];

    for (const track of tracks) {

        lines.push(`TRACK ${track.number.toString().padStart(2, "0")} AUDIO`);
        lines.push(`  TITLE "${ensureMixed(track.title)}"`);
        lines.push(`  PERFORMER "${track.performer}"`);
        lines.push(`  INDEX 01 ${track.timestamp}`);

        for (const withTrack of track.withTracks) {

            lines.push(`  REM WITHTRACK "${withTrack.performer} - ${withTrack.title}"`);
        }
    }

    return lines.join("\n");
}

function ensureMixed(title: string): string {
    if (title.endsWith("[Mixed]")) {
        return title;
    }

    return `${title} [Mixed]`;
}
