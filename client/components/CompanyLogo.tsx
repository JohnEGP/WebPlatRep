import React from "react";

interface CompanyLogoProps {
  className?: string;
  height?: number | "auto" | string;
  width?: number | "auto" | string;
  mode?: "inline" | "block";
  src?: string;
  alt?: string;
}

// Default image (provided by user)
const DEFAULT_LOGO_IMG =
  "https://cdn.builder.io/api/v1/image/assets/38a994ba860d47469e4b5a1051199f61/57698deea5e24f6ea2564eb3b01d940e?format=webp&width=800";

export default function CompanyLogo({
  className,
  height = "auto",
  width = 180,
  mode = "block",
  src = DEFAULT_LOGO_IMG,
  alt = "Flexo Digital logo",
}: CompanyLogoProps) {
  const style: React.CSSProperties = {
    display: mode === "inline" ? "inline-block" : "block",
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
    maxWidth: "100%",
    objectFit: "contain",
  };

  return (
    <img
      src={src}
      alt={alt}
      style={style}
      className={className}
      loading="lazy"
    />
  );
}
