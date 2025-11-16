import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login, clearError } from "../../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../assets";
import BrandHeader from "../BrandHeader/BrandHeader";
import BottomImage from "./BottomImage";
import Input from "../UI/Input";

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, []);
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
        className="md:shadow-up-down md:rounded-sm md:p-9"
      >
        <div className="mx-auto mb-2 space-y-4">
          {/* Brand Header */}
          <BrandHeader />

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
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="pl-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-sm text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:underline focus:outline-none"
              >
                {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
              </button>
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
            className="w-full py-2 font-semibold text-white transition rounded-lg lg:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-5 text-sm text-center">
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

      {/* Bottom image */}
      <BottomImage src={images.v1} alt="first verify image" position="left" />
      <BottomImage src={images.v2} alt="second verify image" position="right" />
    </div>
  );
};
