import { summary } from "@/transcripts/summary";
import { lines_ as english_transcripts } from "../transcripts/english_transcripts.json";
import { lines_ as french_transcripts } from "../transcripts/french_transcripts.json";
import { lines_ as spanish_transcripts } from "../transcripts/spanish_transcripts.json";
import { Divisions } from "./utils";
import { chapters } from "../transcripts/chapters.json";
import { Episode } from "@/app/components/core/MediaItem";

export function getSummary(language: string) {
  console.log(language);
  return summary;
}

export function getChapters(language: string): Episode[] {
  console.log(language);
  return chapters.map((value, index) => {
    return {
      id: index + 1,
      episode_number: index + 1,
      duration: formatDuration(value.end - value.start),
      title: value.headline,
      summary: value.summary,
      gist: value.gist,
      isPlaying: false,
      start: value.start,
    };
  });
}
export function getLyrics(language: string) {
  let lines_;
  switch (language) {
    case "english":
      lines_ = english_transcripts;
      break;
    case "french":
      lines_ = french_transcripts;
      break;
    case "spanish":
      lines_ = spanish_transcripts;
      break;
    default:
      lines_ = english_transcripts;
      break;
  }
  const lines = lines_.map((value) => {
    return {
      startTimeMs: `${Math.ceil(value.start * 1000)}`,
      words: value.text,
      sentiment: value.sentiment ? value.sentiment : "null",
      speaker: value.speaker,
    };
  });
  return {
    lines: lines,
  };
}
export type Message = {
  id: number;
  display: string;
};
export function getDivisions(theme: string | undefined, language: string) {
  let lines_;
  switch (language) {
    case "english":
      lines_ = english_transcripts;
      break;
    case "french":
      lines_ = french_transcripts;
      break;
    case "spanish":
      lines_ = spanish_transcripts;
      break;
    default:
      lines_ = english_transcripts;
      break;
  }
  if (!lines_ || lines_.length === 0) {
    return [];
  }

  const divisions: Divisions = [];
  const colors = [
    "bg-blue-100 dark:bg-blue-700",
    "bg-green-100 dark:bg-green-700",
    "bg-red-100 dark:bg-red-700",
    "bg-yellow-100 dark:bg-yellow-700",
    "bg-lime-100 dark:bg-lime-700",
  ];
  const speakerColorMap: Record<string, string> = {};
  let currentOrder = 1;
  let totalDuration = 0;

  // Calculate total duration for percentage calculation
  lines_.forEach((line, index) => {
    const duration =
      index < lines_.length - 1 ? lines_[index + 1].start - line.start : 0; // Last line has no duration
    totalDuration += duration;
  });

  console.log("Total Duration is: ", totalDuration);

  // Process each line and calculate its division
  lines_.forEach((line, index) => {
    const duration =
      index < lines_.length - 1 ? lines_[index + 1].start - line.start : 0;

    const speaker = line.speaker || "Unknown";
    if (!speakerColorMap[speaker]) {
      // Assign a color to the speaker if not already assigned
      speakerColorMap[speaker] =
        colors[Object.keys(speakerColorMap).length % colors.length];
    }

    const percentage = totalDuration > 0 ? duration / totalDuration : 0;

    divisions.push({
      percentage: parseFloat(percentage.toFixed(19)),
      color: speakerColorMap[speaker],
      order: currentOrder++,
    });
  });

  return divisions;
}

export function formatDuration(milliseconds: number): string {
  if (milliseconds < 0) {
    throw new Error("Duration cannot be negative");
  }

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;

  let result = "";

  if (hours > 0) {
    result += `${hours}hr `;
  }

  if (remainingMinutes > 0) {
    result += `${remainingMinutes}m`;
  }

  return result.trim() || "0m";
}

/**
 * Async delay function that pauses execution for a specified time.
 * @param ms - The amount of time to delay in milliseconds.
 * @returns A promise that resolves after the specified delay.
 */
export const delay = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function keyUnavailable(e: KeyboardEvent) {
  if (
    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
    e.target instanceof HTMLInputElement ||
    e.target instanceof HTMLTextAreaElement ||
    e.target instanceof HTMLSelectElement
  ) {
    return true;
  }

  return false;
}
