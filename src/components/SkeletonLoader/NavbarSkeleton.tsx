import { WorkflowIcon } from "lucide-react";
import "../UI/loader.css";

export const NavbarSkeleton = () => {
  return (
    <div>
      {/* Fixed Navbar Skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-12 px-4 bg-white">
        {/* Left Section - Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center p-1 bg-gray-400 rounded-md">
            <WorkflowIcon size={16} strokeWidth={3} className="text-white" />
          </div>
          <div className="font-semibold text-[15px] tracking-wide text-gray-500">
            Planora
          </div>
        </div>

        {/* Center Section - Search + Create */}
        <div className="flex justify-center gap-2 items-center w-[65%] 2xl:w-[55%] lg:w-[65%] md:w-[60%] sm:w-[90%] xs:w-[95%]">
          <div className="hidden lg:flex items-center w-full px-3 py-[6px] border border-gray-300 rounded-md">
            <div className="w-4 h-4 mr-2 bg-gray-300 rounded" />
          </div>

          <div className="lg:hidden">
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
          </div>

          <div className="px-6 py-[6px] bg-gray-200 rounded-[4px] w-16 h-7" />
        </div>

        {/* Right Section - Icons & Account */}
        <div className="flex items-center gap-2">
          <div className="items-center hidden gap-2 sm:flex">
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
          </div>

          <div className="items-center hidden lg:flex">
            <div className="w-6 h-6 bg-gray-200 rounded-full" />
          </div>

          <div className="w-6 h-6 bg-gray-200 rounded-md sm:hidden" />
        </div>
      </nav>

      {/* Centered Loader Below Navbar */}
      <div className="flex items-center justify-center h-[calc(50vh-3rem)]">
        <span className="loader"></span>
      </div>
    </div>
  );
};
