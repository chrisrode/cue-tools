import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import { importCue, ImportOptions } from "../importer";

suite("CUE pipeline golden files", () => {
    const projectRoot = path.resolve(__dirname, "../..");
    const testDataDirectory = path.join(projectRoot, "testdata");

    const caseDirectories = fs
        .readdirSync(testDataDirectory, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort();

    for (const caseName of caseDirectories) {
        test(caseName, () => {
            const caseDirectory = path.join(
                testDataDirectory,
                caseName
            );

            const inputPath = path.join(caseDirectory, "input.txt");
            const expectedPath = path.join(
                caseDirectory,
                "expected.cue"
            );
            const optionsPath = path.join(
                caseDirectory,
                "options.json"
            );

            assert.ok(
                fs.existsSync(inputPath),
                `Missing input file: ${inputPath}`
            );

            assert.ok(
                fs.existsSync(expectedPath),
                `Missing expected file: ${expectedPath}`
            );

            const input = readNormalizedFile(inputPath);
            const expected = readNormalizedFile(expectedPath).trimEnd();

            const options = readOptions(optionsPath);

            const result = importCue(input, options);

            const actual = normalizeLineEndings(
                result.cueText
            ).trimEnd();

            assert.strictEqual(actual, expected);
        });
    }
});

function readNormalizedFile(filePath: string): string {
    return normalizeLineEndings(
        fs.readFileSync(filePath, "utf8")
    );
}

function readOptions(filePath: string): ImportOptions {
    if (!fs.existsSync(filePath)) {
        return {};
    }

    const contents = fs.readFileSync(filePath, "utf8");

    return JSON.parse(contents) as ImportOptions;
}

function normalizeLineEndings(value: string): string {
    return value
        .replace(/^\uFEFF/u, "")
        .replace(/\r\n/g, "\n");
}