import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Login } from './Login';
import { Register } from './Register';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <AnimatePresence mode="wait">
        {isLogin ? (
          <Login key="login" onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <Register key="register" onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </AnimatePresence>
    </div>
  );
};
