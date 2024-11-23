"use client";
import { CustomPlaceholder } from "react-placeholder-image";
import Image from "next/image";
// import PlayButton from "./PlayButton";
import { Podcast } from "./Sidebar";
import { useRouter } from "next/navigation";

interface PodcastItemProps {
  data: Podcast;
}

const PodcastItem: React.FC<PodcastItemProps> = ({ data }) => {
  // TODO: Checkout use imagePath
  // const imagePath = useLoadImage(data);

  const router = useRouter();
  return (
    <div
      className="
        relative 
        group 
        flex 
        flex-col 
        items-center 
        justify-center 
        rounded-md 
        overflow-hidden 
        gap-x-4 
        bg-emerald-200
        dark:bg-emerald-800
        cursor-pointer 
        hover:bg-emerald-400
        transition 
        p-3
      "
      onClick={() => {
        router.push("/podcast?id=1");
      }}
    >
      <div
        className="
          relative 
          aspect-square 
          w-full
          h-full 
          rounded-md 
          overflow-hidden
        "
      >
        {data.imageUrl ? (
          <Image
            className="object-cover"
            src={data.imageUrl}
            fill
            alt="Cover Image"
            unoptimized
          />
        ) : (
          <CustomPlaceholder
            width={200}
            height={200}
            textColor="#ffffff"
            backgroundColor="#C7E9CC"
            text={data.titile[0]}
          />
        )}
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full text-emerald-900 dark:text-emerald-100">
          {data.titile}
        </p>
        <p
          className="
text-emerald-800 dark:text-emerald-200
            text-sm 
            pb-4 
            w-full 
            truncate
          "
        >
          By {data.author}
        </p>
      </div>
      <div
        className="
          absolute 
          bottom-24 
          right-5
        "
      >
        {/* <PlayButton /> */}
      </div>
    </div>
  );
};

export default PodcastItem;
