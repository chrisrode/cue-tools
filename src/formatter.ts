import { Track } from "./models";

export function formatCueTracks(tracks: Track[]): string {

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

    return lines.join("\n");
}

function ensureMixed(title: string): string {
    if (title.endsWith("[Mixed]")) {
        return title;
    }

    return `${title} [Mixed]`;
}
