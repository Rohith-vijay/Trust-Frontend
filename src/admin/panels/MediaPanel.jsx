import React, { useState, useEffect, useRef } from "react";
import MediaUploader from "../../components/MediaUploader";

const MediaPanel = () => {
  const [filterOwner, setFilterOwner] = useState("ALL");
  const [mediaType, setMediaType] = useState("ALL");
  const [uploadProgress, setUploadProgress] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    url: "",
    thumbnailUrl: "",
    caption: "",
    ownerType: "GENERAL",
    ownerId: "",
    mediaType: "IMAGE",
    orderIndex: "0"
  });

  const activeTimersRef = useRef([]);

  useEffect(() => {
    const timers = activeTimersRef.current;
    return () => {
      timers.forEach((t) => {
        if (t.type === "interval") clearInterval(t.id);
        if (t.type === "timeout") clearTimeout(t.id);
      });
    };
  }, []);

  // Mock initial media assets following the relational MediaAsset table structure
  const [assets, setAssets] = useState([
    {
      id: 1,
      ownerType: "EVENT",
      ownerId: 101,
      mediaType: "IMAGE",
      url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=150&q=80",
      caption: "Children attending digital literacy session in high school classroom",
      orderIndex: 0,
      uploadedAt: "2026-05-18T10:00:00Z"
    },
    {
      id: 2,
      ownerType: "EVENT",
      ownerId: 102,
      mediaType: "IMAGE",
      url: "https://images.unsplash.com/photo-1541913496-527181cf800f?auto=format&fit=crop&w=600&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1541913496-527181cf800f?auto=format&fit=crop&w=150&q=80",
      caption: "Field engineers installing deep borewell filtration kit",
      orderIndex: 0,
      uploadedAt: "2026-05-19T14:30:00Z"
    },
    {
      id: 3,
      ownerType: "STORY",
      ownerId: 201,
      mediaType: "IMAGE",
      url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=150&q=80",
      caption: "Urban seed sowing campaign volunteers matching smiles",
      orderIndex: 1,
      uploadedAt: "2026-05-20T09:15:00Z"
    },
    {
      id: 4,
      ownerType: "STORY",
      ownerId: 201,
      mediaType: "VIDEO",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=150&q=80",
      caption: "Documentary snippet showing the health clinic drive in remote region",
      orderIndex: 2,
      uploadedAt: "2026-05-21T08:00:00Z"
    }
  ]);

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
      simulateUpload(e.dataTransfer.files[0].name);
    }
  };

  const simulateUpload = (fileName) => {
    setUploadProgress(10);
    const intervalId = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalId);
          activeTimersRef.current = activeTimersRef.current.filter((t) => t.id !== intervalId);
          
          const timeoutId = setTimeout(() => {
            setUploadProgress(null);
            activeTimersRef.current = activeTimersRef.current.filter((t) => t.id !== timeoutId);
            // Append simulated asset to assets pool
            const newAsset = {
              id: Date.now(),
              ownerType: uploadForm.ownerType,
              ownerId: uploadForm.ownerId ? Number(uploadForm.ownerId) : null,
              mediaType: uploadForm.mediaType,
              url: uploadForm.url || "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80",
              thumbnailUrl: uploadForm.thumbnailUrl || "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=150&q=80",
              caption: uploadForm.caption || `Uploaded Asset: ${fileName || "initiative_photo.jpg"}`,
              orderIndex: Number(uploadForm.orderIndex || 0),
              uploadedAt: new Date().toISOString()
            };
            setAssets((prevAssets) => [newAsset, ...prevAssets]);
            setUploadForm({
              url: "",
              thumbnailUrl: "",
              caption: "",
              ownerType: "GENERAL",
              ownerId: "",
              mediaType: "IMAGE",
              orderIndex: "0"
            });
            alert("Relational media asset uploaded and mapped successfully!");
          }, 600);
          
          activeTimersRef.current.push({ type: "timeout", id: timeoutId });
          return 100;
        }
        return prev + 25;
      });
    }, 250);
    
    activeTimersRef.current.push({ type: "interval", id: intervalId });
  };

  const handleManualUpload = (e) => {
    e.preventDefault();
    simulateUpload(null);
  };

  const handleDeleteAsset = (id) => {
    if (!window.confirm("Remove this media asset?")) return;
    setAssets(assets.filter(a => a.id !== id));
  };

  const filteredAssets = assets.filter(asset => {
    const matchOwner = filterOwner === "ALL" || asset.ownerType === filterOwner;
    const matchType = mediaType === "ALL" || asset.mediaType === mediaType;
    return matchOwner && matchType;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-brand-navy-dark">Enterprise Media Asset Hub</h3>
        <span className="text-xs font-bold bg-amber-50 text-amber-700 px-3.5 py-1.5 rounded-full border border-amber-100 animate-pulse">
          JPA Relational Media Repository
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Form Block */}
        <div className="space-y-6">
          {/* Direct Cloudinary Uploader */}
          <div className="bg-gray-50/30 p-1.5 rounded-3xl border border-gray-100 shadow-sm">
            <MediaUploader
              mediaType={uploadForm.mediaType}
              label={`Direct Cloudinary ${uploadForm.mediaType} Uploader`}
              value={uploadForm.url}
              onUploadSuccess={(metadata) => {
                setUploadForm(prev => ({
                  ...prev,
                  url: metadata.secure_url,
                  thumbnailUrl: metadata.thumbnailUrl || metadata.secure_url,
                  width: metadata.width,
                  height: metadata.height,
                  aspectRatio: metadata.aspect_ratio,
                  publicId: metadata.public_id,
                  duration: metadata.duration
                }));
                // Append immediately to the local state pool to see it listed!
                const newAsset = {
                  id: Date.now(),
                  ownerType: uploadForm.ownerType,
                  ownerId: uploadForm.ownerId ? Number(uploadForm.ownerId) : null,
                  mediaType: uploadForm.mediaType,
                  url: metadata.secure_url,
                  thumbnailUrl: metadata.thumbnailUrl || metadata.secure_url,
                  caption: uploadForm.caption || `Uploaded Asset: ${metadata.public_id}`,
                  orderIndex: Number(uploadForm.orderIndex || 0),
                  width: metadata.width,
                  height: metadata.height,
                  aspectRatio: metadata.aspect_ratio,
                  publicId: metadata.public_id,
                  duration: metadata.duration,
                  uploadedAt: new Date().toISOString()
                };
                setAssets(prev => [newAsset, ...prev]);
                window.dispatchEvent(new CustomEvent("app-toast", {
                  detail: { message: "Cloud-native media asset uploaded successfully!", severity: "success" }
                }));
              }}
            />
          </div>

          {/* Form */}
          <form
            onSubmit={handleManualUpload}
            className="border border-gray-100 rounded-3xl p-5 bg-white space-y-4 shadow-sm"
          >
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b pb-2">Manual Asset Mapping</p>
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500">Asset File/Source URL *</label>
              <input
                value={uploadForm.url}
                onChange={(e) => setUploadForm(p => ({ ...p, url: e.target.value }))}
                placeholder="https://..."
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary/30 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500">Thumbnail URL (General listings)</label>
              <input
                value={uploadForm.thumbnailUrl}
                onChange={(e) => setUploadForm(p => ({ ...p, thumbnailUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary/30 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500">Caption / Alternative tag</label>
              <input
                value={uploadForm.caption}
                onChange={(e) => setUploadForm(p => ({ ...p, caption: e.target.value }))}
                placeholder="e.g. Volunteers plant trees during camp"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary/30 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500">Relation Owner</label>
                <select
                  value={uploadForm.ownerType}
                  onChange={(e) => setUploadForm(p => ({ ...p, ownerType: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none bg-white font-semibold cursor-pointer"
                >
                  <option value="GENERAL">GENERAL</option>
                  <option value="STORY">SUCCESS STORY</option>
                  <option value="EVENT">INITIATIVE EVENT</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500">Owner Entity ID</label>
                <input
                  type="number"
                  value={uploadForm.ownerId}
                  onChange={(e) => setUploadForm(p => ({ ...p, ownerId: e.target.value }))}
                  placeholder="ID (e.g. 52)"
                  className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500">Media Type</label>
                <select
                  value={uploadForm.mediaType}
                  onChange={(e) => setUploadForm(p => ({ ...p, mediaType: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none bg-white font-semibold cursor-pointer"
                >
                  <option value="IMAGE">IMAGE (JPEG/PNG)</option>
                  <option value="VIDEO">VIDEO (MP4/Youtube)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500">Order index</label>
                <input
                  type="number"
                  value={uploadForm.orderIndex}
                  onChange={(e) => setUploadForm(p => ({ ...p, orderIndex: e.target.value }))}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg text-xs font-bold hover:brightness-95 transition"
            >
              Upload & Map Asset
            </button>
          </form>
        </div>

        {/* Assets Grid Showcase */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-4 items-center bg-gray-50/50 p-4 rounded-2xl border">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1">Filter Entity</label>
              <select
                value={filterOwner}
                onChange={(e) => setFilterOwner(e.target.value)}
                className="text-xs border rounded-lg px-3 py-1.5 font-bold outline-none bg-white cursor-pointer"
              >
                <option value="ALL">ALL ENTITIES</option>
                <option value="GENERAL">GENERAL MEDIA</option>
                <option value="STORY">SUCCESS STORIES</option>
                <option value="EVENT">INITIATIVE EVENTS</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1">Filter Type</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="text-xs border rounded-lg px-3 py-1.5 font-bold outline-none bg-white cursor-pointer"
              >
                <option value="ALL">ALL TYPES</option>
                <option value="IMAGE">IMAGES</option>
                <option value="VIDEO">VIDEOS</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredAssets.map(asset => (
              <div
                key={asset.id}
                className="border border-gray-100 rounded-2xl overflow-hidden bg-white hover:shadow-md transition group relative flex flex-col"
              >
                <button
                  onClick={() => handleDeleteAsset(asset.id)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition text-xs shadow"
                >
                  ✕
                </button>

                {asset.mediaType === "IMAGE" ? (
                  <img
                    src={asset.url}
                    alt={asset.caption}
                    className="w-full h-44 object-cover border-b transition duration-500 group-hover:scale-102"
                  />
                ) : (
                  <div className="w-full h-44 bg-gray-950 flex flex-col items-center justify-center border-b relative">
                    <span className="text-4xl">🎥</span>
                    <span className="text-[10px] text-white/60 font-mono mt-2 truncate max-w-[80%]">{asset.url}</span>
                  </div>
                )}

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
                        {asset.ownerType} {asset.ownerId && `#${asset.ownerId}`}
                      </span>
                      <span className="text-[9px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {asset.mediaType}
                      </span>
                    </div>
                    {asset.caption && (
                      <p className="text-xs font-semibold text-brand-navy-dark leading-relaxed line-clamp-2 pt-1.5">
                        {asset.caption}
                      </p>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-3 pt-2.5 border-t border-gray-50 font-medium flex justify-between">
                    <span>Order: {asset.orderIndex}</span>
                    <span>Uploaded: {asset.uploadedAt && !isNaN(new Date(asset.uploadedAt).getTime()) ? new Date(asset.uploadedAt).toLocaleDateString() : "—"}</span>
                  </div>
                </div>
              </div>
            ))}
            {filteredAssets.length === 0 && (
              <div className="col-span-2 text-center py-16 text-gray-400 font-medium">
                No matching media assets discovered in repository.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPanel;
