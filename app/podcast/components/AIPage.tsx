"use client";

import { useEffect, useRef, useState } from "react";
import Textarea from "react-textarea-autosize";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEnterSubmit } from "./use-enter-submit";
import { AIResponse } from "./chat-list";
import { EmptyScreen } from "./empty-screen";
import { ChatScrollAnchor } from "./chat-scroll-anchor";
import { Button } from "@/app/components/button";
import { IconPaperPlane, IconPlus } from "./icons";
import { Mic } from "lucide-react";
import { Question } from "./question";
import { AIPageAudioProps as AIPageProps } from "./AIPageAudio";
import { keyUnavailable } from "@/lib/presenter";
import { toast } from "sonner";
import { askAIText } from "@/server/actions";

export default function AIPage({
  onClickAction,
  transcriptId,
}: AIPageProps & { transcriptId: string }) {
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
      <div className="flex flex-col">
        <div className="flex flex-col flex-1">
          <div className="pb-[200px] pt-4 md:pt-10">
            <audio className="hidden" ref={audioRef} src={audioSrc || ""} />
            {answer.length ? (
              <div className="relative mx-auto max-w-3xl px-4">
                <Question question={question} />
                <AIResponse answer={answer} />
              </div>
            ) : (
              <EmptyScreen />
            )}
            <ChatScrollAnchor trackVisibility={true} />
          </div>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 w-full peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px] z-50">
        <div className="mx-auto sm:max-w-3xl sm:px-4 mb-12">
          <form
            ref={formRef}
            onSubmit={async (e: any) => {
              e.preventDefault();
              e.target["message"]?.blur();
              const value = inputValue.trim();
              setInputValue("");
              if (!value) return;

              try {
                setQuestion(value);
                const responseMessage = await askAIText(transcriptId, question);
                setAnswer(responseMessage.textAnswer);
                setAudioSrc(responseMessage.audioAnswerUrl);
                play();
              } catch (error) {
                toast.error(
                  "An error occured while fetching answer, please refresh the page",
                );
              }
            }}
          >
            <div className="relative flex flex-col w-full px-4 overflow-hidden max-h-60 grow  dark:bg-emerald-700 bg-emerald-50 sm:rounded-md sm:border sm:px-16">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-0 w-8 h-8 p-0 rounded-full top-4 dark:bg-emerald-900 sm:left-4"
                    onClick={onClickAction}
                  >
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">Record</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Record</TooltipContent>
              </Tooltip>
              <Textarea
                ref={inputRef}
                tabIndex={0}
                onKeyDown={onKeyDown}
                placeholder="Send a message."
                className="min-h-[60px] w-full resize-none bg-transparent py-[1.3rem] focus-within:outline-none sm:text-sm dark:text-emerald-50 bg:white text-emerald-900"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                name="message"
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="absolute right-0 top-4 sm:right-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={inputValue === ""}
                      variant={"outline"}
                    >
                      <IconPaperPlane />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send message</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
function askAI(transcriptId: any, question: string) {
  throw new Error("Function not implemented.");
}
