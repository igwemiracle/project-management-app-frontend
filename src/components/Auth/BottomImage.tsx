import React from "react";

interface BottomImageProps {
  src: string;
  alt: string;
  position?: "left" | "right";
  widths?: {
    md?: string;
    lg?: string;
    xl?: string;
  };
  className?: string;
}

const BottomImage: React.FC<BottomImageProps> = ({
  src,
  alt,
  position = "left",
  className = ""
}) => {
  const positionClass = position === "left" ? "left-0" : "right-0";

  return (
    <img
      src={src}
      alt={alt}
      className={`
    xs:hidden
    md:block
    fixed
    bottom-0
    ${positionClass}
    -z-10
    h-auto
    w-[clamp(210px,30vw,450px)]
    ${className}
  `}
    />
  );
};

export default BottomImage;
