import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`
        w-full py-2 pl-10 pr-4 transition
        border border-gray-300 rounded-lg
        placeholder:text-sm
        lg:py-3
        focus:outline-none focus:ring-2 focus:ring-blue-500
        focus:border-transparent
        ${className}
      `}
      {...props}
    />
  );
}
