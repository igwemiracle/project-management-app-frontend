import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Workflow } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login, clearError } from "../../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="xs:w-full sm:w-[50%] lg:w-[40%] xl:w-[25%] px-6 md:shadow-up-down md:rounded-xl md:p-9"
    >
      <div className="flex items-start justify-center gap-2 mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center xs:size-12 sm:size-[44px] lg:size-[40px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl"
        >
          <Workflow className="text-white lg:size-6 xs:size-7" />
        </motion.div>
        <p className="font-medium sm:font-normal sm:-mt-2 tracking-tight text-center text-gray-800 xs:text-[33px] sm:text-[36px]">
          Planora
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            We'll send a recovery link to
          </label>
          <div className="relative">
            <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full py-3 pl-10 pr-4 transition border border-gray-400 rounded-lg focus:border-blue-300"
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
  );
}
