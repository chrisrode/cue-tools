import * as assert from "assert";
import { Track } from "../models";
import { normalizeTracks } from "../normalizer";
import { formatCueTracks } from "../formatter";

suite("Timestamp grouping", () => {
    test("groups an entirely untimestamped list without mutating input", () => {
        const tracks: Track[] = [
            { number: 5, performer: "A", title: "ID", withTracks: [
                { performer: "B", title: "ID (Intro Edit)" }
            ] },
            { number: 9, performer: "C", title: "ID", withTracks: [] }
        ];
        const original = JSON.stringify(tracks);
        const normalized = normalizeTracks(tracks);
        assert.strictEqual(JSON.stringify(tracks), original);
        assert.strictEqual(normalized.length, 1);
        assert.strictEqual(normalized[0].timestamp, "00:00:00");
        assert.deepStrictEqual(normalized[0].withTracks.map(t => t.title), [
            "ID2 (Intro Edit)", "ID3"
        ]);
        assert.strictEqual(formatCueTracks(normalized, {
            appendEndMarker: true, mediaDurationSeconds: 90
        }).cueText, [
            "TRACK 01 AUDIO",
            '  TITLE "ID1 / ID2 (Intro Edit) / ID3 [Mixed]"',
            '  PERFORMER "A / B / C"',
            "  INDEX 01 00:00:00",
            "TRACK 02 AUDIO",
            "  INDEX 01 01:30:00"
        ].join("\n"));
    });

    test("keeps every explicit timestamp as a new group and handles empty input", () => {
        const tracks: Track[] = [4, 8].map(number => ({
            number, timestamp: "05:00:00", performer: "A",
            title: "Track", withTracks: []
        }));
        assert.deepStrictEqual(normalizeTracks(tracks).map(t => t.number), [1, 2]);
        assert.deepStrictEqual(normalizeTracks([]), []);
    });
});
