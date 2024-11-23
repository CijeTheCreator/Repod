"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/button";
import AIPage from "./AIPage";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import AIPageAudio from "./AIPageAudio";
import { keyUnavailable } from "@/lib/presenter";
import { IconSparkles } from "./icons";

type AskAiDialogProps = {
  transcriptionId: string;
};
export function AskAiDialog({ transcriptionId }: AskAiDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recordMode, setRecordMode] = useState(true);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (keyUnavailable(e)) return;
      if (e.key === "f") {
        e.preventDefault();
        setIsDialogOpen((isDialogOpen) => !isDialogOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <VisuallyHidden.Root>
        <DialogTitle>Menu</DialogTitle>
      </VisuallyHidden.Root>
      <DialogTrigger asChild>
        <Button
          className="mt-2 fixed bottom-5 right-5 h-20  dark:bg-gray-200 shadow-md z-[9999] dark:text-gray-80"
          variant={"ghost"}
        >
          <div className="flex flex-col items-center dark:text-gray-800">
            <IconSparkles className="mb-1 text-lg p-1" />
            <span className="text-base flex items-center dark:text-gray-800 tracking-tighter">
              Ask AI
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-md min-w-[70vw] h-[70vh] bg-emerald-100 dark:bg-emerald-900 transition-all duration-1000 ease-in-out`}
      >
        {recordMode ? (
          <AIPageAudio
            resetDialogAction={function (): void {
              setIsDialogOpen(false);
            }}
            onClickAction={function (): void {
              setRecordMode(false);
            }}
            transcriptId={transcriptionId}
          />
        ) : (
          <AIPage
            resetDialogAction={function (): void {}}
            onClickAction={function (): void {
              setRecordMode(true);
            }}
            transcriptId={transcriptionId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
