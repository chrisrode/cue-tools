import { Track } from "../models";
import { KNOWN_LABELS } from "./labels";
import { removeProducerCredits } from "./producerCredits";
import { fixParenthesisSpacing } from "./parentheses";
import { convertSubsequentParentheses } from "./parentheses";

const TITLE_NORMALIZERS = [
    stripKnownLabel,
    removeProducerCredits,
    fixParenthesisSpacing,
    convertSubsequentParentheses
];

export function normalizeTracks(tracks: Track[]): Track[] {
    return tracks.map(track => ({
        ...track,
        title: normalizeTitle(track.title),
        withTracks: track.withTracks.map(withTrack => ({
            ...withTrack,
            title: normalizeTitle(withTrack.title)
        }))
    }));
}

function normalizeTitle(title: string): string {
    return TITLE_NORMALIZERS.reduce(
        (current, normalizer) => normalizer(current),
        title
    );
}

function stripKnownLabel(title: string): string {
    for (const label of KNOWN_LABELS) {
        if (title.endsWith(` ${label}`)) {
            return title.slice(0, -label.length).trim();
        }
    }

    return title
        .replace(/\s{2,}[A-Z0-9&'().:/ -]+$/u, "")
        .trim();
}
