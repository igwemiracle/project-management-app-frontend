import { WorkspaceList } from "../Workspace/WorkspaceList";
import RecentlyViewed from "./RecentlyViewd";

export default function Homepage() {
  return (
    <div className="w-full mx-auto my-6 max-w-7xl xs:w-[85%] xxs:w-[80%] lg:w-[90%] xl:w-[95%]">
      {/* SHOW RECENTLY VIEWD BOARDS OR ACTIVITIES */}
      <RecentlyViewed />
      <WorkspaceList />
    </div>
  );
}
