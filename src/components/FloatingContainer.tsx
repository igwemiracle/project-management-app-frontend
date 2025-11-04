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
          "absolute z-50  text-slate-300 space-y-2  shadow-up-down",
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
