import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import { convertToCue } from "./testHelpers";

suite("CUE pipeline golden files", () => {
    const projectRoot = path.resolve(__dirname, "../..");
    const inputDirectory = path.join(projectRoot, "testdata", "input");
    const expectedDirectory = path.join(projectRoot, "testdata", "expected");

    const inputFiles = fs
        .readdirSync(inputDirectory)
        .filter(file => file.endsWith(".txt"))
        .sort();

    for (const inputFile of inputFiles) {
        const caseName = inputFile.replace(/\.txt$/i, "");
        const expectedFile = inputFile.replace(/\.txt$/i, ".cue");

        test(caseName, () => {
            const inputPath = path.join(inputDirectory, inputFile);
            const expectedPath = path.join(expectedDirectory, expectedFile);

            assert.ok(
                fs.existsSync(expectedPath),
                `Missing expected file: ${expectedPath}`
            );

            const input = normalizeLineEndings(
                fs.readFileSync(inputPath, "utf8")
            );

            const expected = normalizeLineEndings(
                fs.readFileSync(expectedPath, "utf8")
            ).trimEnd();

            const actual = normalizeLineEndings(
                convertToCue(input)
            ).trimEnd();

            assert.strictEqual(actual, expected);
        });
    }
});

function normalizeLineEndings(value: string): string {
    return value.replace(/\r\n/g, "\n");
}