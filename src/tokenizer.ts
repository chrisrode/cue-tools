import { classifyLine } from "./lexer";
import { Token } from "./token";

export function tokenize(text: string): Token[] {

    return text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => ({
            type: classifyLine(line),
            text: line
        }));
}