export interface TracklistArtist {
    name: string;
    country?: string;
}

export interface TracklistMetadata {
    title?: string;
    eventDate?: string;
    player?: string;
    genres: string[];
    artists: TracklistArtist[];
    aliases: string[];
    memberOf: string[];
    hostedShows: string[];
    relatedTracklists: string[];
    eventTypes: string[];
}

export function createTracklistMetadata(): TracklistMetadata {
    return {
        genres: [],
        artists: [],
        aliases: [],
        memberOf: [],
        hostedShows: [],
        relatedTracklists: [],
        eventTypes: []
    };
}