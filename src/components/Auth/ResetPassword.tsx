import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login, clearError } from "../../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import BrandHeader from "../BrandHeader/BrandHeader";
import { images } from "../../assets";
import BottomImage from "./BottomImage";
import Input from "../UI/Input";

export default function ResetPassword() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, loading } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(clearError());

    try {
      await dispatch(login(formData)).unwrap();
      navigate("/");
    } catch (err: any) {
      console.error("Login failed:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="relative xs:w-[90%] xs:max-w-[300px] xxs:w-[90%] xxs:max-w-[300px] sm:w-[60%] sm:max-w-[300px] md:w-[50%] md:max-w-[350px] lg:w-[60%] lg:max-w-[370px] xl:w-[70%] xl:max-w-[400px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:shadow-up-down md:rounded-xl md:p-9"
      >
        {/* Brand Header */}
        <BrandHeader />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block my-2 text-base font-medium text-gray-700">
              We'll send a recovery link to
            </label>
            <div className="relative">
              <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white transition rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending link..." : "Send recovery link"}
          </motion.button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-6 text-center">
          <Link
            to={"/login"}
            className="font-normal text-blue-600 transition cursor-pointer hover:text-blue-700 hover:underline"
          >
            Return to log in
          </Link>
          <hr className="border-gray-700" />
        </div>
        <hr className="mt-5 text-gray-600" />
      </motion.div>

      <BottomImage src={images.v1} alt="first verify image" position="left" />
      <BottomImage src={images.v2} alt="second verify image" position="right" />
    </div>
  );
}
