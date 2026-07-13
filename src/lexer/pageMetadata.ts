import { LineType } from "../linetypes";
import { KNOWN_PAGE_METADATA } from "../pageMetadata";

export function classifyPageMetadata(
    line: string
): LineType | undefined {
    const normalized = line
        .replace(/\s+\(\d+\)$/u, "")
        .replace(/\s+/gu, " ")
        .trim()
        .toLowerCase();

    if (KNOWN_PAGE_METADATA.has(normalized)) {
        return LineType.PageMetadata;
    }

    return undefined;
}