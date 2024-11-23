"use client";
import { Text } from "lucide-react";

import { Button } from "../components/button";
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
import { MemoizedReactMarkdown } from "./MemoizedReactMarkDown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "./Providers";
import { keyUnavailable } from "@/lib/presenter";
import { getSummary } from "@/server/actions";

export function ViewSummary({ podcastId }: { podcastId: number }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (keyUnavailable(e)) return;
      if (e.key === "s") {
        e.preventDefault();
        setIsDialogOpen((isDialogOpen) => !isDialogOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  const context = useContext(LanguageContext);
  const { language } = context!;
  const summary = getSummary(podcastId, language);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mt-2">
          <Text className="mx-2" /> View Summary
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md min-w-fit dark:bg-emerald-900">
        <DialogHeader>
          <DialogTitle>The Joe Rogan Experience 2</DialogTitle>
          <DialogDescription>
            A Brief summary of The Joe Rogan Experience 2
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <MemoizedReactMarkdown
            className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 mb-3 space-y-2"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              h2({ children }) {
                return <h2 className="text-lg font-semibold">{children}</h2>;
              },
              h3({ children }) {
                return <h3 className="text-md font-semibold">{children}</h3>;
              },
              ul({ children }) {
                return <ul className="list-disc pl-5">{children}</ul>;
              },
              li({ children }) {
                return <li className="mb-2 last:mb-0">{children}</li>;
              },
              ol({ children }) {
                return <ol className="list-decimal pl-5">{children}</ol>;
              },
              blockquote({ children }) {
                return (
                  <blockquote className="pl-4 border-l-4 border-primary-foreground">
                    {children}
                  </blockquote>
                );
              },
              strong({ children }) {
                return <strong className="font-semibold">{children}</strong>;
              },
              em({ children }) {
                return <em className="italic">{children}</em>;
              },

              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
            }}
          >
            {summary}
          </MemoizedReactMarkdown>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
