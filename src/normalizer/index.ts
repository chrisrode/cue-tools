import { Track, WithTrack } from "../models";
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

export function normalizeTracks(
    tracks: Track[],
    sourceTitle?: string
): Track[] {
    let idNumber = 0;

    return tracks.map(track => {
        const normalizedMain = normalizeIdentity(
            track.performer,
            track.title
        );

        const normalizedWithTracks = track.withTracks.map(withTrack =>
            normalizeWithTrack(withTrack)
        );

        return {
            ...track,
            performer: normalizedMain.performer,
            title: normalizedMain.title,
            withTracks: normalizedWithTracks
        };
    });

    function normalizeWithTrack(withTrack: WithTrack): WithTrack {
        const normalized = normalizeIdentity(
            withTrack.performer,
            withTrack.title
        );

        return {
            ...withTrack,
            performer: normalized.performer,
            title: normalized.title
        };
    }

    function normalizeIdentity(
        performer: string,
        rawTitle: string
    ): { performer: string; title: string } {
        let title = normalizeTitle(rawTitle);
        const normalizedPerformer = performer;

        const idMatch = title.match(
            /^ID(?:\s*\((.+)\))?$/iu
        );

        if (idMatch) {
            idNumber++;

            const detail =
                idMatch[1]?.trim() || undefined;

            const normalizedSourceTitle = sourceTitle
                ? normalizeSourceTitle(sourceTitle)
                : undefined;

            const details = [
                detail,
                normalizedSourceTitle
                    ? `from ${normalizedSourceTitle}`
                    : undefined
            ].filter(
                (value): value is string =>
                    value !== undefined
            );

            title = details.length > 0
                ? `ID${idNumber} (${details.join("; ")})`
                : `ID${idNumber}`;
        }

        return {
            performer: normalizedPerformer,
            title
        };
    }
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

function normalizeSourceTitle(title: string): string {
    return title
        .replace(/\s+\(DJ Mix\)$/iu, "")
        .trim();
}