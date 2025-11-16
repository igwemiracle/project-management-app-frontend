import { motion } from "framer-motion";
import { Workflow } from "lucide-react";

const BrandHeader = () => {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="size-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md"
      >
        <Workflow className="text-white size-6" />
      </motion.div>

      <div className="flex flex-col items-start">
        <h1 className="text-[30px] font-bold text-[#44556f] tracking-tight leading-none">
          Planora
        </h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "95%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-[3px] bg-blue-500 rounded-full mt-1"
        />
      </div>
    </div>
  );
};

export default BrandHeader;
