import React, { useState, useEffect } from "react";

const SmartImage = ({
  src,
  alt = "Charity Platform Image",
  imageType = "story", // "hero" | "story" | "event" | "gallery" | "avatar" | "team"
  className = "",
  style = {},
  fallbackSrc = "https://via.placeholder.com/800x450?text=No+Image+Available",
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    if (src) {
      setLoading(true);
      setError(false);
      
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setCurrentSrc(src);
        setLoading(false);
      };
      img.onerror = () => {
        console.error(`Failed to load image at: ${src}`);
        setCurrentSrc(fallbackSrc);
        setError(true);
        setLoading(false);
      };
    } else {
      setCurrentSrc(fallbackSrc);
      setLoading(false);
    }
  }, [src, fallbackSrc]);

  // Determine standard rendering styles based on the type preset
  const getPresetStyles = () => {
    switch (imageType) {
      case "hero":
        return {
          aspectRatio: "21 / 9",
          objectFit: "cover",
          objectPosition: "center",
        };
      case "story":
      case "event":
        return {
          aspectRatio: "16 / 9",
          objectFit: "cover",
          objectPosition: "center",
        };
      case "gallery":
        return {
          aspectRatio: "4 / 3",
          objectFit: "cover",
          objectPosition: "center",
        };
      case "team":
        return {
          aspectRatio: "3 / 4",
          objectFit: "cover",
          objectPosition: "top center", // Prevent cutting off foreheads
        };
      case "avatar":
        return {
          aspectRatio: "1 / 1",
          objectFit: "cover",
          objectPosition: "center",
          borderRadius: "50%",
        };
      default:
        return {
          objectFit: "cover",
          objectPosition: "center",
        };
    }
  };

  const presetStyle = getPresetStyles();
  const mergedStyle = {
    ...presetStyle,
    ...style,
    transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
    opacity: loading ? 0 : 1,
    transform: loading ? "scale(0.98)" : "scale(1)",
  };

  return (
    <div 
      className={`relative overflow-hidden w-full h-full flex items-center justify-center bg-gray-550/5 ${className}`}
      style={{ 
        aspectRatio: presetStyle.aspectRatio,
        borderRadius: presetStyle.borderRadius || "inherit"
      }}
    >
      {loading && (
        <div className="absolute inset-0 z-10 shimmer-bg w-full h-full" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        style={mergedStyle}
        className="w-full h-full"
        {...props}
      />
    </div>
  );
};

export default SmartImage;
