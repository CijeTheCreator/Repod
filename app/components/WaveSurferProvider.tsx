"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import WaveSurfer from "wavesurfer.js";
import { Episode } from "./core/MediaItem";
import { LanguageContext } from "./Providers";

interface WaveSurferContextProps {
  wavesurfer: WaveSurfer | null;
  isReady: boolean;
  isPlaying: boolean;
  currentTime: number;
  currentEpisode: Episode | undefined;
  setWavesurferContainer: (container: HTMLDivElement | null) => void;
  togglePlayPause: () => void;
}

export const WaveSurferContext = createContext<WaveSurferContextProps | null>(
  null,
);

export function WaveSurferProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const podcastAudioLink = "/aipodcast.mp3";

  const context = useContext(LanguageContext);
  const { language } = context!;
  // State to manage WaveSurfer instance and status
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [wavesurferContainer, setWavesurferContainer] =
    useState<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | undefined>(
    undefined,
  );

  // Initialize WaveSurfer when container is available
  useEffect(() => {
    if (!wavesurferContainer || wavesurfer) {
      return;
    }

    const ws = WaveSurfer.create({
      container: wavesurferContainer,
      url: podcastAudioLink,
      waveColor: theme === "light" ? "#059669" : "#a7f3d0",
      progressColor: theme === "light" ? "#4ade80" : "#10b981",
      height: 50,
    });

    // Handle WaveSurfer events
    ws.on("ready", () => setIsReady(true));
    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("audioprocess", () => {
      setCurrentTime(ws.getCurrentTime());
    });

    setWavesurfer(ws);

    return () => ws.destroy();
  }, [wavesurferContainer, theme, podcastAudioLink]);

  const togglePlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  };

  return (
    <WaveSurferContext.Provider
      value={{
        wavesurfer,
        isReady,
        isPlaying,
        currentTime,
        setWavesurferContainer,
        togglePlayPause,
        currentEpisode,
      }}
    >
      {children}
    </WaveSurferContext.Provider>
  );
}
