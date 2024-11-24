"use client";

import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { Search, Home } from "lucide-react";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();

  return (
    <div
      className={twMerge(
        `
        h-full 
        bg-gradient-to-b from-emerald-300 to-background dark:from-emerald-800 dark:to-transparent
        p-6
        `,
        className,
      )}
    >
      <div className="w-full h-full mb-4 flex items-center justify-between">
        <div className="flex justify-between items-center gap-x-4"></div>
      </div>
      {children}
    </div>
  );
};

export default Header;
