import { Button } from "../components/button";
import Link from "next/link";
import { Globe, Podcast } from "lucide-react";
import FileUpload from "../components/FileUpload";
import { Header } from "../components/core/Navbar";
import { getSessionCookie, setSessionCookie } from "@/server/actions";

export default async function Home() {
  const sessionCookie = await getSessionCookie();
  let userId;
  if (sessionCookie) {
    userId = sessionCookie;
  } else {
    userId = await setSessionCookie();
  }

  return (
    <div>
      <Header></Header>

      <div className="w-screen min-h-screen">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-14">
          <div className="flex flex-col items-center text-center p-16 h-fit bg-gradient-to-b from-emerald-300 to-emerald-100 dark:from-emerald-800 dark:to-transparent dark:border-none border border-foreground-muted rounded-md">
            <div className="flex items-center my-4">
              <h1 className="mr-3 text-4xl font-semibold text-emerald-900 dark:text-emerald-100">
                Stream, Read, Revisit. <br />
                Repod Brings Podcasts to Life in Text
              </h1>
            </div>

            <div className="flex my-4">
              <>
                <Link href={``}>
                  <Button>
                    Your Podcasts <Podcast className="ml-2" />
                  </Button>
                </Link>
                <div className="ml-3">
                  <Button>
                    All Podcasts <Globe className="ml-2" />
                  </Button>
                </div>
              </>
            </div>

            <p className="max-w-xl mt-1 text-lg light:text-slate-600">
              Repod brings podcasts to life in text, making research and
              learning easier. Powered by Universal-2 by Assembly AI for
              cutting-edge transcription and audio intelligence.
            </p>

            <div className="w-full mt-4">
              <FileUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
