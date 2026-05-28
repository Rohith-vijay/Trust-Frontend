import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const MasonryGallery = ({ assets = [], className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!assets || assets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm font-medium">
        No gallery items found.
      </div>
    );
  }

  // Map database media assets to lightbox slide format
  const slides = assets.map((asset) => {
    const isVideo = asset.mediaType === "VIDEO";
    return {
      src: asset.url,
      type: isVideo ? "video" : "image",
      title: asset.caption || "",
      description: asset.caption || "",
    };
  });

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Native CSS Column Masonry Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6 [column-fill:_balance] w-full">
        {assets.map((asset, index) => {
          const isVideo = asset.mediaType === "VIDEO";
          // If we have width & height from Cloudinary metadata, we can show proportional sizes
          const aspectRatioStyle = asset.aspectRatio 
            ? { aspectRatio: asset.aspectRatio } 
            : {};

          return (
            <div
              key={asset.id || index}
              onClick={() => handleOpen(index)}
              className="break-inside-avoid relative rounded-3xl overflow-hidden bg-brand-navy-dark/5 border border-gray-100 shadow-sm cursor-pointer group transition-all duration-500 hover:shadow-xl hover:border-amber-400/30 hover:-translate-y-1 block"
            >
              {/* Media Element Container */}
              <div className="relative overflow-hidden w-full" style={aspectRatioStyle}>
                {isVideo ? (
                  <div className="relative w-full h-full min-h-[220px] bg-brand-navy-dark flex items-center justify-center">
                    {asset.thumbnailUrl ? (
                      <img
                        src={asset.thumbnailUrl}
                        alt={asset.caption || "Video cover"}
                        loading="lazy"
                        className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-5xl">🎥</div>
                    )}
                    {/* Cinematic Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 group-hover:bg-black/20">
                      <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center border border-amber-400 shadow-lg transform transition duration-300 group-hover:scale-110">
                        <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={asset.url}
                    alt={asset.caption || "Gallery element"}
                    loading="lazy"
                    className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-103"
                  />
                )}

                {/* Elegant Hover Overlay with Caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  {isVideo && (
                    <span className="text-[9px] bg-amber-500 text-brand-navy-dark font-black px-2 py-0.5 rounded uppercase tracking-wider w-max mb-1.5">
                      VIDEO PREVIEW
                    </span>
                  )}
                  <p className="text-white text-xs font-semibold leading-relaxed line-clamp-2">
                    {asset.caption || "View Immersive Media"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hardware-accelerated, lazy-mounted Lightbox */}
      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          index={currentIndex}
          slides={slides}
          render={{
            slide: ({ slide }) => {
              if (slide.type === "video") {
                return (
                  <div className="w-full max-w-4xl max-h-[80vh] flex items-center justify-center p-4">
                    <video
                      src={slide.src}
                      controls
                      autoPlay
                      className="max-w-full max-h-full rounded-2xl shadow-2xl"
                    />
                  </div>
                );
              }
              return (
                <img
                  src={slide.src}
                  alt={slide.title}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
              );
            }
          }}
        />
      )}
    </div>
  );
};

export default MasonryGallery;
