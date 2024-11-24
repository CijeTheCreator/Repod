import { useContext, useEffect, useRef, useState } from "react";
import { FullscreenTranscripts } from "./FullPageLyrics";
import { LyricsWrapper } from "./LyricsTextWrapper";
import { getLyrics } from "@/lib/presenter";
import { LanguageContext } from "@/app/components/Providers";
import { AskAiDialog } from "./AskAIDialog";
export type Line = {
  startTimeMs: string;
  words: string;
  sentiment: string;
  speaker: string;
};

function useCurrentLine(timestamp: number) {
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const context = useContext(LanguageContext);
  const { language } = context!;

  useEffect(() => {
    const lyrics = getLyrics(language);
    const nextLineIndex = lyrics.lines.findIndex(
      (line: Line) => Number(line.startTimeMs) > timestamp,
    );

    if (nextLineIndex === 0) {
      setCurrentLine(lyrics.lines[0]);
    }

    setCurrentLine(lyrics.lines[nextLineIndex - 1]);
  }, [timestamp, language]);

  return { currentLine };
}
interface LyricsProps {
  timestamp: number;
  isSentimentHighlightingOn: boolean;
  isSpeakerHighlightingOn: boolean;
}
function getSpeakerColor(
  speaker: string | undefined,
  isSpeakerHighlightingOn: boolean,
) {
  console.log("Hit 1");
  if (!speaker) {
    return "emerald";
  }
  if (!isSpeakerHighlightingOn) {
    return "emerald";
  }
  console.log("Hit 2");
  switch (speaker) {
    case "A":
      return "blue";
    case "B":
      return "green";
    case "C":
      return "red";
    default:
      console.log("Hit 3");
      return "emerald";
  }
}
function Lyrics({
  timestamp,
  isSentimentHighlightingOn,
  isSpeakerHighlightingOn,
}: LyricsProps) {
  const currentLineRef = useRef<HTMLParagraphElement | null>(null);
  const [color, setColor] = useState<string>("emerald");
  const { currentLine } = useCurrentLine(timestamp);
  const mainRef = useRef<HTMLDivElement | null>(null); // Reference to the main container
  useEffect(() => {
    if (currentLineRef.current && mainRef.current) {
      // Scroll the main container to center the current line
      currentLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [currentLine, isSpeakerHighlightingOn]);

  const context = useContext(LanguageContext);
  const { language } = context!;

  const lyrics = getLyrics(language);
  return (
    <div
      className={`relative p-8 bg-${color}-100 dark:bg-${color}-800 rounded-lg transition-all duration-1000 ease-in-out`}
    >
      {/* Icon positioned absolutely in the top-right */}
      <div className="absolute top-2 right-2">
        {/* <AskAiDialog /> */}
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
              setColor={function (): void {
                setColor(
                  getSpeakerColor(
                    currentLine?.speaker,
                    isSpeakerHighlightingOn,
                  ),
                );
              }}
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
        setColor={function (): void {
          setColor(
            getSpeakerColor(currentLine?.speaker, isSpeakerHighlightingOn),
          );
        }}
      />
    </div>
  );
}

export default Lyrics;
