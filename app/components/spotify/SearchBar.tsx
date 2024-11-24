"use client";

import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Laptop, Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useContext } from "react";
import { LanguageContext } from "../Providers";
import { formatDuration, keyUnavailable } from "@/lib/presenter";
import Overflowticker from "./OverflowTicker";
import { WaveSurferContext } from "../WaveSurferProvider";

export function CommandMenu({ ...props }: DialogProps) {
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();

  const context = useContext(LanguageContext);
  const { setLanguage } = context!;

  const wavesurferContext = useContext(WaveSurferContext);
  const { wavesurfer } = wavesurferContext!;

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (keyUnavailable(e)) return;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);
  const mockData = {
    otherPodcastsSearch: [
      {
        title: "Appears in other podcasts",
        items: [
          {
            text: "Chatgpt, you're fucking creeping me out.",
            start: 386.935,
            sentiment: "NEGATIVE",
            speaker: "B",
            podcast: "The Joe Rogan Experience 2",
          },
          {
            text: "As we start talking about like, what are the risks with AI?",
            start: 389.087,
            sentiment: "NEUTRAL",
            speaker: "A",
            podcast: "The Joe Rogan Experience 2",
          },
          {
            text: "Like, what are the issues here?",
            start: 392.559,
            sentiment: "NEGATIVE",
            speaker: "A",
            podcast: "The Joe Rogan Experience 2",
          },
          {
            text: "A lot of people will look at that and say, well, how is that any different than a Google search?",
            start: 394.023,
            sentiment: "NEUTRAL",
            speaker: "A",
            podcast: "The Joe Rogan Experience 2",
          },
          {
            text: "Because if you Google, like, how do I make napalm or whatever, you can find certain pages that will tell you that thing.",
            start: 397.183,
            sentiment: "NEUTRAL",
            speaker: "A",
            podcast: "The Joe Rogan Experience 2",
          },
          {
            text: "What's different is that the AI is like an interactive tutor.",
            start: 403.083,
            sentiment: "NEUTRAL",
            speaker: "A",
            podcast: "The Joe Rogan Experience 2",
          },
          {
            text: "Think about it as we're moving from the textbook era to the interactive super smart tutor era.",
            start: 405.891,
            sentiment: "NEUTRAL",
            speaker: "A",
            podcast: "The Joe Rogan Experience 2",
          },
          {
            text: "So you've probably seen the demo of when they launched GPT4.",
            start: 411.843,
            sentiment: "NEUTRAL",
            speaker: "A",
            podcast: "The Joe Rogan Experience 2",
          },
          {
            text: "The famous example was they took a photo of their refrigerator, what's in their fridge, and they say, what are the recipes of food I can make with the stuff I have in the fridge?",
            start: 416.675,
            sentiment: "NEUTRAL",
            speaker: "A",
            podcast: "The Joe Rogan Experience 2",
          },
          {
            text: "And GPT4, because it's just this, it can take images and turn it into text.",
            start: 424.675,
            sentiment: "NEUTRAL",
            speaker: "A",
            podcast: "The Joe Rogan Experience 2",
          },
          {
            text: "It realized what was in the refrigerator and then it provided recipes for what you can make.",
            start: 429.013,
            sentiment: "NEUTRAL",
            speaker: "A",
            podcast: "The Joe Rogan Experience 2",
          },
          {
            text: "But the same, which is a really impressive demo and it's really cool.",
            start: 434.701,
            sentiment: "POSITIVE",
            speaker: "A",
            podcast: "The Joe Rogan Experience 2",
          },
        ],
      },
    ],
    currentPodcastSearch: [
      {
        title: "Appears in current podcast",
        items: [
          {
            text: "Can it become an AGI virus that starts spreading over the Internet?",
            start: 49.381,
            sentiment: "NEGATIVE",
            speaker: "Tristan Harris",
          },
          {
            text: "They run on your.",
            start: 590.463,
            sentiment: "NEGATIVE",
            speaker: "Aza Raskin",
          },
          {
            text: "You can get them, these things.",
            start: 592.167,
            sentiment: "NEUTRAL",
            speaker: "Aza Raskin",
          },
          {
            text: "Whoa.",
            start: 594.167,
            sentiment: "NEUTRAL",
            speaker: "Joe Rogan",
          },
          {
            text: "Yeah.",
            start: 596.095,
            sentiment: "NEUTRAL",
            speaker: "Tristan Harris",
          },
          {
            text: "This is really dangerous.",
            start: 596.695,
            sentiment: "NEGATIVE",
            speaker: "Tristan Harris",
          },
          {
            text: "We don't want.",
            start: 597.543,
            sentiment: "NEGATIVE",
            speaker: "Tristan Harris",
          },
        ],
      },
    ],
    translations: [
      {
        title: "Translations",
        items: [
          { title: "English" },
          { title: "French" },
          { title: "Spanish" },
          { title: "German" },
        ],
      },
    ],
    mainNav: [
      { title: "Home" },
      { title: "Documentation" },
      { title: "API Reference" },
      { title: "Community" },
      { title: "GitHub" },
    ],
  };
  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64",
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">Search podcasts...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {mockData.currentPodcastSearch.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem) => (
                <CommandItem
                  key={navItem.text}
                  value={navItem.text}
                  onSelect={() => {
                    runCommand(() => {
                      wavesurfer?.setTime(navItem.start);
                      wavesurfer?.play();
                    });
                  }}
                >
                  <div className="space-y-2">
                    <Overflowticker
                      className="font-medium leading-none"
                      text={navItem.text}
                    />
                    <p className="text-sm text-muted-foreground">
                      {`By ${navItem.speaker} at ${formatDuration(Math.ceil(navItem.start * 1000))}`}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          {mockData.otherPodcastsSearch.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem) => (
                <CommandItem
                  key={navItem.text}
                  value={navItem.text}
                  onSelect={() => {
                    runCommand(() => {
                      wavesurfer?.setTime(navItem.start);
                      wavesurfer?.play();
                    });
                  }}
                >
                  <div className="space-y-2">
                    <Overflowticker
                      className="font-medium leading-none"
                      text={navItem.text}
                    />
                    <p className="text-sm text-muted-foreground">
                      {`Appears in ${navItem.podcast}`}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          {mockData.translations.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem) => (
                <CommandItem
                  key={navItem.title}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => {
                      setLanguage(navItem.title.toLowerCase());
                    });
                  }}
                >
                  <div className="mr-2 flex h-4 w-4 items-center justify-center">
                    <Languages />
                  </div>
                  {navItem.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
