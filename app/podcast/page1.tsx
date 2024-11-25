import Image from "next/image";
import PodcastContent from "../components/PodcastContent";
import Header from "../../components/spotify/Header";
import PlayerPage from "../components/PlayerPage";
import { ViewSummary } from "../../components/ViewSummary";
import Sidebar from "../../components/spotify/Sidebar";
import { AskAiDialog } from "../components/AskAIDialog";

export const revalidate = 0;

const Podcast = async () => {
  const podcast = {
    id: 1,
    titile: "The Joe Rogan Experience 2",
    imageUrl: "/joe.jpg",
    author: "Joe Rogan, Tristan Harris, Aza Raskin",
  };

  return (
    <Sidebar songs={[]}>
      <div className="h-full flex-1 overflow-y-auto py-2 mr-2">
        <div
          className="
        rounded-md bg-background dark:border-none border border-foreground-muted
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
          pb-[200px]
      "
        >
          <Header>
            <div className="mt-20">
              <div
                className="
              flex 
              flex-col 
              md:flex-row 
              items-center 
              gap-x-5
            "
              >
                <div
                  className="relative flex 
        bg-emerald-200
        dark:bg-emerald-700
        items-center
        justify-center
        rounded-md 
        min-h-[150px] 
        min-w-[150px] 
        overflow-hidden
                        text-5xl"
                >
                  {podcast.imageUrl ? (
                    <Image
                      className="object-cover"
                      fill
                      src={podcast.imageUrl}
                      alt="Playlist"
                      unoptimized
                    />
                  ) : (
                    <div
                      className="
        flex 
        bg-emerald-200
        dark:bg-emerald-700
        items-center
        justify-center
        relative 
        rounded-md 
        min-h-[150px] 
        min-w-[150px] 
        overflow-hidden
                        text-5xl
        "
                    >
                      {podcast.titile[0]}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
                  <p
                    className="hidden md:block font-semibold text-sm 
text-emerald-800 dark:text-emerald-200
"
                  >
                    {podcast.author}
                  </p>
                  <h1
                    className="
                  text-4xl 
                  sm:text-3xl 
                  lg:text-5xl 
                  font-bold
text-emerald-900 dark:text-emerald-100
                "
                  >
                    {podcast.titile}
                  </h1>
                  <ViewSummary />
                </div>
              </div>
            </div>
          </Header>
          <PodcastContent />
        </div>
      </div>
      <PlayerPage />
      <AskAiDialog />
    </Sidebar>
  );
};

export default Podcast;
