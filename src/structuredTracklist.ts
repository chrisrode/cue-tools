import { Track, WithTrack } from "./models";
import {
    createTracklistMetadata,
    TracklistMetadata
} from "./tracklistMetadata";

export interface StructuredTracklistPayload {
    format: "cue-tools-tracklist";
    version: 1;
    source: StructuredSource;
    metadata: StructuredMetadata;
    tracks: StructuredTrack[];
}

export interface StructuredSource {
    site: string;
    url: string;
}

export interface StructuredMetadata {
    genres: string[];
    title?: string;
    headline?: string;
    author?: string;
    description?: string;
    sourceUrl?: string;
    artworkUrl?: string;
    published?: string;
    modified?: string;
    declaredTrackCount?: number;
}

export interface StructuredTrack {
    number: number;
    performer: string;
    title: string;
    label?: string;
    timestamp?: string;
    withTracks: StructuredWithTrack[];
}

export interface StructuredWithTrack {
    performer: string;
    title: string;
    label?: string;
}

export interface StructuredImportSource {
    tracks: Track[];
    metadata: TracklistMetadata;
}

export function tryParseStructuredTracklist(
    text: string
): StructuredImportSource | undefined {
    const trimmed = text.trim();

    if (!trimmed.startsWith("{")) {
        return undefined;
    }

    let value: unknown;

    try {
        value = JSON.parse(trimmed);
    } catch {
        return undefined;
    }

    if (!isStructuredTracklistPayload(value)) {
        return undefined;
    }

    return {
        tracks: value.tracks.map(mapTrack),
        metadata: mapMetadata(value)
    };
}

function isStructuredTracklistPayload(
    value: unknown
): value is StructuredTracklistPayload {
    if (!isRecord(value)) {
        return false;
    }

    return (
        value.format === "cue-tools-tracklist" &&
        value.version === 1 &&
        isStructuredSource(value.source) &&
        isStructuredMetadata(value.metadata) &&
        Array.isArray(value.tracks) &&
        value.tracks.every(isStructuredTrack)
    );
}

function isStructuredSource(
    value: unknown
): value is StructuredSource {
    return (
        isRecord(value) &&
        typeof value.site === "string" &&
        typeof value.url === "string"
    );
}

function isStructuredMetadata(
    value: unknown
): value is StructuredMetadata {
    if (!isRecord(value)) {
        return false;
    }

    return (
        Array.isArray(value.genres) &&
        value.genres.every(genre => typeof genre === "string") &&
        isOptionalString(value.title) &&
        isOptionalString(value.headline) &&
        isOptionalString(value.author) &&
        isOptionalString(value.description) &&
        isOptionalString(value.sourceUrl) &&
        isOptionalString(value.artworkUrl) &&
        isOptionalString(value.published) &&
        isOptionalString(value.modified) &&
        (
            value.declaredTrackCount === undefined ||
            typeof value.declaredTrackCount === "number"
        )
    );
}

function isStructuredTrack(
    value: unknown
): value is StructuredTrack {
    if (!isRecord(value)) {
        return false;
    }

    return (
        typeof value.number === "number" &&
        typeof value.performer === "string" &&
        typeof value.title === "string" &&
        isOptionalString(value.label) &&
        isOptionalString(value.timestamp) &&
        Array.isArray(value.withTracks) &&
        value.withTracks.every(isStructuredWithTrack)
    );
}

function isStructuredWithTrack(
    value: unknown
): value is StructuredWithTrack {
    return (
        isRecord(value) &&
        typeof value.performer === "string" &&
        typeof value.title === "string" &&
        isOptionalString(value.label)
    );
}

function isOptionalString(value: unknown): boolean {
    return value === undefined || typeof value === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function mapTrack(track: StructuredTrack): Track {
    return {
        number: track.number,
        timestamp: normalizeTimestamp(track.timestamp),
        performer: track.performer.trim(),
        title: track.title.trim(),
        withTracks: track.withTracks.map(mapWithTrack)
    };
}

function mapWithTrack(track: StructuredWithTrack): WithTrack {
    return {
        performer: track.performer.trim(),
        title: track.title.trim()
    };
}

function mapMetadata(
    payload: StructuredTracklistPayload
): TracklistMetadata {
    const metadata = createTracklistMetadata();

    metadata.title = payload.metadata.title;
    metadata.genres = [...payload.metadata.genres];

    if (payload.metadata.author) {
        metadata.artists.push({
            name: payload.metadata.author
        });
    }

    return metadata;
}

function normalizeTimestamp(timestamp: string | undefined): string {
    if (!timestamp) {
        return "00:00:00";
    }

    const parts = timestamp.split(":").map(Number);

    if (parts.length === 2) {
        const [minutes, seconds] = parts;

        return (
            `${minutes.toString().padStart(2, "0")}:` +
            `${seconds.toString().padStart(2, "0")}:00`
        );
    }

    if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;
        const totalMinutes = hours * 60 + minutes;

        return (
            `${totalMinutes.toString().padStart(2, "0")}:` +
            `${seconds.toString().padStart(2, "0")}:00`
        );
    }

    return timestamp;
}