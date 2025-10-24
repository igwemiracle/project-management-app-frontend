// FloatingContainer.tsx
import { forwardRef, ReactNode } from "react";
import clsx from "clsx";

interface FloatingContainerProps {
  children: ReactNode;
  className?: string;
}

const FloatingContainer = forwardRef<HTMLDivElement, FloatingContainerProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "absolute bg-[#2C2F33] z-50 rounded-b-lg text-slate-300 space-y-2",
          "flex flex-col items-start text-left",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

FloatingContainer.displayName = "FloatingContainer";

export default FloatingContainer;
