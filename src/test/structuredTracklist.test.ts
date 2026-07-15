import * as assert from "assert";
import { tryParseStructuredTracklist } from "../structuredTracklist";

suite("Structured tracklist", () => {
    test("parses browser-extension JSON", () => {
        const input = JSON.stringify({
            format: "cue-tools-tracklist",
            version: 1,
            source: {
                site: "1001tracklists",
                url: "https://www.1001tracklists.com/test.html"
            },
            metadata: {
                genres: ["Trance"],
                title: "Example DJ @ Example Festival",
                author: "Example DJ"
            },
            tracks: [
                {
                    number: 1,
                    performer: "Artist One",
                    title: "Opening Track",
                    label: "UNKNOWN LABEL",
                    withTracks: []
                },
                {
                    number: 2,
                    performer: "Artist Two",
                    title: "Second Track",
                    timestamp: "1:04:27",
                    withTracks: [
                        {
                            performer: "Vocalist",
                            title: "Acappella",
                            label: "ANOTHER UNKNOWN LABEL"
                        }
                    ]
                }
            ]
        });

        const result = tryParseStructuredTracklist(input);

        assert.ok(result);
        assert.strictEqual(result.tracks.length, 2);
        assert.strictEqual(result.tracks[0].timestamp, "00:00:00");
        assert.strictEqual(result.tracks[1].timestamp, "64:27:00");
        assert.strictEqual(result.tracks[1].withTracks.length, 1);
        assert.strictEqual(result.metadata.title, "Example DJ @ Example Festival");
        assert.strictEqual(result.metadata.artists[0].name, "Example DJ");
    });

    test("returns undefined for ordinary clipboard text", () => {
        const result = tryParseStructuredTracklist(
            "01\n05:14\nArtist - Track LABEL"
        );

        assert.strictEqual(result, undefined);
    });

    test("returns undefined for unrelated JSON", () => {
        const result = tryParseStructuredTracklist(
            JSON.stringify({
                format: "something-else",
                version: 1,
                tracks: []
            })
        );

        assert.strictEqual(result, undefined);
    });
});