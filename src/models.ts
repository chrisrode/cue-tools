export interface WithTrack {
    performer: string;
    title: string;
}

export interface Track {
    number: number;
    timestamp: string;
    performer: string;
    title: string;
    withTracks: WithTrack[];
}