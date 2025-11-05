import { motion } from "framer-motion";

const CardSkeleton = () => {
  return (
    <motion.div className="relative overflow-hidden transition-all bg-white border rounded-lg shadow-sm xs:w-full xxs:min-w-[10rem] xs:rounded-xl animate-pulse">
      {/*  */}

      {/* Header skeleton */}
      <div className="flex items-end bg-gray-200 rounded-t-lg lg:p-4 xs:h-16 xxs:h-18 lg:h-20 xs:p-2 md:h-20">
        <div className="w-1/2 h-3 bg-gray-300 rounded lg:h-5"></div>
      </div>

      {/* Body skeleton */}
      <div className="h-10 px-3 xxs:h-10 md:h-12">
        <div className="w-3/4 h-2 mb-1 bg-gray-200 rounded"></div>
        <div className="w-1/2 h-2 bg-gray-100 rounded"></div>
      </div>

      {/* Favorite icon placeholder */}
      <div className="absolute top-2 right-2 xs:top-3 xs:right-3">
        <div className="w-4 h-4 bg-gray-300 rounded-full xs:w-5 xs:h-5"></div>
      </div>
    </motion.div>
  );
};

export default CardSkeleton;
