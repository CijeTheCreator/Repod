"use client";

import { twMerge } from "tailwind-merge";

import Box from "./Box";
import { Header } from "./Navbar";
import { useEffect, useRef } from "react";

export interface Podcast {
  id: number;
  titile: string;
  author: string;
  imageUrl?: string;
}
interface SidebarProps {
  children: React.ReactNode;
  songs: Podcast[];
}

const Sidebar = ({ children }: SidebarProps) => {
  // const pathname = usePathname();

  //     {
  //       icon: Home,
  //       label: "Home",
  //       active: pathname !== "/search",
  //       href: "/",
  //     },
  //     {
  //       icon: Search,
  //       label: "Search",
  //       href: "/search",
  //       active: pathname === "/search",
  //     },
  //   ],
  //   [pathname],
  // );
  return (
    <div className="flex flex-col min-h-screen h-full">
      <div className="h-full">
        <Header></Header>
        <div
          className={twMerge(
            `
        flex 
        h-full
        `,
          )}
        >
          <div
            className="
          hidden 
          md:flex 
          flex-col 
          gap-y-2 
          h-full 
          w-[250px] 
          p-2
        "
          >
            <Box className="overflow-y-auto h-full">
              <></>
            </Box>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
