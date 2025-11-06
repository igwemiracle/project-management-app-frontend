import React from "react";

const ListSkeleton: React.FC = () => {
  return (
    <div className="mt-12 flex flex-col h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Header Skeleton */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
            <div>
              <div className="w-32 h-6 mb-2 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-48 h-4 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
          {/* <div className="w-24 h-8 bg-gray-300 rounded-lg animate-pulse"></div> */}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 overflow-x-auto">
        <div className="inline-flex min-h-full gap-4 p-6">
          {/* List Skeleton (Repeat for multiple lists) */}
          <div className="w-80">
            <div className="w-full h-8 mb-2 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="w-full h-12 mb-2 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="w-full h-12 mb-2 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="w-full h-8 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
          <div className="w-80">
            <div className="w-full h-8 mb-2 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="w-full h-12 mb-2 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="w-full h-8 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>

          {/* Add Another List Skeleton */}
          <div className="flex-shrink-0 w-80">
            <div className="w-full h-12 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListSkeleton;
