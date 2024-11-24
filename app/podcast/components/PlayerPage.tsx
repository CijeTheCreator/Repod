import Player from "./Player";

const PlayerPage = () => {
  return true ? (
    <div className="h-full flex-1 overflow-y-auto py-2 mr-2">
      <div
        className="
        dark:bg-emerald-900 rounded-md bg-background dark:border-none border border-foreground-muted
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
          p-6
        pb-[200px]
      "
      >
        <Player></Player>
      </div>
    </div>
  ) : (
    <></>
  );
};
export default PlayerPage;
