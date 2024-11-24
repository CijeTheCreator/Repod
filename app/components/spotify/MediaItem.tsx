"use client";

import Overflowticker from "./OverflowTicker";

export type Episode = {
  id: number;
  episode_number: number;
  duration: string;
  title: string;
  summary: string;
  gist: string;
  isPlaying: boolean;
  start: number;
};
interface MediaItemProps {
  data: Episode;
  changeEpisode: (id: number) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ data, changeEpisode }) => {
  return (
    <div
      className="
        flex 
      gap-2
        items-center 
        cursor-pointer 
        hover:bg-neutral-200 dark:hover:bg-neutral-800/50
        w-full 
        p-2 
        rounded-md
      "
      onClick={() => changeEpisode(data.start / 1000)}
    >
      <div
        className="
        flex 
        bg-emerald-200
        dark:bg-emerald-900
        items-center
        justify-center
        relative 
        rounded-md 
        min-h-[48px] 
        min-w-[48px] 
        overflow-hidden
        "
      >
        {data.episode_number}
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <Overflowticker text={data.gist} />
        <p className="text-neutral-400 text-sm truncate">{data.duration}</p>
      </div>
    </div>
  );
};

export default MediaItem;
