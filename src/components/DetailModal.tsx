import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Sparkles, 
  Download, 
  Heart, 
  Upload, 
  Trash2, 
  RotateCw, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  RefreshCw 
} from "lucide-react";
import { GalleryItem } from "../types";

interface DetailModalProps {
  item: GalleryItem;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export default function DetailModal({
  item,
  onClose,
  isBookmarked,
  onToggleBookmark,
}: DetailModalProps) {
  // Image states
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userPhotoMime, setUserPhotoMime] = useState<string>("image/jpeg");
  const [userPhotoName, setUserPhotoName] = useState<string>("");
  const [swappedResult, setSwappedResult] = useState<string | null>(null);
  
  // Interaction variables
  const [likeCount, setLikeCount] = useState(56);
  const [hasLiked, setHasLiked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generation status cycle states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generationMessages = [
    "Uploading target faces and preparing canvas...",
    "Scanning face coordinates & detecting facial points...",
    "Aligning camera angles and perspective lighting...",
    "Injecting model structures to style template...",
    "Blending textures, shadows, and eye lines...",
    "Finishing high-res cinematic render details...",
  ];

  // Seed interactive stats
  useEffect(() => {
    const baseLikes = Math.floor((item.title.charCodeAt(0) || 50) % 40) + 48;
    setLikeCount(baseLikes);
    setHasLiked(isBookmarked);
    
    // Clean states if chosen item changes
    setUserPhoto(null);
    setSwappedResult(null);
    setErrorMessage(null);
    setIsGenerating(false);
  }, [item, isBookmarked]);

  // Step ticker logic while generating
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setGenerationStep(0);
      interval = setInterval(() => {
        setGenerationStep((prev) => {
          if (prev >= generationMessages.length - 1) {
            return prev; // Hold at final message
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleLikeToggle = () => {
    if (hasLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setHasLiked(!hasLiked);
    onToggleBookmark();
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file formatting.");
      return;
    }
    
    // limit check ~ 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("Image files must be under 15MB. Please choose a optimized file.");
      return;
    }

    setUserPhotoMime(file.type);
    setUserPhotoName(file.name);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUserPhoto(event.target.result as string);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Could not parse image coordinates. Please try another image file.");
    };
    reader.readAsDataURL(file);
  };

  const clearUserPhoto = () => {
    setUserPhoto(null);
    setUserPhotoName("");
    setSwappedResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger Backend Face Swap call
  const triggerFaceSwapAction = async () => {
    if (!userPhoto) return;
    
    setIsGenerating(true);
    setErrorMessage(null);
    setSwappedResult(null);

    try {
      const response = await fetch("/api/face-swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userImageBase64: userPhoto,
          userMimeType: userPhotoMime,
          templateImageUrl: item.imageUrl,
          templatePrompt: item.generationPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Generation query did not return a valid swapped response.");
      }

      setSwappedResult(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Face translation failed. Please make sure your uploaded photo shows a clear closed-up portrait and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadResult = () => {
    if (!swappedResult) return;
    
    const link = document.createElement("a");
    link.href = swappedResult;
    link.download = `${item.title.toLowerCase().replace(/\s+/g, "_")}_face_swapped.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Keyboard escape mapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isGenerating) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isGenerating]);

  return (
    <div 
      id="detail-modal-wrapper" 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-black/95 backdrop-blur-xl animate-fade-in"
    >
      <div
        className="absolute inset-0 cursor-default"
        onClick={() => {
          if (!isGenerating) onClose();
        }}
      />

      {/* Main Container */}
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative my-auto w-full max-w-5xl rounded-[36px] border border-white/10 bg-[#07070a]/95 shadow-2xl overflow-hidden z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-0">
          
          {/* LEFT PANEL - Live Portrait Canvas Rendering */}
          <div className="md:col-span-7 relative p-5 flex flex-col justify-between border-b border-white/5 md:border-b-0 md:border-r border-white/10 bg-black/30 min-h-[440px] sm:min-h-[520px] md:min-h-[640px]">
            
            {/* Header elements over view canvas */}
            <div className="flex items-center justify-between w-full mb-4 z-20 px-1">
              {/* Image Type Tag */}
              <div className="flex items-center space-x-1.5 bg-zinc-900/90 border border-white/10 backdrop-blur-md rounded-full px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest text-zinc-300">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                <span>{swappedResult ? "RESULT PORTRAIT" : "TEMPLATE PREVIEW"}</span>
              </div>

              {/* Heart Stats */}
              <button
                onClick={handleLikeToggle}
                className={`flex items-center space-x-1.5 bg-zinc-900/90 border backdrop-blur-md rounded-full px-3 py-1.5 text-[10px] font-mono font-bold transition-all hover:bg-zinc-800 cursor-pointer ${
                  hasLiked 
                    ? "border-rose-500/30 text-rose-400" 
                    : "border-white/10 text-zinc-300 hover:text-white"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${hasLiked ? "fill-rose-500 text-rose-500 animate-pulse" : "text-zinc-400"}`} />
                <span>{likeCount}</span>
              </button>

              {/* Close / escape */}
              <button
                disabled={isGenerating}
                onClick={onClose}
                className="flex items-center space-x-1 bg-zinc-900/95 border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white backdrop-blur-md rounded-full px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Viewport Core Block */}
            <div className="relative flex-grow flex items-center justify-center p-2">
              <div className="relative max-w-sm w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-black/80 shadow-2xl">
                
                {/* 1. ORIGINAL / RESULT DISPLAY */}
                <AnimatePresence mode="wait">
                  {!swappedResult ? (
                    <motion.img
                      key="template-photo"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <motion.img
                      key="swapped-face-result"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                      src={swappedResult}
                      alt="Face-swapped original"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  )}
                </AnimatePresence>

                {/* 2. LIVE SCANNING OVERLAY (Shows when generating) */}
                <AnimatePresence>
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-indigo-950/20 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none"
                    >
                      {/* Hologram Grid */}
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-lg shadow-indigo-500 animate-scanner-beam top-0" />
                      
                      {/* Pulse Face Tracker ring */}
                      <div className="w-40 h-40 border-2 border-indigo-400/40 rounded-full border-dashed animate-spin absolute" style={{ animationDuration: '30s' }} />
                      <div className="w-32 h-32 border border-indigo-400/30 rounded-full absolute animate-pulse" />
                      
                      {/* Loading status details in the center */}
                      <div className="z-10 bg-zinc-950/90 border border-indigo-500/30 rounded-2xl p-4 text-center max-w-[240px] shadow-2xl">
                        <RotateCw className="h-6 w-6 text-indigo-400 animate-spin mx-auto mb-2.5" />
                        <h4 className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                          FUSION PROCESS
                        </h4>
                        <p className="text-[10px] text-zinc-400 mt-1.5 font-sans leading-tight">
                          {generationMessages[generationStep]}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

            {/* Bottom active status */}
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>TEMPLATE ID: {item.id}</span>
              {swappedResult ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check className="h-3 w-3" />
                  <span>SWAP CONFIGURED</span>
                </span>
              ) : (
                <span className="text-zinc-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-650" />
                  <span>AWAITING PHOTO UPLOAD</span>
                </span>
              )}
            </div>

          </div>

          {/* RIGHT PANEL - Image uploader & synthesis activation */}
          <div className="md:col-span-5 p-6 sm:p-7 flex flex-col justify-between max-h-[85vh] overflow-y-auto bg-[#09090c]/90">
            
            <div>
              {/* Creator details */}
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-7 rounded-lg border border-white/10 bg-zinc-800 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">
                      Cinematic Portrait Template
                    </h4>
                  </div>
                </div>
                
                <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[8.5px] font-mono text-indigo-400">
                  {item.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-heading text-lg font-extrabold text-white leading-tight tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-6 font-sans">
                Swap your face onto this cinematic style preset to generate a ready-to-use premium cinematic portrait picture instantly.
              </p>

              {/* IMAGE UPLOADER STEP */}
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">
                    your face photo
                  </span>
                  {userPhoto && (
                    <button
                      onClick={clearUserPhoto}
                      className="text-red-400 hover:text-red-300 text-[9.5px] font-mono uppercase font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                {!userPhoto ? (
                  // Drag and Drop Uploader Area
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-2xl border-2 border-dashed p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      isDragging 
                        ? "border-indigo-400 bg-indigo-500/[0.04] scale-98" 
                        : "border-white/10 bg-black/40 hover:border-white/35 hover:bg-white/[0.01]"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <div className="h-10 w-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 mb-3.5 shadow-lg group-hover:text-white">
                      <Upload className={`h-4.5 w-4.5 ${isDragging ? "animate-bounce text-indigo-400" : ""}`} />
                    </div>

                    <h4 className="text-xs font-bold text-white tracking-wide">
                      Upload portrait photo
                    </h4>
                    
                    <p className="text-[10px] text-zinc-500 mt-1.5 max-w-[190px] mx-auto leading-normal">
                      Drag & drop your face photo, or click to browse. Max 15MB.
                    </p>
                  </div>
                ) : (
                  // Uploaded Thumbnail Preview
                  <div className="rounded-2xl border border-white/10 bg-black/50 p-3.5 flex items-center space-x-4">
                    <div className="h-14 w-12 rounded-lg border border-white/10 overflow-hidden relative group shrink-0">
                      <img
                        src={userPhoto}
                        alt="My Face"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center space-x-1">
                        <Check className="h-3.5 w-3.5 text-indigo-400" />
                        <h4 className="text-xs font-bold text-white truncate">
                          Face Loaded Successfully
                        </h4>
                      </div>
                      
                      <p className="text-[9px] font-mono text-zinc-500 truncate mt-1">
                        {userPhotoName || "imported_source_frame.png"}
                      </p>
                    </div>

                    <button
                      onClick={clearUserPhoto}
                      disabled={isGenerating}
                      className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/5 border border-white/5 text-zinc-400 hover:text-white cursor-pointer transition-all shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* Error Panel if any */}
                {errorMessage && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-3 text-red-300 text-[10px] leading-relaxed flex items-start space-x-2">
                    <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

              </div>

              {/* Secure note */}
              <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.01] p-3 text-[10px] text-zinc-400 leading-relaxed mt-6">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Privacy Sealed</span>
                </div>
                <span>Your face photo is processed solely on safe cloud instances and is not kept or shared.</span>
              </div>

            </div>

            {/* ACTION HUB BOX */}
            <div className="mt-8 pt-5 border-t border-white/5">
              {!swappedResult ? (
                // TRIGGER ACTION GATING BUTTON
                <button
                  type="button"
                  disabled={!userPhoto || isGenerating}
                  onClick={triggerFaceSwapAction}
                  className={`w-full flex items-center justify-center space-x-2.5 rounded-2xl py-4 text-xs font-bold uppercase tracking-widest text-center shadow-lg transition-all duration-350 cursor-pointer ${
                    !userPhoto
                      ? "bg-zinc-900 border border-white/5 text-zinc-500 cursor-not-allowed opacity-60"
                      : isGenerating
                      ? "bg-indigo-950 border border-indigo-500/20 text-indigo-400 cursor-wait"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/25 border border-indigo-500/30"
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RotateCw className="h-4 w-4 animate-spin" />
                      <span>Synthesizing Face...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Assemble Portrait</span>
                    </>
                  )}
                </button>
              ) : (
                // DOWNLOAD RESULT BUTTONS
                <div className="space-y-3">
                  <button
                    onClick={downloadResult}
                    className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/20 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Swapped PNG</span>
                  </button>

                  <button
                    onClick={clearUserPhoto}
                    className="w-full flex items-center justify-center space-x-1.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/5 py-3 text-[10px] font-mono uppercase font-bold text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Try with another photo</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
}
