"use client";
import { Fullscreen, Text } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/app/components/button";
import Labels from "./Labels";
import AIPage from "./AIPage";
import { keyUnavailable } from "@/lib/presenter";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
interface FullscreenTranscriptsProps {
  LyricsNode: ReactNode;
  defaultColor: string;
}
export function FullscreenTranscripts({
  LyricsNode,
  defaultColor,
}: FullscreenTranscriptsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
        <Button className="mt-2" variant={"ghost"}>
          <Fullscreen className="w-6 h-6 text-emerald-900 dark:text-emerald-50" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-md min-w-[70vw] h-[70vh] bg-${defaultColor}-100 dark:bg-${defaultColor}-800 transition-all duration-1000 ease-in-out`}
      >
        {LyricsNode}
        {/* <AIPage /> */}
        <Labels />
      </DialogContent>
    </Dialog>
  );
}
