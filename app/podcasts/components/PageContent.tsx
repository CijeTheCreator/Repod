"use client";

import { Podcast } from "@/app/components/core/Sidebar";
import PodcastItem from "@/app/components/core/SongItem";

interface PageContentProps {
  podcasts: Podcast[];
}

const PageContent: React.FC<PageContentProps> = ({ podcasts }) => {
  if (podcasts.length === 0) {
    return <div className="mt-4 text-neutral-400">No podcasts available.</div>;
  }

  return (
    <div
      className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        2xl:grid-cols-8 
        gap-4 
        mt-4
      "
    >
      {podcasts.map((item) => (
        <PodcastItem key={item.id} data={item} />
      ))}
    </div>
  );
};

export default PageContent;
