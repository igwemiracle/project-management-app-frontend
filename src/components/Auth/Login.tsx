import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Workflow } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login, clearError } from "../../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
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
      className="xs:w-[85%] xxs:w-[75%] sm:w-[50%] lg:w-[40%] xl:w-[35%] md:shadow-up-down md:rounded-xl md:p-9"
    >
      <div className="mx-auto mb-2 space-y-4">
        <div className="flex items-start justify-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center xs:size-10 sm:size-[40px] lg:size-[40px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg"
          >
            <Workflow className="text-white lg:size-6 xs:size-6" />
          </motion.div>
          <p className="font-medium xs:-mt-1 tracking-tight text-center text-gray-700 xs:text-[28px] sm:text-[30px]">
            Planora
          </p>
        </div>

        <p className="max-w-md mx-auto text-sm font-semibold leading-relaxed text-center text-gray-700">
          Log in to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="placeholder:text-sm w-full py-2 lg:py-3 pl-10 pr-4 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="placeholder:text-sm w-full py-2 lg:py-3 pl-10 pr-4 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
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
          className="w-full py-2 lg:py-3 font-semibold text-white transition rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </motion.button>
      </form>

      <div className="flex items-center justify-center gap-2 mt-5 text-center text-sm">
        <Link to={"/reset-password"} className="text-blue-500 underline">
          Can't log in?{" "}
        </Link>
        <span className="mb-2 text-lg">.</span>
        <Link
          to={"/register"}
          className="font-semibold text-blue-500 transition cursor-pointer hover:text-blue-700"
        >
          Create an account
        </Link>
      </div>

      <hr className="mt-4 text-gray-600" />
    </motion.div>
  );
};
