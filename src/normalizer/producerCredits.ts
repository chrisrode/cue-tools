export function removeProducerCredits(title: string): string {
    return title
        .replace(/\s*\(Co-Prod\. by [^)]+\)/giu, "")
        .replace(/\s*\(Prod\. by [^)]+\)/giu, "")
        .replace(/\s{2,}/g, " ")
        .trim();
}