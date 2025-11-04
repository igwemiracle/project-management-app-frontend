const RecentBoardSkeleton = () => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Color box skeleton */}
        <div className="w-6 h-6 rounded-md bg-gray-300 animate-pulse" />

        {/* Texts */}
        <div className="flex flex-col gap-1">
          <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse" />
          <div className="w-24 h-3 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Right side - star icon skeleton */}
      <div className="w-5 h-5 rounded-full bg-gray-300 animate-pulse" />
    </div>
  );
};

export default RecentBoardSkeleton;
