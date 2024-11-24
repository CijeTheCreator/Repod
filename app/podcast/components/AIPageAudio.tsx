/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { AIResponse } from "./chat-list";
import { ChatScrollAnchor } from "./chat-scroll-anchor";
import { Button } from "@/app/components/button";
import { Question } from "./question";
import AudioVisualizer from "./audio-visualizer";
import { useAudioRecorder } from "react-use-audio-recorder";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import useSound from "use-sound";
import { delay, keyUnavailable } from "@/lib/presenter";
import { InfinitySpin, BallTriangle } from "react-loader-spinner";
import { useTheme } from "next-themes";

export interface AIPageAudioProps {
  onClickAction: () => void;
  resetDialogAction: () => void;
}
export default function AIPageAudio({
  onClickAction,
  resetDialogAction,
}: AIPageAudioProps) {
  const [answer, setAnswer] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState("");
  const [question, setQuestion] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [playSound] = useSound("/audio.wav");
  const { setTheme, theme } = useTheme();

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

  async function submitUserMessage(question: string) {
    return `
Jailbreaking challenges safety protocols by altering or bypassing built-in restrictions, potentially allowing the AI to behave unpredictably or perform unauthorized actions.
`;
  }

  return (
    <div>
      <div className="flex flex-col min-h-full">
        <div className="flex flex-col flex-1">
          <div className={`pt-4 md:pt-10 h-80`}>
            {answer.length ? (
              <div className="relative mx-auto max-w-3xl px-4">
                <Question question={question} />
                <AIResponse answer={answer} />
              </div>
            ) : (
              <AudioVisualizer
                onSubmit={async () => {
                  try {
                    setQuestion(getMockAudioQuestion());
                    const responseMessage = await submitUserMessage(
                      getMockAudioQuestion(),
                    );
                    setAnswer(responseMessage);
                    playSound();
                  } catch (error) {
                    // You may want to show a toast or trigger an error state.
                    console.error(error);
                  }

                  function getMockAudioQuestion() {
                    return `
How does the concept of "jailbreaking" AI systems challenge their safety protocols?
`;
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
