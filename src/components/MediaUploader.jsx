import React, { useState, useRef } from "react";
import api from "../services/api";

const MediaUploader = ({
  onUploadSuccess,
  mediaType = "IMAGE", // "IMAGE" or "VIDEO"
  label = "Upload Media Asset",
  value = "",
  className = ""
}) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  // AbortController reference for cancellation
  const abortControllerRef = useRef(null);
  const fileInputRef = useRef(null);
  const currentFileRef = useRef(null); // Preserve file for retry safety

  // Allowed file sizes and types
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setError(null);
    currentFileRef.current = file;

    // Validate size
    if (file.size > MAX_FILE_SIZE && mediaType === "IMAGE") {
      setError("File exceeds 10MB limit. Please compress or choose a smaller image.");
      return;
    }

    // Validate format
    const isValidType = mediaType === "VIDEO" 
      ? ALLOWED_VIDEO_TYPES.includes(file.type) 
      : ALLOWED_IMAGE_TYPES.includes(file.type);

    if (!isValidType) {
      setError(`Invalid format. Allowed: ${mediaType === "VIDEO" ? "MP4, WebM, OGG, MOV" : "JPEG, PNG, WEBP, GIF, SVG"}`);
      return;
    }

    // Start upload
    performUpload(file);
  };

  const performUpload = async (file) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    // Instantiate AbortController for cancellation handling
    abortControllerRef.current = new AbortController();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mediaType", mediaType);

    try {
      const response = await api.post("/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
        signal: abortControllerRef.current.signal
      });

      // Response unwrapping is handled by Axios response interceptor in api.js
      const metadata = response.data;
      setIsUploading(false);
      setProgress(0);

      if (onUploadSuccess && metadata) {
        onUploadSuccess(metadata);
      }
    } catch (err) {
      if (err.name === "CanceledError" || api.isCancel(err)) {
        log.warn("Upload cancelled by user.");
        setError("Upload cancelled.");
      } else {
        log.error("Media upload error: ", err);
        setError(err.response?.data?.message || "Failed to upload file. Please try again.");
      }
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleRetry = () => {
    if (currentFileRef.current) {
      performUpload(currentFileRef.current);
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block">{label}</label>

      {/* Main Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 relative flex flex-col items-center justify-center min-h-[140px] bg-white ${
          dragActive
            ? "border-amber-400 bg-amber-500/5 scale-102"
            : "border-gray-250 hover:border-amber-500/30 hover:bg-gray-50/50"
        } ${isUploading ? "pointer-events-none opacity-85" : ""}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={mediaType === "VIDEO" ? "video/*" : "image/*"}
          className="hidden"
        />

        {!isUploading && !error && (
          <>
            <span className="text-3xl mb-2.5 select-none">{mediaType === "VIDEO" ? "🎬" : "📸"}</span>
            <p className="text-xs font-bold text-brand-navy-dark leading-relaxed">
              Drag & drop or <span className="text-primary hover:underline">browse</span>
            </p>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
              Max size: 10MB ({mediaType === "VIDEO" ? "MP4 / WebM" : "WebP / PNG / JPG"})
            </p>
          </>
        )}

        {isUploading && (
          <div className="w-full px-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs font-bold text-brand-navy-dark">Uploading media ({progress}%)</p>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-150">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="text-[10px] bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-3.5 py-1 rounded-full font-bold transition shadow-sm"
            >
              Cancel Upload
            </button>
          </div>
        )}

        {error && !isUploading && (
          <div className="w-full px-4 text-center space-y-2.5" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs font-bold text-red-500">{error}</p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={handleRetry}
                className="text-[10px] bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 px-3.5 py-1 rounded-full font-bold transition shadow-sm"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  currentFileRef.current = null;
                }}
                className="text-[10px] bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 px-3.5 py-1 rounded-full font-bold transition shadow-sm"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expose read-only current URL under the uploader */}
      {value && !isUploading && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100 text-[10px] text-gray-500 font-mono break-all truncate">
          <span className="font-bold text-amber-600 shrink-0">URL:</span>
          <span>{value}</span>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
