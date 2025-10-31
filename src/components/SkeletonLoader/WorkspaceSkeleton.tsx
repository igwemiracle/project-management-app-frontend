import { motion } from "framer-motion";

const WorkspaceSkeleton = () => {
  const skeletons = Array(3).fill(0);

  return (
    <div className="grid grid-cols-1 xs:gap-y-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {skeletons.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-4 rounded-xl border border-gray-50 bg-white shadow-sm"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Menu items grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {Array(4)
              .fill(0)
              .map((_, j) => (
                <div
                  key={j}
                  className="flex items-center gap-2 p-2 bg-gray-100 rounded animate-pulse"
                >
                  <div className="w-4 h-4 bg-gray-300 rounded" />
                  <div className="w-16 h-3 bg-gray-300 rounded" />
                </div>
              ))}
          </div>

          {/* Create new board */}
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        </motion.div>
      ))}
    </div>
  );
};

export default WorkspaceSkeleton;
