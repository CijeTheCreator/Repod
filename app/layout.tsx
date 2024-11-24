import { Figtree } from "next/font/google";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./components/Providers";

const font = Figtree({ subsets: ["latin"] });

export const metadata = {
  title: "Spotify Clone",
  description:
    "🎵🎧Spotify clone created by ajfm88 using Next.js 13, Tailwind CSS and TypeScript. 🔊🎶",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} bg-emerald-50 dark:bg-neutral-900`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
