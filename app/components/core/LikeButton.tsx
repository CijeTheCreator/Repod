/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Audio } from "react-loader-spinner";
import { useTheme } from "next-themes";
import { keyUnavailable } from "@/lib/presenter";

interface PlayingIndicatorProps {
  episodeId: number;
  isPlaying: boolean | undefined;
}

const PlayingIndicator: React.FC<PlayingIndicatorProps> = ({
  episodeId,
  isPlaying,
}) => {
  const router = useRouter();

  const { setTheme, theme } = useTheme();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (keyUnavailable(e)) return;
      if (e.key === "1") {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div
      className="
        cursor-pointer 
        hover:opacity-75 
        transition
      "
    >
      {isPlaying ? (
        <Audio
          height="20"
          width="20"
          color={theme === "light" ? "#059669" : "#a7f3d0"}
          ariaLabel="loading"
          wrapperStyle={{}}
          wrapperClass="wrapper-class"
          visible={true}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default PlayingIndicator;
