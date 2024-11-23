import { getPodcasts } from "@/server/actions";
import Header from "../components/core/Header";
import Sidebar, { Podcast } from "../components/core/Sidebar";

import PageContent from "./components/PageContent";

export const revalidate = 0;

export default async function Home() {
  const podcasts: Podcast[] = await getPodcasts();
  return (
    <Sidebar songs={[]}>
      {/* You can duplicate the div below */}
      <div className="h-full flex-1 overflow-y-auto py-2 md:mr-2 ">
        <div
          className="
       rounded-md bg-background dark:border-none border border-foreground-muted
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto pb-96
      "
        >
          <Header>
            <div className="mb-2">
              <h1
                className="
              text-3xl 
              font-semibold
text-emerald-900 dark:text-emerald-50
            "
              >
                Your Podcasts
              </h1>
            </div>
          </Header>
          <div className="mt-2 mb-7 px-6">
            <div className="flex justify-between items-center"></div>
            <PageContent podcasts={podcasts} />
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
