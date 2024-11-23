import { useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/app/components/button";
interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
}
function MusicControls({ isPlaying, onPlay }: MusicControlsProps) {
  const iconsSize = 48;
  const iconsSizeDivider = 1.5;

  return (
    <>
      <div className="flex justify-center items-center space-x-4 p-4">
        <Button variant={"media"}>
          <SkipBack
            className="text-emerald-900 dark:text-emerald-100"
            size={iconsSize / iconsSizeDivider}
          />
        </Button>
        {!isPlaying ? (
          <Button variant={"media"}>
            <Play
              onClick={onPlay}
              className="text-emerald-900 dark:text-emerald-100 py-2"
              size={iconsSize}
            />
          </Button>
        ) : (
          <Button variant={"media"}>
            <Pause
              onClick={onPlay}
              className="text-emerald-900 dark:text-emerald-100"
              size={iconsSize}
            />
          </Button>
        )}
        <Button variant={"media"}>
          <SkipForward
            className="text-emerald-900 dark:text-emerald-100"
            size={iconsSize / iconsSizeDivider}
          />
        </Button>
      </div>
    </>
  );
}

export default MusicControls;
