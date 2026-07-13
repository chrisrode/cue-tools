import { LineType } from "../linetypes";

export function classifyValues(
    line: string
): LineType | undefined {
    if (/^\d+\s*\/\s*\d+$/u.test(line)) {
        return LineType.FractionCount;
    }

    if (/^\d{4}#\d+$/u.test(line)) {
        return LineType.ChartRank;
    }

    if (/^\d+$/u.test(line)) {
        return LineType.NumericCount;
    }

    if (
        /^(?:(?:\d+)\s+hours?\s+)?(?:\d+)\s+minutes?\s+(?:\d+)\s+seconds$/iu.test(
            line
        )
    ) {
        return LineType.Duration;
    }

    if (
        /^\d+\s+(?:minutes?|hours?|days?|months?|years?)\s+ago$/iu.test(
            line
        )
    ) {
        return LineType.RelativeTime;
    }

    if (/^(?:https?:\/\/|1001\.tl\/)\S+$/iu.test(line)) {
        return LineType.Url;
    }

    if (
        /^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s.+GMT$/iu.test(line)
    ) {
        return LineType.PostedDate;
    }

    if (
        /^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s+[A-Z][a-z]{2}\s+\d{1,2}\s+\d{4}$/u.test(line)
    ) {
        return LineType.EventDate;
    }

    if (
        /^\d+\s+users?\s*\+\s*\d+\s+guests?$/iu.test(line)
    ) {
        return LineType.AudienceCount;
    }

    if (/^Player\s+\d+\s+\[\d+:\d{2}:\d{2}\]$/iu.test(line)) {
        return LineType.Player;
    }

    return undefined;
}