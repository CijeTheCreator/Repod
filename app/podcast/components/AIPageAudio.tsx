/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { AIResponse } from "./chat-list";
import { ChatScrollAnchor } from "./chat-scroll-anchor";
import { Button } from "@/app/components/button";
import { Question } from "./question";
import AudioVisualizer from "./audio-visualizer";
import useSound from "use-sound";
import { keyUnavailable } from "@/lib/presenter";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { askAIAudio } from "@/server/actions";

export interface AIPageAudioProps {
  onClickAction: () => void;
  resetDialogAction: () => void;
  transcriptionId: string;
}
export default function AIPageAudio({
  onClickAction,
  resetDialogAction,
  transcriptionId,
}: AIPageAudioProps) {
  const [answer, setAnswer] = useState("");
  const [recording, setRecording] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState("");

  const [loading, setIsLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState("");
  const [question, setQuestion] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { setTheme, theme } = useTheme();

  const audioRef = useRef<HTMLAudioElement>(null);
  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
    } else {
      toast.error(
        "Something went wrong while playing the audio for the question",
      );
    }
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keyUnavailable(e)) return;
      if (e.key === "/") {
        if (
          e.target &&
          ["INPUT", "TEXTAREA"].includes((e.target as any).nodeName)
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);

  return (
    <div>
      <div className="flex flex-col min-h-full">
        <div className="flex flex-col flex-1">
          <div className={`pt-4 md:pt-10 h-80`}>
            <audio className="hidden" ref={audioRef} src={audioSrc || ""} />
            {answer.length ? (
              <div className="relative mx-auto max-w-3xl px-4">
                <Question question={question} />
                <AIResponse answer={answer} />
              </div>
            ) : (
              <AudioVisualizer
                onSubmit={async () => {
                  try {
                    if (!recording)
                      return toast.error(
                        "Error recording audio, it might be your mic",
                      );
                    const responseMessage = await askAIAudio(
                      transcriptionId,
                      recording,
                    );
                    setQuestion(responseMessage.question);
                    setAnswer(responseMessage.textAnswer);
                    setAudioSrc(responseMessage.audioAnswerUrl);
                    play();
                  } catch (error) {
                    toast.error(
                      "An error occured while fetching answer, please refresh the page",
                    );
                  }
                }}
              />
            )}
            <ChatScrollAnchor trackVisibility={true} />
          </div>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 w-full peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px] z-50">
        <div className="mx-auto sm:max-w-3xl sm:px-4 mb-12 flex items-center justify-center">
          {answer.length == 0 ? (
            <Button onClick={onClickAction}>Can&apos;t speak now</Button>
          ) : (
            <Button
              onClick={() => {
                setAnswer("");
              }}
            >
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
