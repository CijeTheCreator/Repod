"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { FullscreenTranscripts } from "./FullPageLyrics";
import { LyricsWrapper } from "./LyricsTextWrapper";
import { LanguageContext } from "@/app/components/Providers";
import { getLyrics } from "@/server/actions";

export type Line = {
  startTimeMs: string;
  words: string;
  sentiment: string;
  speaker: string;
};

function useCurrentLine(timestamp: number, lyricId: number) {
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [lyrics, setLyrics] = useState<{ lines: Line[] }>({ lines: [] });
  const context = useContext(LanguageContext);
  const { language } = context!;

  useEffect(() => {
    async function fetchLyrics() {
      const fetchedLyrics = await getLyrics(lyricId, language);
      setLyrics(fetchedLyrics);
    }
    fetchLyrics();
  }, [language, lyricId]);

  useEffect(() => {
    const nextLineIndex = lyrics.lines.findIndex(
      (line: Line) => Number(line.startTimeMs) > timestamp,
    );

    if (nextLineIndex === 0) {
      setCurrentLine(lyrics.lines[0]);
    } else {
      setCurrentLine(lyrics.lines[nextLineIndex - 1]);
    }
  }, [timestamp, lyrics]);

  return { currentLine, lyrics };
}

interface LyricsProps {
  timestamp: number;
  isSentimentHighlightingOn: boolean;
  isSpeakerHighlightingOn: boolean;
  lyricId: number;
}

function getSpeakerColor(
  speaker: string | undefined,
  isSpeakerHighlightingOn: boolean,
) {
  if (!speaker || !isSpeakerHighlightingOn) {
    return "emerald";
  }
  switch (speaker) {
    case "A":
      return "blue";
    case "B":
      return "green";
    case "C":
      return "red";
    default:
      return "emerald";
  }
}

function Lyrics({
  timestamp,
  isSentimentHighlightingOn,
  isSpeakerHighlightingOn,
  lyricId,
}: LyricsProps) {
  const currentLineRef = useRef<HTMLParagraphElement | null>(null);
  const [color, setColor] = useState<string>("emerald");
  const { currentLine, lyrics } = useCurrentLine(timestamp, lyricId);
  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentLineRef.current && mainRef.current) {
      currentLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [currentLine, isSpeakerHighlightingOn]);

  return (
    <div
      className={`relative p-8 bg-${color}-100 dark:bg-${color}-800 rounded-lg transition-all duration-1000 ease-in-out`}
    >
      <div className="absolute top-2 right-2">
        <FullscreenTranscripts
          LyricsNode={
            <LyricsWrapper
              mainRef={mainRef}
              lyrics={lyrics}
              currentLineRef={currentLineRef}
              currentLine={currentLine}
              timestamp={timestamp}
              fullScreen={true}
              isSentimentHighlightingOn={isSentimentHighlightingOn}
              setColor={() =>
                setColor(
                  getSpeakerColor(
                    currentLine?.speaker,
                    isSpeakerHighlightingOn,
                  ),
                )
              }
            />
          }
          defaultColor={color}
        />
      </div>

      <LyricsWrapper
        mainRef={mainRef}
        lyrics={lyrics}
        currentLineRef={currentLineRef}
        currentLine={currentLine}
        timestamp={timestamp}
        isSentimentHighlightingOn={isSentimentHighlightingOn}
        setColor={() =>
          setColor(
            getSpeakerColor(currentLine?.speaker, isSpeakerHighlightingOn),
          )
        }
      />
    </div>
  );
}

export default Lyrics;
