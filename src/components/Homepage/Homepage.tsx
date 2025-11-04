import { WorkspaceList } from "../Workspace/WorkspaceList";
import RecentlyViewedBoard from "./RecentlyViewedBoard";

export default function Homepage() {
  return (
    <div className="mx-auto my-6 xs:w-[75%] xxs:w-[85%] lg:w-[80%] xl:w-[65%] 2xl:w-[60%]  ">
      {/* SHOW RECENTLY VIEWD BOARDS OR ACTIVITIES */}
      <RecentlyViewedBoard />
      <WorkspaceList />
    </div>
  );
}
