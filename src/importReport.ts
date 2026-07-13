import { LineType } from "./linetypes";

export interface ImportReport {
    importedTracks: number;
    importedWithTracks: number;
    identifiedTracks: number;
    ignoredLineTypes: Map<LineType, number>;
    ignoredLines: Map<string, number>;
}

export function createImportReport(): ImportReport {
    return {
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
    values.set(value, (values.get(value) ?? 0) + 1);
}