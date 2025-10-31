import { motion } from "framer-motion";
import { Workflow } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 1.2
        }}
      >
        <Workflow className="w-14 h-14 text-blue-500" />
      </motion.div>
    </div>
  );
};

export default Loader;
