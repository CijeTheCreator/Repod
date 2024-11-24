"use client";

import PlayingIndicator from "@/app/components/spotify/LikeButton";
import MediaItem from "../../components/spotify/MediaItem";
import { useContext, useEffect } from "react";
import { getChapters, keyUnavailable } from "@/lib/presenter";
import { LanguageContext } from "@/app/components/Providers";
import { WaveSurferContext } from "@/app/components/WaveSurferProvider";

const PodcastEpisodes = () => {
  const context = useContext(LanguageContext);
  const { language } = context!;
  const episodes = getChapters(language);
  const wavesurferContext = useContext(WaveSurferContext);
  const { wavesurfer } = wavesurferContext!;
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const stringNumbersFrom1to10 = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
      ];
      if (keyUnavailable(e)) return;
      if (stringNumbersFrom1to10.includes(e.key)) {
        e.preventDefault();
        wavesurfer?.setTime(episodes[Number(e.key)].start / 1000);
        wavesurfer?.play();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodes]);

  return (
    <div className="flex flex-col gap-y-2 w-full p-6 pb-14">
      {episodes.map((episode) => (
        <div key={episode.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <MediaItem
              changeEpisode={() => {
                wavesurfer?.setTime(episode.start / 1000);
                wavesurfer?.play();
              }}
              data={episode}
            />
          </div>
          {/* TODO: Add is playing indicator */}
          <PlayingIndicator
            episodeId={episode.id}
            isPlaying={episode.isPlaying}
          />
        </div>
      ))}
    </div>
  );
};

export default PodcastEpisodes;
