import React, { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";
import api from "../services/api";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Slider, 
  Typography, 
  Alert, 
  Box,
  CircularProgress
} from "@mui/material";

const SmartImageUploader = ({
  onUploadSuccess,
  imageType = "story", // "hero" | "story" | "event" | "gallery" | "avatar" | "team"
  label = "Upload Image",
  value = "",
  className = ""
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedAreaPercent, setCroppedAreaPercent] = useState(null);
  const [isCroppingOpen, setIsCroppingOpen] = useState(false);
  const [originalMetadata, setOriginalMetadata] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);
  const fileNameRef = useRef("cropped-image.jpg");
  const fileTypeRef = useRef("image/jpeg");

  // Presets mapping for Crop Ratios
  const getAspectPreset = () => {
    switch (imageType) {
      case "hero":
        return { ratio: 21 / 9, text: "21:9 (Hero Banner)" };
      case "story":
      case "event":
        return { ratio: 16 / 9, text: "16:9 (Cover Image)" };
      case "gallery":
        return { ratio: 4 / 3, text: "4:3 (Gallery Card)" };
      case "team":
        return { ratio: 3 / 4, text: "3:4 (Team Member)" };
      case "avatar":
        return { ratio: 1 / 1, text: "1:1 (User Avatar)" };
      default:
        return { ratio: 16 / 9, text: "16:9 (Standard)" };
    }
  };

  const preset = getAspectPreset();

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      fileNameRef.current = file.name;
      fileTypeRef.current = file.type;

      // Extract original metadata via runtime Image constructor
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          const ratio = width / height;
          const orientation = ratio > 1.15 ? "Landscape" : ratio < 0.85 ? "Portrait" : "Square";
          
          setOriginalMetadata({
            width,
            height,
            aspectRatio: ratio.toFixed(2),
            orientation
          });
        };
        img.src = reader.result;
        setImageSrc(reader.result);
        setIsCroppingOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    setCroppedAreaPercent(croppedArea);
  }, []);

  const handleUpload = async () => {
    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      // 1. Crop canvas to blob
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      if (!croppedBlob) {
        throw new Error("Failed to process cropped canvas image.");
      }

      // 2. Wrap blob to standard File payload
      const file = new File([croppedBlob], fileNameRef.current, {
        type: fileTypeRef.current || "image/jpeg",
        lastModified: Date.now()
      });

      // 3. Perform standard API call
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mediaType", "IMAGE");

      const response = await api.post("/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });

      const metadata = response.data;
      setIsUploading(false);
      setIsCroppingOpen(false);
      setImageSrc(null);

      if (onUploadSuccess && metadata) {
        onUploadSuccess(metadata);
      }
    } catch (err) {
      console.error("Failed to crop or upload image: ", err);
      setError(err.response?.data?.message || "Failed to crop/upload image. Please try again.");
      setIsUploading(false);
    }
  };

  // Determine if metadata differs significantly from recommended ratio
  const getRecommendationMessage = () => {
    if (!originalMetadata) return null;
    const diff = Math.abs(parseFloat(originalMetadata.aspectRatio) - preset.ratio);
    if (diff > 0.3) {
      return `Recommended aspect ratio is ${preset.text}. Your image is ${originalMetadata.orientation} (${originalMetadata.width}x${originalMetadata.height}). Use the cropper below to select the best visible portion.`;
    }
    return null;
  };

  // Renders the mock card wrapper depending on preset
  const renderLivePreview = () => {
    if (!imageSrc || !croppedAreaPercent) return null;

    const scaleX = 100 / croppedAreaPercent.width;
    const scaleY = 100 / croppedAreaPercent.height;
    const translateX = -croppedAreaPercent.x * scaleX;
    const translateY = -croppedAreaPercent.y * scaleY;

    const previewStyle = {
      width: `${scaleX * 100}%`,
      height: `${scaleY * 100}%`,
      transform: `translate(${translateX}%, ${translateY}%)`,
      position: "absolute",
      left: 0,
      top: 0,
      objectFit: "cover",
      transformOrigin: "top left"
    };

    switch (imageType) {
      case "avatar":
        return (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-150 rounded-2xl space-y-2">
            <Typography variant="caption" className="font-bold text-gray-500 uppercase tracking-wider">Live Avatar Preview</Typography>
            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-white">
              <img src={imageSrc} style={previewStyle} alt="Avatar Preview" />
            </div>
          </div>
        );
      case "team":
        return (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-150 rounded-2xl space-y-2">
            <Typography variant="caption" className="font-bold text-gray-500 uppercase tracking-wider">Live Card Preview</Typography>
            <div className="relative w-36 h-48 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
              <img src={imageSrc} style={previewStyle} alt="Team Preview" />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white text-[10px] font-bold text-center">
                Member Profile
              </div>
            </div>
          </div>
        );
      case "hero":
        return (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-150 rounded-2xl space-y-2 w-full">
            <Typography variant="caption" className="font-bold text-gray-500 uppercase tracking-wider">Live Banner Preview</Typography>
            <div className="relative w-full h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white" style={{ aspectRatio: "21/9" }}>
              <img src={imageSrc} style={previewStyle} alt="Hero Preview" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white font-bold text-xs">
                Hero Section banner
              </div>
            </div>
          </div>
        );
      default: // story, event, gallery
        return (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-150 rounded-2xl space-y-2">
            <Typography variant="caption" className="font-bold text-gray-500 uppercase tracking-wider">Live Card Preview</Typography>
            <div className="relative w-52 h-28 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white" style={{ aspectRatio: "16/9" }}>
              <img src={imageSrc} style={previewStyle} alt="Card Preview" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block">{label}</label>

      {/* Main Trigger Uploader Box */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className="border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer border-gray-250 hover:border-amber-500/30 hover:bg-gray-50/50 transition duration-300 min-h-[140px] flex flex-col items-center justify-center bg-white relative"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {isUploading ? (
          <div className="w-full px-4 space-y-2 flex flex-col items-center">
            <CircularProgress size={24} color="warning" />
            <p className="text-xs font-bold text-brand-navy-dark">Cropping & Uploading ({progress}%)</p>
          </div>
        ) : (
          <>
            <span className="text-3xl mb-2.5 select-none">📸</span>
            <p className="text-xs font-bold text-brand-navy-dark">
              Click to select or drag & drop {preset.text} image
            </p>
            <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
              Supports JPEG, PNG, WEBP, SVG
            </p>
          </>
        )}
      </div>

      {/* Output Link display matching original uploader design */}
      {value && !isUploading && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100 text-[10px] text-gray-500 font-mono break-all truncate">
          <span className="font-bold text-amber-600 shrink-0">URL:</span>
          <span>{value}</span>
        </div>
      )}

      {/* Crop and Metadata Management Modal Dialog */}
      <Dialog 
        open={isCroppingOpen} 
        onClose={() => !isUploading && setIsCroppingOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="font-bold text-brand-navy-dark text-base">
          Crop & Hardening Image Preset: {preset.text}
        </DialogTitle>
        <DialogContent dividers className="space-y-4">
          
          {/* Metadata Display Panel */}
          {originalMetadata && (
            <div className="grid grid-cols-4 gap-2 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 text-xs text-amber-900 font-semibold">
              <div><span className="text-gray-450 block text-[9px] uppercase font-bold tracking-wider">Dimensions</span>{originalMetadata.width} x {originalMetadata.height} px</div>
              <div><span className="text-gray-450 block text-[9px] uppercase font-bold tracking-wider">Aspect Ratio</span>{originalMetadata.aspectRatio}</div>
              <div><span className="text-gray-450 block text-[9px] uppercase font-bold tracking-wider">Orientation</span>{originalMetadata.orientation}</div>
              <div><span className="text-gray-450 block text-[9px] uppercase font-bold tracking-wider">Recommended</span>{preset.text}</div>
            </div>
          )}

          {/* Recommendation Alerts */}
          {getRecommendationMessage() && (
            <Alert severity="warning" className="text-xs font-medium rounded-xl">
              {getRecommendationMessage()}
            </Alert>
          )}

          {/* Interactive Cropper Panel */}
          <div className="relative w-full h-[320px] bg-gray-900 rounded-2xl overflow-hidden shadow-inner">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={preset.ratio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          {/* Controls Panel & Live Preview Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            
            {/* Cropper Sliders */}
            <div className="space-y-3">
              <div>
                <Typography variant="caption" className="font-bold text-gray-500 block mb-1">Zoom (Drag or Slider)</Typography>
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.05}
                  color="warning"
                  onChange={(e, val) => setZoom(val)}
                />
              </div>
              <div>
                <Typography variant="caption" className="font-bold text-gray-500 block mb-1">Rotation (Slider)</Typography>
                <Slider
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  color="warning"
                  onChange={(e, val) => setRotation(val)}
                />
              </div>
            </div>

            {/* Live Preview Display */}
            {renderLivePreview()}
          </div>

          {error && (
            <Alert severity="error" className="text-xs font-bold rounded-xl">
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions className="p-3">
          <Button 
            onClick={() => setIsCroppingOpen(false)} 
            disabled={isUploading}
            className="text-gray-500 font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            variant="contained"
            color="warning"
            className="rounded-full px-5 font-bold shadow-sm"
          >
            {isUploading ? "Uploading..." : "Crop & Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SmartImageUploader;
