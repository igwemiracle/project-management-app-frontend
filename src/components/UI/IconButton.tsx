import React from "react";

interface IconButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  className = "",
  onClick
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-md hover:bg-[#2C2F33] transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);
