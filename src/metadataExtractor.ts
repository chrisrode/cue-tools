import { LineType } from "./linetypes";
import { Token } from "./token";
import {
    createTracklistMetadata,
    TracklistMetadata
} from "./tracklistMetadata";

export function extractTracklistMetadata(
    tokens: Token[]
): TracklistMetadata {
    const metadata = createTracklistMetadata();
    
    let collectingHostedShows = false;
    let collectingArtists = false;

    for (let index = 0; index < tokens.length; index++) {
        const previousToken = tokens[index - 1];
        const token = tokens[index];

        if (
            !metadata.title &&
            isLikelyTracklistTitle(token)
        ) {
            metadata.title = token.text;
            token.type = LineType.TracklistTitle;
            continue;
        }

        if (
            !metadata.eventDate &&
            token.type === LineType.EventDate
        ) {
            metadata.eventDate = token.text;
            continue;
        }

        if (
            !metadata.player &&
            token.type === LineType.Player
        ) {
            metadata.player = token.text;
            continue;
        }

        if (
            token.type === LineType.PageMetadata &&
            isGenreHeading(token.text)
        ) {
            const genreToken = findNextMeaningfulToken(
                tokens,
                index + 1
            );

            if (
                genreToken &&
                genreToken.type === LineType.Unknown
            ) {
                metadata.genres.push(genreToken.text);
                genreToken.type = LineType.Genre;
            }
        }

        if (
            token.type === LineType.PageMetadata &&
            normalizeHeading(token.text) === "most watched id's"
        ) {
            collectingArtists = true;
            continue;
        }

        if (collectingArtists) {
            if (token.type === LineType.Unknown) {
                const artist = parseArtistProfile(token.text);

                if (artist) {
                    metadata.artists.push(artist);
                    token.type = LineType.ArtistProfile;
                    continue;
                }
            }

            collectingArtists = false;
        }

        if (
            token.type === LineType.Unknown &&
            previousToken?.type === LineType.PageMetadata
        ) {
            const heading = normalizeHeading(previousToken.text);

            switch (heading) {
                case "aliases":
                    metadata.aliases.push(token.text);
                    token.type = LineType.Alias;
                    continue;

                case "member of":
                    metadata.memberOf.push(token.text);
                    token.type = LineType.Membership;
                    continue;

                case "hosted shows / podcasts":
                    metadata.hostedShows.push(token.text);
                    token.type = LineType.HostedShow;
                    continue;

                case "last tracks":
                    metadata.relatedTracklists.push(token.text);
                    token.type = LineType.RelatedTracklist;
                    continue;
            }
        }

        if (
            token.type === LineType.Unknown &&
            previousToken?.type === LineType.RelatedTracklist
        ) {
            metadata.eventTypes.push(token.text);
            token.type = LineType.EventType;
            continue;
        }

        if (
            token.type === LineType.Unknown &&
            previousToken?.type === LineType.PageMetadata &&
            normalizeHeading(previousToken.text) === "most watched id's"
        ) {
            const artist = parseArtistProfile(token.text);

            if (artist) {
                metadata.artists.push(artist);
                token.type = LineType.ArtistProfile;
                continue;
            }
        }

        if (
            token.type === LineType.PageMetadata &&
            normalizeHeading(token.text) === "hosted shows / podcasts"
        ) {
            collectingHostedShows = true;
            continue;
        }

        if (collectingHostedShows) {
            const heading =
                token.type === LineType.PageMetadata
                    ? normalizeHeading(token.text)
                    : undefined;

            if (heading === "producer chart ranks") {
                collectingHostedShows = false;
                continue;
            }

            if (token.type === LineType.Unknown) {
                metadata.hostedShows.push(token.text);
                token.type = LineType.HostedShow;
                continue;
            }

            // Ignore intervening metadata such as AH.FM,
            // but continue collecting until the ending heading.
            continue;
        }

    }

    return metadata;
}

function isLikelyTracklistTitle(token: Token): boolean {
    if (token.type !== LineType.Unknown) {
        return false;
    }

    return (
        token.text.includes(" @ ") &&
        /\b\d{4}-\d{2}-\d{2}$/u.test(token.text)
    );
}

function isGenreHeading(text: string): boolean {
    return text.trim().toLowerCase() === "tracklist genre(s)";
}

function findNextMeaningfulToken(
    tokens: Token[],
    startIndex: number
): Token | undefined {
    for (let index = startIndex; index < tokens.length; index++) {
        const token = tokens[index];

        if (
            token.type === LineType.PageMetadata ||
            token.type === LineType.NumericCount ||
            token.type === LineType.Url
        ) {
            continue;
        }

        return token;
    }

    return undefined;
}

function normalizeHeading(value: string): string {
    return value
        .replace(/\s+\(\d+\)$/u, "")
        .replace(/\s+/gu, " ")
        .trim()
        .toLowerCase();
}

function parseArtistProfile(
    text: string
): { name: string; country?: string } | undefined {
    const countries = [
        "Argentina",
        "Australia",
        "Belgium",
        "Brazil",
        "Canada",
        "Denmark",
        "Finland",
        "France",
        "Germany",
        "Ireland",
        "Israel",
        "Italy",
        "Netherlands",
        "Norway",
        "Poland",
        "Portugal",
        "Russia",
        "Spain",
        "Sweden",
        "Switzerland",
        "Ukraine",
        "United Kingdom",
        "United States"
    ].sort((a, b) => b.length - a.length);

    for (const country of countries) {
        if (text.endsWith(` ${country}`)) {
            return {
                name: text.slice(0, -country.length).trim(),
                country
            };
        }
    }

    return {
        name: text.trim()
    };
}