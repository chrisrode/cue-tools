import { LineType } from "./linetypes";

export type ImportSource =
    | "plain-text"
    | "structured-json";

export interface ImportReport {
    source: ImportSource;
    importedTracks: number;
    importedWithTracks: number;
    identifiedTracks: number;
    ignoredLineTypes: Map<LineType, number>;
    ignoredLines: Map<string, number>;
}

export function createImportReport(
    source: ImportSource = "plain-text"
): ImportReport {
    return {
        source,
        importedTracks: 0,
        importedWithTracks: 0,
        identifiedTracks: 0,
        ignoredLineTypes: new Map<LineType, number>(),
        ignoredLines: new Map<string, number>()
    };
}

export function incrementCount<T>(
    values: Map<T, number>,
    value: T
): void {
    values.set(
        value,
        (values.get(value) ?? 0) + 1
    );
}