import React, { useState } from "react";
import ReactPlayer from "react-player";

const MediaEmbed = ({
  url,
  posterUrl,
  caption,
  muted = false,
  loop = false,
  playing = false,
  controls = true,
  aspectRatio = "16/9",
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(playing);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Normalize aspect ratio to Tailwind or inline CSS format
  const aspectStyle = {
    aspectRatio: aspectRatio.replace("/", " / ")
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-brand-navy-dark/95 border border-amber-500/10 shadow-lg group ${className}`}>
      {/* Aspect Ratio Container */}
      <div className="relative w-full overflow-hidden" style={aspectStyle}>
        
        {/* Poster Image / Custom Play Overlay for Cinematic Pre-load state */}
        {!isPlaying && posterUrl && (
          <div className="absolute inset-0 z-10 cursor-pointer overflow-hidden transition-all duration-700">
            <img
              src={posterUrl}
              alt={caption || "Video preview"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Elegant Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6" onClick={() => setIsPlaying(true)}>
              {/* Play Button Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  aria-label="Play video"
                  className="w-16 h-16 rounded-full bg-primary/95 text-white flex items-center justify-center border-2 border-amber-400 shadow-2xl transition duration-300 transform group-hover:scale-110 group-hover:bg-amber-400/90 focus:outline-none"
                >
                  <svg className="w-6 h-6 fill-current translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>

              {caption && (
                <div className="max-w-[85%] animate-fade-in">
                  <p className="text-white text-xs font-bold tracking-widest uppercase text-amber-400 mb-1">
                    Event Highlight
                  </p>
                  <p className="text-white font-medium text-sm md:text-base leading-snug drop-shadow">
                    {caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && isPlaying && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-navy-dark/90 z-0">
            <div className="w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-navy-dark text-center p-6 z-20">
            <span className="text-4xl mb-3">⚠️</span>
            <p className="text-white text-sm font-bold">Failed to load media</p>
            <p className="text-gray-400 text-xs mt-1">Unsupported video format or invalid URL</p>
          </div>
        )}

        {/* React Player Instance */}
        {(isPlaying || !posterUrl) && (
          <div className="absolute inset-0 w-full h-full">
            <ReactPlayer
              url={url}
              width="100%"
              height="100%"
              playing={isPlaying}
              muted={muted}
              loop={loop}
              controls={controls}
              onReady={() => setIsLoading(false)}
              onStart={() => setIsLoading(false)}
              onError={(e) => {
                log.error("Video player error: ", e);
                setHasError(true);
                setIsLoading(false);
              }}
              style={{ position: "absolute", top: 0, left: 0 }}
              config={{
                youtube: {
                  playerVars: { showinfo: 0, rel: 0, modestbranding: 1 }
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaEmbed;
