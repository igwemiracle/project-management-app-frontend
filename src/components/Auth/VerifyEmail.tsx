import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { images } from "../../assets";
import BrandHeader from "../BrandHeader/BrandHeader";
import BottomImage from "./BottomImage";

export const GoToEmail = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="relative xs:w-[90%] xs:max-w-[300px] xxs:w-[90%] xxs:max-w-[300px] sm:w-[60%] sm:max-w-[300px] md:w-[50%] md:max-w-[350px] lg:w-[60%] lg:max-w-[370px] xl:w-[70%] xl:max-w-[400px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className=" mx-auto bg-white md:rounded-lg md:shadow-up-down py-8 
                md:border md:border-gray-100 sm:px-8"
      >
        {/* Brand Header */}
        <BrandHeader />

        {/* Body Text */}
        <p className="text-[#44556f] text-sm xl:text-[15px] leading-relaxed mb-6 font-normal">
          To complete your registration, we’ve sent a verification link to your
          email address. Please check your inbox.
        </p>

        {/* Email Display */}
        <div
          className="
      
      bg-blue-50 text-blue-700 text-sm xl:text-[15px] font-medium px-4 py-3 rounded-lg border border-blue-100 text-center shadow-sm"
        >
          {user?.email}
        </div>

        {/* Action Links */}
        <div className="flex items-center justify-center gap-3 mt-6 text-sm">
          <Link
            to={"/reset-password"}
            className="text-blue-600 hover:text-blue-800 underline font-medium transition"
          >
            Didn't receive an email?
          </Link>

          <span className="text-gray-300 text-xl leading-none">•</span>

          <Link
            to={"/register"}
            className="font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            Resend Email
          </Link>
        </div>

        <hr className="mt-8 border-gray-200" />
      </motion.div>
      <BottomImage src={images.v1} alt="first verify image" position="left" />
      <BottomImage src={images.v2} alt="second verify image" position="right" />
    </div>
  );
};
