import React, { useState } from "react";

interface CompanyLogoProps {
  className?: string;
  height?: number;
  width?: number | "auto";
  mode?: "inline" | "block";
}

// Source PDF provided by user for the company logo
const LOGO_PDF_URL =
  "https://cdn.builder.io/o/assets%2F38a994ba860d47469e4b5a1051199f61%2F72ff055cbd234bfcae7ccce6320ae929?alt=media&token=0b05e0f1-ac36-4a7d-8adc-e43c45443053&apiKey=38a994ba860d47469e4b5a1051199f61";

export default function CompanyLogo({
  className,
  height = 32,
  width = "auto",
  mode = "block",
}: CompanyLogoProps) {
  const [fallback, setFallback] = useState<"img" | "object">("img");

  const style: React.CSSProperties = {
    display: mode === "inline" ? "inline-block" : "block",
    height,
    width,
  };

  // Try rendering as an image first (some environments will rasterize the first page)
  if (fallback === "img") {
    return (
      <img
        src={LOGO_PDF_URL}
        alt="Company logo"
        style={{ ...style, objectFit: "contain" }}
        onError={() => setFallback("object")}
        loading="lazy"
      />
    );
  }

  // Fallback: embed PDF directly. Most browsers will render the first page.
  return (
    <object
      data={LOGO_PDF_URL}
      type="application/pdf"
      style={style}
      aria-label="Company logo"
    >
      FLexo Digital
    </object>
  );
}
