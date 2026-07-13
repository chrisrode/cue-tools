import { LineType } from "../linetypes";
import { classifyPageMetadata } from "./pageMetadata";
import { classifyStructural } from "./structural";
import { classifyTrackMetadata } from "./trackMetadata";
import { classifyValues } from "./values";

type LineClassifier = (line: string) => LineType | undefined;

const CLASSIFIERS: LineClassifier[] = [
    classifyStructural,
    classifyTrackMetadata,
    classifyValues,
    classifyPageMetadata
];

export function classifyLine(line: string): LineType {
    for (const classifier of CLASSIFIERS) {
        const result = classifier(line);

        if (result !== undefined) {
            return result;
        }
    }

    return LineType.Unknown;
}