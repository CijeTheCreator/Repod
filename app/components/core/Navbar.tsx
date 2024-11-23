import Link from "next/link";
import { Button } from "./Button2";
import { IconGitHub } from "../icons";
import { ThemeToggle } from "../theme-toggle";
import { CommandMenu } from "./SearchBar";
import { IconSparkles } from "@/app/podcast/components/icons";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-8  h-14 shrink-0  backdrop-blur-xl">
      <span className="inline-flex items-center home-links ">
        <Link href="/">
          <span className="text-lg flex items-center">
            RepodAI
            <IconSparkles className="inline mr-0 ml-0.5 w-4 sm:w-5 mb-1" />
          </span>
        </Link>
      </span>
      <div className="flex items-center justify-end space-x-2">
        <CommandMenu />
        <Button variant="ghost" size={"icon"} asChild>
          <a
            target="_blank"
            href="https://github.com/vercel/ai/tree/main/examples/next-ai-rsc"
            rel="noopener noreferrer"
          >
            <IconGitHub />
          </a>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
