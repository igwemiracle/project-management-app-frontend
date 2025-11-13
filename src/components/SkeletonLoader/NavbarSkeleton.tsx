import { WorkflowIcon } from "lucide-react";

export const NavbarSkeleton = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-12 px-4 bg-white">
      {/* Left Section - Logo */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center p-1 bg-gray-400 rounded-md">
          <WorkflowIcon size={16} strokeWidth={3} className="text-white" />
        </div>
        <div className="text-gray-400">Planora</div>
      </div>

      {/* Center Section - Search + Create */}
      <div className="flex justify-center gap-2 items-center w-[65%] 2xl:w-[55%] lg:w-[65%] md:w-[60%] sm:w-[90%] xs:w-[95%]">
        {/* Search bar skeleton (desktop) */}
        <div className="hidden lg:flex items-center w-full px-3 py-[6px] border border-gray-300 rounded-md">
          <div className="w-4 h-4 mr-2 bg-gray-300 rounded" />
          {/* <div className="w-full h-3 bg-gray-300 rounded" /> */}
        </div>

        {/* Mobile Search Icon */}
        <div className="lg:hidden">
          <div className="w-5 h-5 bg-gray-300 rounded-full" />
        </div>

        {/* Create Button */}
        <div className="px-6 py-[6px] bg-gray-200 rounded-[4px] w-16 h-7" />
      </div>

      {/* Right Section - Icons & Account */}
      <div className="flex items-center gap-2">
        {/* Desktop Icons */}
        <div className="items-center hidden gap-2 sm:flex">
          <div className="w-5 h-5 bg-gray-300 rounded-full" />
          <div className="w-5 h-5 bg-gray-300 rounded-full" />
          <div className="w-5 h-5 bg-gray-300 rounded-full" />
        </div>

        {/* Account Avatar */}
        <div className="items-center hidden lg:flex">
          <div className="w-6 h-6 bg-gray-300 rounded-full" />
        </div>

        {/* Mobile Menu Icon */}
        <div className="w-6 h-6 bg-gray-300 rounded-md sm:hidden" />
      </div>
    </nav>
  );
};
