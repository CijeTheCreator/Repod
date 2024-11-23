"use client";

import PlayingIndicator from "@/app/components/core/LikeButton";
import MediaItem, { Episode } from "../../components/core/MediaItem";
import { useContext, useEffect, useState } from "react";
import { keyUnavailable } from "@/lib/presenter";
import { LanguageContext } from "@/app/components/Providers";
import { WaveSurferContext } from "@/app/components/WaveSurferProvider";
import { getChapters } from "@/server/actions"; // Using the server-side `getChapters`

const PodcastEpisodes = ({ podcastId }: { podcastId: number }) => {
  const context = useContext(LanguageContext);
  const { language } = context!;
  const wavesurferContext = useContext(WaveSurferContext);
  const { wavesurfer } = wavesurferContext!;

  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    // Fetch episodes using the async server-side function
    const fetchEpisodes = async () => {
      try {
        const chapters = await getChapters(podcastId, language);
        setEpisodes(chapters);
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
      }
    };

    fetchEpisodes();
  }, [podcastId, language]);

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
        const episodeIndex = Number(e.key) - 1;
        if (episodes[episodeIndex]) {
          wavesurfer?.setTime(episodes[episodeIndex].start / 1000);
          wavesurfer?.play();
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [episodes, wavesurfer]);

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
