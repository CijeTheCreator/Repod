/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import MusicControls from "./MusicControls";
import Lyrics from "./Lyrics";
import { useTheme } from "next-themes";
import Labels from "./Labels";
import { segmentContainer } from "@/lib/utils";
import { getChapters, getDivisions, keyUnavailable } from "@/lib/presenter";
import { WaveSurferContext } from "@/app/components/WaveSurferProvider";
import { LanguageContext } from "@/app/components/Providers";

const Player = () => {
  const wavesurferContainerRef = useRef<HTMLDivElement | null>(null);
  const segmentorRef = useRef<HTMLDivElement | null>(null);
  const { setTheme, theme } = useTheme();
  const [color, setColor] = useState<string>("emerald");
  const [isSentimentHighlightingOn, setSentimentHighlighting] =
    useState<boolean>(true);
  const [isSpeakerHighlightingOn, setIsSpeakerHighlightingOn] =
    useState<boolean>(true);

  const wavesurferContext = useContext(WaveSurferContext);
  if (!wavesurferContext) {
    throw new Error("WaveSurferContext is not provided!");
  }

  const {
    wavesurfer,
    setWavesurferContainer,
    isReady,
    isPlaying,
    currentTime,
    togglePlayPause,
    currentEpisode,
  } = wavesurferContext;

  const context = useContext(LanguageContext);
  const { language } = context!;
  const episodes = getChapters(language);
  useEffect(() => {
    const divisions = getDivisions(theme, language);

    const down = (e: KeyboardEvent) => {
      if (keyUnavailable(e)) return;
      if (e.key === "1") {
        e.preventDefault();
        setColor("red");
      }
      if (e.key === "d") {
        e.preventDefault();
        setSentimentHighlighting((value) => !value);
      }
      if (e.key === "g") {
        e.preventDefault();
        setIsSpeakerHighlightingOn((value) => !value);
      }
    };

    segmentContainer(segmentorRef.current, divisions);

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [language, theme]);

  useEffect(() => {
    if (wavesurferContainerRef.current) {
      setWavesurferContainer(wavesurferContainerRef.current);
    }
  }, [wavesurferContainerRef, setWavesurferContainer]);

  const onPlayPause = () => {
    togglePlayPause();
  };

  const currentEpisodeLiveIndex = episodes.findIndex(
    (value) => value.start >= currentTime * 1000,
  );
  const usableIndex =
    currentEpisodeLiveIndex - 1 > 0 ? currentEpisodeLiveIndex : 0;
  const currentEpisodeLive = episodes[usableIndex - 1];

  return (
    <>
      <div className="flex flex-col overflow-hidden items-center my-4">
        <h4>
          {currentEpisodeLive ? currentEpisodeLive.gist : episodes[0].gist}
        </h4>
        <p className="text-neutral-400 text-sm truncate">{`Episode ${currentEpisodeLive ? currentEpisodeLive.episode_number : 1}`}</p>
      </div>
      <Lyrics
        isSpeakerHighlightingOn={isSpeakerHighlightingOn}
        timestamp={Math.floor(currentTime * 1000)}
        isSentimentHighlightingOn={isSentimentHighlightingOn}
      />
      <div
        ref={segmentorRef}
        className={`
        rounded-md 
        my-4 
        `}
      >
        <div ref={wavesurferContainerRef} />
      </div>
      <Labels></Labels>
      <MusicControls
        onPlay={() => {
          onPlayPause();
        }}
        isPlaying={isPlaying}
      />
    </>
  );
};
export default Player;
