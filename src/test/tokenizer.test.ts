import * as assert from "assert";
import { tokenize } from "../tokenizer";
import { LineType } from "../linetypes";

suite("Tokenizer", () => {
    test("classifies usernames when followed by a popularity count", () => {
        const tokens = tokenize(
`Zinderlong
(180.7k)
Luigi.edm7
(414.2k)`
        );

        assert.strictEqual(tokens[0].type, LineType.Username);
        assert.strictEqual(tokens[1].type, LineType.PopularityCount);
        assert.strictEqual(tokens[2].type, LineType.Username);
        assert.strictEqual(tokens[3].type, LineType.PopularityCount);
    });

    test("leaves a standalone username-like line unknown", () => {
        const tokens = tokenize("Zinderlong");

        assert.strictEqual(tokens[0].type, LineType.Unknown);
    });
});