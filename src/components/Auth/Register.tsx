import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { register, clearError } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { images } from "../../assets";
import BrandHeader from "../BrandHeader/BrandHeader";
import BottomImage from "./BottomImage";
import Input from "../UI/Input";

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: ""
  });

  useEffect(() => {
    dispatch(clearError());
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearError());
    try {
      await dispatch(register(formData)).unwrap();
      setFormData({ username: "", email: "", password: "", fullName: "" });
      navigate("/go-to-email");
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
        className="md:shadow-up-down md:rounded-lg md:p-9"
      >
        {/* Brand Header */}
        <BrandHeader />
        <p className="max-w-md mx-auto text-base font-semibold leading-relaxed text-center text-gray-700">
          Sign up to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative">
              <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="johndoe"
              />
            </div>
          </div>

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
            {loading ? "Creating account..." : "Create Account"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-blue-500 transition cursor-pointer hover:text-blue-700"
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
      <BottomImage src={images.v1} alt="first verify image" position="left" />
      <BottomImage src={images.v2} alt="second verify image" position="right" />
    </div>
  );
};
