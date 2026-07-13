import { classifyLine } from "./lexer";
import { LineType } from "./linetypes";
import { Token } from "./token";

export function tokenize(text: string): Token[] {
    const tokens = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => ({
            type: classifyLine(line),
            text: line
        }));

    classifyContextualUsernames(tokens);

    return tokens;
}

function classifyContextualUsernames(tokens: Token[]): void {
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const previousToken = tokens[i - 1];
        const nextToken = tokens[i + 1];

        if (token.type !== LineType.Unknown) {
            continue;
        }

        const followedByPopularity =
            nextToken?.type === LineType.PopularityCount;

        const contributorAfterSeparator =
            previousToken?.type === LineType.ContributorSeparator &&
            (
                nextToken?.type === LineType.SaveCount ||
                nextToken?.type === LineType.PreSaveCount ||
                nextToken?.type === LineType.PopularityCount
            );

        if (
            looksLikeUsername(token.text) &&
            (followedByPopularity || contributorAfterSeparator)
        ) {
            token.type = LineType.Username;
        }
    }
}

function looksLikeUsername(line: string): boolean {
    return (
        line.length <= 80 &&
        /^[\p{L}\p{N}_.-]+$/u.test(line)
    );
}