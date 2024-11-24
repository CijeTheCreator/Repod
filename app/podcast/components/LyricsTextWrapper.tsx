import clsx from "clsx";
import { MutableRefObject, useContext, useEffect, useRef } from "react";
import { Line } from "./Lyrics";
import { WaveSurferContext } from "@/app/components/WaveSurferProvider";
export type Lyrics = {
  lines: {
    startTimeMs: string;
    words: string;
    sentiment: string;
  }[];
};
interface LyricsWrapperProps {
  mainRef: MutableRefObject<HTMLDivElement | null>;
  lyrics: Lyrics;
  currentLine: Line | null;
  timestamp: number;
  currentLineRef: MutableRefObject<HTMLDivElement | null>;
  fullScreen?: boolean;
  isSentimentHighlightingOn: boolean;
  setColor: () => void;
}

export function LyricsWrapper({
  mainRef,
  lyrics,
  currentLine,
  timestamp,
  fullScreen = false,
  isSentimentHighlightingOn,
  setColor,
}: LyricsWrapperProps) {
  const currentLineRef = useRef<HTMLParagraphElement | null>(null);
  const wavesurferContext = useContext(WaveSurferContext);
  const { wavesurfer } = wavesurferContext!;
  useEffect(() => {
    if (currentLineRef.current) {
      // Scroll the main container to center the current line
      setColor();
      currentLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [currentLine, isSentimentHighlightingOn, setColor]);

  function getSentimentContrastDark(sentiment: string, og: number) {
    if (!isSentimentHighlightingOn) {
      return og;
    }
    switch (sentiment) {
      case "POSITIVE":
        return 200;
      case "NEUTRAL":
        return og;
      case "NEGATIVE":
        return 200;
      default:
        return og;
    }
  }
  function getSentimentColor(sentiment: string) {
    if (!isSentimentHighlightingOn) {
      return "emerald";
    }
    switch (sentiment) {
      case "POSITIVE":
        return "green";
      case "NEUTRAL":
        return "emerald";
      case "NEGATIVE":
        return "red";
      default:
        return "emerald";
    }
  }
  return (
    <main
      ref={mainRef}
      className={
        "grid gap-5 text-left overflow-y-scroll scrollbar-thin scrollbar-hide hover:scrollbar-default " +
        `${!fullScreen ? "max-h-[300px]" : ""}`
      } // Ensure the height is limited for scrolling
    >
      {lyrics.lines.map(
        (line: { startTimeMs: string; words: string; sentiment: string }) => {
          const isCurrentLine = currentLine?.startTimeMs === line.startTimeMs;
          const isPastLine = Number(line.startTimeMs) < timestamp;

          return (
            <p
              ref={isCurrentLine ? currentLineRef : null}
              className={clsx(
                `text-2xl font-bold cursor-pointer`,
                isCurrentLine
                  ? `text-${getSentimentColor(line.sentiment)}-900 dark:text-${getSentimentColor(line.sentiment)}-${getSentimentContrastDark(line.sentiment, 50)}`
                  : isPastLine
                    ? `text-${getSentimentColor(line.sentiment)}-700 dark:text-${getSentimentColor(line.sentiment)}-300`
                    : `text-${getSentimentColor(line.sentiment)}-400 dark:text-${getSentimentColor(line.sentiment)}-400`,
              )}
              key={line.startTimeMs}
              onClick={() => {
                wavesurfer?.setTime(Number(line.startTimeMs) / 1000);
                wavesurfer?.play();
              }}
            >
              {line.words}
            </p>
          );
        },
      )}
    </main>
  );
}
