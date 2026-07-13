import * as vscode from "vscode";
import { ImportReport } from "./importReport";
import { LineType } from "./linetypes";
import { TracklistMetadata } from "./tracklistMetadata";

let outputChannel: vscode.OutputChannel | undefined;

export function log(message: string): void {
    getChannel().appendLine(message);
}

export function warn(message: string): void {
    getChannel().appendLine(`[warn] ${message}`);
}

export function writeImportReport(
    report: ImportReport,
    metadata: TracklistMetadata
): void {
    const channel = getChannel();

    channel.clear();
    channel.appendLine("Cue Tools Import Report");
    channel.appendLine("=======================");
    channel.appendLine("");
    channel.appendLine(`Tracks imported:      ${report.importedTracks}`);
    channel.appendLine(`With-tracks imported: ${report.importedWithTracks}`);
    channel.appendLine(`IDs found:            ${report.identifiedTracks}`);
    channel.appendLine("");

    if (
        metadata.title ||
        metadata.eventDate ||
        metadata.player ||
        metadata.genres.length > 0 ||
        metadata.aliases.length > 0 ||
        metadata.memberOf.length > 0 ||
        metadata.hostedShows.length > 0 ||
        metadata.relatedTracklists.length > 0 ||
        metadata.eventTypes.length > 0 ||
        metadata.artists.length > 0
    ) {
        channel.appendLine("Metadata");
        channel.appendLine("--------");

        if (metadata.title) {
            channel.appendLine(`Title:  ${metadata.title}`);
        }

        if (metadata.eventDate) {
            channel.appendLine(`Date:   ${metadata.eventDate}`);
        }

        if (metadata.player) {
            channel.appendLine(`Player: ${metadata.player}`);
        }

        if (metadata.genres.length > 0) {
            channel.appendLine(
                `Genres: ${metadata.genres.join(", ")}`
            );
        }

        if (metadata.aliases.length > 0) {
            channel.appendLine(`Aliases: ${metadata.aliases.join(", ")}`);
        }

        if (metadata.memberOf.length > 0) {
            channel.appendLine(`Member of: ${metadata.memberOf.join(", ")}`);
        }

        if (metadata.hostedShows.length > 0) {
            channel.appendLine(
                `Hosted shows: ${metadata.hostedShows.join(", ")}`
            );
        }

        if (metadata.relatedTracklists.length > 0) {
            channel.appendLine(
                `Related tracklists: ${metadata.relatedTracklists.join(", ")}`
            );
        }

        if (metadata.eventTypes.length > 0) {
            channel.appendLine(`Event types: ${metadata.eventTypes.join(", ")}`);
        }

        if (metadata.artists.length > 0) {
            channel.appendLine(
                `Artists: ${metadata.artists
                    .map(artist =>
                        artist.country
                            ? `${artist.name} (${artist.country})`
                            : artist.name
                    )
                    .join(", ")}`
            );
        }

        channel.appendLine("");
    }

    if (report.ignoredLineTypes.size > 0) {
        channel.appendLine("");
        channel.appendLine("Ignored metadata");
        channel.appendLine("----------------");

        const entries = [...report.ignoredLineTypes.entries()]
            .sort(([left], [right]) =>
                getLineTypeLabel(left).localeCompare(getLineTypeLabel(right))
            );

        for (const [type, count] of entries) {
            channel.appendLine(
                `${getLineTypeLabel(type).padEnd(22)} ${count}`
            );
        }
    }

    if (report.ignoredLines.size > 0) {
        channel.appendLine("");
        channel.appendLine("Ignored unknown lines");
        channel.appendLine("---------------------");

        const entries = [...report.ignoredLines.entries()]
            .sort(([left], [right]) => left.localeCompare(right));

        for (const [line, count] of entries) {
            channel.appendLine(
                count > 1
                    ? `${line} (${count})`
                    : line
            );
        }
    }

    channel.appendLine("");
    channel.appendLine("Import complete.");
}

export function showLog(): void {
    getChannel().show(true);
}

function getChannel(): vscode.OutputChannel {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel("Cue Tools");
    }

    return outputChannel;
}

function getLineTypeLabel(type: LineType): string {
    switch (type) {
        case LineType.Artwork:
            return "Artwork lines";

        case LineType.ArtworkPlaceholder:
            return "Artwork placeholders";

        case LineType.SaveCount:
            return "Save counts";

        case LineType.PreSaveCount:
            return "Pre-save counts";

        case LineType.PopularityCount:
            return "Popularity counts";

        case LineType.Username:
            return "Usernames";

        case LineType.ContributorSeparator:
            return "Contributor separators";

        case LineType.ContributorSummary:
            return "Contributor summaries";

        case LineType.LinkedPositions:
            return "Linked-position lines";

        case LineType.Show:
            return "Show lines";

        case LineType.AudienceCount:
            return "Audience counts";

        case LineType.ChartRank:
            return "Chart ranks";

        case LineType.ContributorSummary:
            return "Contributor summaries";

        case LineType.Duration:
            return "Durations";

        case LineType.FractionCount:
            return "Fraction counts";

        case LineType.NumericCount:
            return "Numeric counts";

        case LineType.PageMetadata:
            return "Page metadata";

        case LineType.PostedDate:
            return "Posted dates";

        case LineType.RelativeTime:
            return "Relative times";

        case LineType.EventDate:
            return "Event dates";

        case LineType.Url:
            return "URLs";

        case LineType.Player:
            return "Player lines";

        case LineType.TracklistTitle:
            return "Tracklist titles";

        case LineType.Genre:
            return "Genre lines";

        case LineType.Alias:
            return "Alias lines";

        case LineType.Membership:
            return "Membership lines";

        case LineType.HostedShow:
            return "Hosted-show lines";

        case LineType.RelatedTracklist:
            return "Related-tracklist lines";

        case LineType.EventType:
            return "Event-type lines";

        case LineType.ArtistProfile:
            return "Artist-profile lines";

        default:
            return LineType[type] ?? "Other";
    }
}