import * as assert from "assert";
import { classifyLine } from "../lexer";
import { LineType } from "../linetypes";
import { KNOWN_PAGE_METADATA } from "../pageMetadata";
import { classifyPageMetadata } from "../lexer/pageMetadata";

suite("Lexer", () => {
    const cases: Array<[string, LineType]> = [
        ["01", LineType.TrackNumber],
        ["1:04:27", LineType.Timestamp],
        ["05:14", LineType.Timestamp],
        ["w/", LineType.With],
        ["/", LineType.ContributorSeparator],
        ["artwork placeholder", LineType.ArtworkPlaceholder],
        [
            "Martin Garrix & Dyro Latency Artwork",
            LineType.Artwork
        ],
        ["Save 181", LineType.SaveCount],
        ["Pre-Save 0", LineType.PreSaveCount],
        ["(180.7k)", LineType.PopularityCount],
        ["(1.5M)", LineType.PopularityCount],
        ["5 linked positions found", LineType.LinkedPositions],
        ["Show", LineType.Show],
        [
            "Martin Garrix & Dyro - Latency STMPD",
            LineType.Track
        ]
    ];

    for (const [line, expectedType] of cases) {
        test(`classifies "${line}"`, () => {
            assert.strictEqual(classifyLine(line), expectedType);
        });
    }

    test("leaves unfamiliar multiword text unknown", () => {
        assert.strictEqual(
            classifyLine("Unexpected Page Message"),
            LineType.Unknown
        );
    });

    test("loads the complete page metadata set", () => {
        assert.ok(
            KNOWN_PAGE_METADATA.size > 40,
            `Expected more than 40 entries, found ${KNOWN_PAGE_METADATA.size}`
        );

        assert.ok(KNOWN_PAGE_METADATA.has("add"));
        assert.ok(KNOWN_PAGE_METADATA.has("apple music"));
        assert.ok(KNOWN_PAGE_METADATA.has("general information"));
        assert.ok(KNOWN_PAGE_METADATA.has("youtube"));
    });

    test("classifies known page metadata", () => {
        assert.strictEqual(
            classifyLine("Add"),
            LineType.PageMetadata
        );

        assert.strictEqual(
            classifyLine("Apple Music"),
            LineType.PageMetadata
        );

        assert.strictEqual(
            classifyLine("Google Search (2)"),
            LineType.PageMetadata
        );

        assert.strictEqual(
            classifyLine("YouTube"),
            LineType.PageMetadata
        );
    });

    test("page metadata classifier recognizes known values directly", () => {
        assert.strictEqual(
            classifyPageMetadata("Add"),
            LineType.PageMetadata
        );

        assert.strictEqual(
            classifyPageMetadata("Google Search (2)"),
            LineType.PageMetadata
        );
    });
});