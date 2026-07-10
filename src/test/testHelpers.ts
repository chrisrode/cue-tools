import { parse1001Tracklist } from "../parser";
import { normalizeTracks } from "../normalizer";
import { formatCueTracks } from "../formatter";

export function convertToCue(input: string): string {
    return formatCueTracks(
        normalizeTracks(
            parse1001Tracklist(input)
        )
    );
}