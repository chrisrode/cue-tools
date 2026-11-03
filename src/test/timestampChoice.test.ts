import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import { importCue, importCueWithTimestampChoice } from "../importer";

suite("Missing timecode import choice", () => {
    const fixture = path.resolve(__dirname, "../../testdata/steve-aoki-grouping");
    const json = fs.readFileSync(path.join(fixture, "input.json"), "utf8");

    test("group choice preserves the Steve Aoki golden output", async () => {
        const result = await importCueWithTimestampChoice(json, {}, async count => {
            assert.strictEqual(count, 15);
            return true;
        });
        assert.strictEqual(result?.cueText, importCue(json).cueText);
    });

    test("separate choice keeps 17 tracks and normalizes with-tracks", async () => {
        const result = await importCueWithTimestampChoice(json, {
            appendLosslessCutEndMarker: true
        }, async () => false);
        assert.ok(result);
        assert.strictEqual((result.cueText.match(/^TRACK /gm) ?? []).length, 18);
        assert.strictEqual((result.cueText.match(/INDEX 01 00:00:00/g) ?? []).length, 15);
        assert.ok(result.cueText.includes('TRACK 02 AUDIO\n  TITLE "Bring You To Power (Garmiani Edit) [Mixed]"'));
        assert.ok(result.cueText.includes('TRACK 04 AUDIO\n  TITLE "A Light That Never Comes (Vicetone Dub Mix) / A Light That Never Comes (TWOLOUD Remix) [Mixed]"'));
        assert.ok(result.cueText.includes("Freak (Acappella)"));
        assert.ok(result.cueText.includes("INDEX 01 05:30:00"));
        assert.ok(result.cueText.includes("INDEX 01 38:00:00"));
        assert.ok(result.cueText.endsWith("TRACK 18 AUDIO\n  INDEX 01 57:20:00"));
    });

    test("separate choice also works for copied text and preserves ID order", async () => {
        const result = await importCueWithTimestampChoice(
            "05\nA - ID\nw/\nB - ID (Intro Edit)\n09\nC - ID",
            {}, async () => false
        );
        assert.strictEqual(result?.cueText, [
            "TRACK 01 AUDIO",
            '  TITLE "ID1 / ID2 (Intro Edit) [Mixed]"',
            '  PERFORMER "A / B"',
            "  INDEX 01 00:00:00",
            "TRACK 02 AUDIO",
            '  TITLE "ID3 [Mixed]"',
            '  PERFORMER "C"',
            "  INDEX 01 00:00:00"
        ].join("\n"));
    });

    test("dismissal cancels the import", async () => {
        assert.strictEqual(await importCueWithTimestampChoice(
            json, {}, async () => undefined
        ), undefined);
    });

    test("fully timed lists and empty input do not prompt", async () => {
        for (const text of ["01\n00:00\nA - Track\nw/\nB - Vocal", ""]) {
            const result = await importCueWithTimestampChoice(text, {}, async () => {
                assert.fail("Unexpected prompt");
            });
            assert.strictEqual(result?.cueText, importCue(text).cueText);
        }
    });
});
