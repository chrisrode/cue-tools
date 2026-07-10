export function fixParenthesisSpacing(title: string): string {
    return title.replace(/([^\s])\(/g, "$1 (");
}

export function convertSubsequentParentheses(title: string): string {
    let depth = 0;
    let firstPairCompleted = false;
    let result = "";

    for (const char of title) {
        if (char === "(") {
            depth++;

            if (firstPairCompleted || depth > 1) {
                result += "[";
            } else {
                result += "(";
            }

            continue;
        }

        if (char === ")") {
            if (firstPairCompleted || depth > 1) {
                result += "]";
            } else {
                result += ")";
                firstPairCompleted = true;
            }

            depth = Math.max(0, depth - 1);
            continue;
        }

        result += char;
    }

    return result;
}