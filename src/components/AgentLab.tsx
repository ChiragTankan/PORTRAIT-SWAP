import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  RefreshCw, 
  Download, 
  Trash2, 
  Cpu, 
  Zap, 
  CheckCircle,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AgentLabProps {
  user: any;
  onOpenAuth: (msg: string) => void;
  showToast: (message: string, type: "success" | "info" | "error") => void;
}

const PRESET_IDEAS = [
  { text: "Astronaut on Mars in neon sleek suit", label: "🪐 Sleek Astronaut" },
  { text: "Cyberpunk rebel with holographic visor and matrix rain background", label: "⚡ Cyberpunk Rebel" },
  { text: "Royal monarch in embroidered velvet robe wearing golden crown", label: "👑 Royal Golden Crown" },
  { text: "Ancient Norse warrior in fur armor in front of northern lights", label: "❄️ Norse Warrior" },
  { text: "1920s film-noir detective under misty streetlight with shadow play", label: "🕵️‍♂️ Film Noir Detective" },
  { text: "High-elves protector with glowing green markings and silver hair", label: "🍃 Elf Protector" },
];

export default function AgentLab({ user, onOpenAuth, showToast }: AgentLabProps) {
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMime, setPhotoMime] = useState<string>("image/jpeg");
  const [photoName, setPhotoName] = useState<string>("");
  const [customStyle, setCustomStyle] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [integrationStatus, setIntegrationStatus] = useState<{ asiOneActive: boolean; geminiActive: boolean } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/integration-status")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load");
      })
      .then((data) => setIntegrationStatus(data))
      .catch((err) => console.warn("Failed to retrieve integration schema:", err));
  }, []);

  // File loading mechanism
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Please supply a valid image file.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoBase64(reader.result as string);
      setPhotoMime(file.type);
      setPhotoName(file.name);
      showToast("Face portrait uploaded successfully!", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Trigger file browser manually
  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  // Clearing selection
  const handleClearSource = () => {
    setPhotoBase64(null);
    setPhotoMime("image/jpeg");
    setPhotoName("");
    showToast("Source portrait removed.", "info");
  };

  // Core Agent Customization trigger
  const handleAgentCustomize = async () => {
    if (!user) {
      onOpenAuth("Login is required to run the custom ASI Face-Swap agent.");
      return;
    }

    if (!photoBase64) {
      showToast("Please upload your portrait face photo first.", "error");
      return;
    }

    if (!customStyle.trim()) {
      showToast("Please describe the cinematic or fantasy style you want to apply.", "error");
      return;
    }

    setIsProcessing(true);
    setResultImageUrl(null);

    try {
      const response = await fetch("/api/agent-customize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userImageBase64: photoBase64,
          userMimeType: photoMime,
          customStylePrompt: customStyle.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Synthesis failed.");
      }

      setResultImageUrl(data.imageUrl);
      showToast("ASI One customized portrait generated successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "An error occurred during facial generation.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper routine to trigger .png file download
  const downloadPngResult = () => {
    if (!resultImageUrl) return;
    const link = document.createElement("a");
    link.href = resultImageUrl;
    link.download = `asi-agent-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloading customized high-resolution portrait!", "success");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Input Controllers */}
      <div className="lg:col-span-7 bg-[#09090b]/90 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-bold text-white font-heading tracking-tight uppercase">
              ASI Agent Core Customizer
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className="text-xs text-zinc-400 font-mono tracking-widest">
                Concept 3: Dynamic Generation Lab
              </span>
              {integrationStatus ? (
                integrationStatus.asiOneActive ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[8px] uppercase tracking-wider font-bold">
                    <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Fetch.ai / ASI:One Active</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[8px] uppercase tracking-wider font-bold animate-pulse">
                    <span className="h-1 w-1 rounded-full bg-red-400" />
                    <span>ASI_ONE_API_KEY Missing</span>
                  </span>
                )
              ) : null}
            </div>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed mb-6">
          Instruct the autonomous ASI One agent to design any style, suit, environment, or portrait lighting from scratch, then seamlessly fuse your face structure into the generation!
        </p>

        {/* STEP 1: PORTRAIT PHOTO UPLOADER */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center space-x-1.5">
              <span className="h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[10px] font-mono border border-indigo-500/20">1</span>
              <span>Upload Your Face Portrait</span>
            </label>
            {photoBase64 && (
              <button
                onClick={handleClearSource}
                className="text-[10px] uppercase font-mono text-zinc-500 hover:text-red-400 flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {!photoBase64 ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileBrowser}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
                dragActive
                  ? "border-indigo-500 bg-indigo-500/5"
                  : "border-white/10 hover:border-white/20 bg-black/40 hover:bg-black/60"
              }`}
            >
              <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 mb-3 border border-white/5">
                <Upload className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-zinc-300 mb-1">
                Drag and drop your portrait photo here, or click to browse
              </p>
              <p className="text-[10px] text-zinc-500 font-mono uppercase mt-1">
                Supports JPG, PNG • Max size 10MB
              </p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/50 p-4 flex items-center space-x-4">
              <div className="h-20 w-20 rounded-xl overflow-hidden border border-white/15 bg-zinc-900 shrink-0 shadow-inner">
                <img
                  src={photoBase64}
                  alt="Upload preview"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs font-bold text-white truncate">{photoName}</p>
                <p className="text-[10px] text-indigo-400 font-mono uppercase mt-1 flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Face detected & loaded</span>
                </p>
                <button
                  onClick={triggerFileBrowser}
                  className="mt-2 text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="h-2.5 w-2.5" />
                  <span>Replace Photo</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* STEP 2: AGENT STYLE INSTRUCTION */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center space-x-1.5">
            <span className="h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[10px] font-mono border border-indigo-500/20">2</span>
            <span>Instruct the ASI One Agent</span>
          </label>
          <textarea
            rows={4}
            value={customStyle}
            onChange={(e) => setCustomStyle(e.target.value)}
            placeholder="e.g. As a retro cyber soldier, wearing glowing violet glasses, high tech silver armor plate with wires, inside a dark neon server deck, highly cinematic volumetric fog..."
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-zinc-200 placeholder-zinc-500 font-sans focus:border-indigo-500/50 focus:bg-zinc-950/95 focus:outline-none focus:ring-1 focus:ring-indigo-500/25 resize-none leading-relaxed"
          />

          {/* Preset templates track */}
          <div className="mt-3">
            <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 mb-2">
              Or apply quick style presets:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_IDEAS.map((idea, idx) => (
                <button
                  key={`preset-${idx}`}
                  onClick={() => setCustomStyle(idea.text)}
                  className="rounded-lg bg-white/5 border border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/20 px-2.5 py-1 text-[10px] font-medium text-zinc-400 hover:text-indigo-300 transition-all cursor-pointer"
                >
                  {idea.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 3: ACTION BUTTON */}
        {!user ? (
          <button
            onClick={() => onOpenAuth("Sign in to utilize the ASI One custom agent service.")}
            className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 text-zinc-300 hover:text-white py-3.5 text-xs font-bold font-heading tracking-wider uppercase transition-all cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
            <span>Login to Unlock Agent Fusing</span>
          </button>
        ) : (
          <button
            onClick={handleAgentCustomize}
            disabled={isProcessing}
            className={`w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white py-3.5 text-xs font-bold font-heading tracking-wider uppercase shadow-xl transition-all cursor-pointer ${
              isProcessing ? "opacity-50 cursor-not-allowed" : "shadow-indigo-500/25 hover:shadow-indigo-500/45"
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>Agent is Synergizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-indigo-200" />
                <span>Fuse Portrait with ASI Agent</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* RIGHT COLUMN: Output Preview & Download (Top-up Card) */}
      <div className="lg:col-span-5 bg-gradient-to-b from-[#0e0e13]/80 to-[#050508]/80 border border-white/10 rounded-[32px] p-6 shadow-2xl relative min-h-[460px] flex flex-col justify-between overflow-hidden">
        {/* Abstract design element background */}
        <div className="absolute inset-x-0 top-0 h-40 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5 relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">
              Synthesis Output
            </h3>
            <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/10 text-indigo-400 font-mono text-[8px] uppercase tracking-wider font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span>Portrait Engine</span>
            </span>
          </div>

          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-black/40 border border-white/5 shadow-2xl flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="processing-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10 bg-black/80 backdrop-blur-sm"
                >
                  {/* Glowing spinner background */}
                  <div className="relative mb-6">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 blur-md animate-spin duration-3000" />
                    <div className="relative h-16 w-16 rounded-full bg-zinc-950 flex items-center justify-center border border-white/10">
                      <Cpu className="h-6 w-6 text-indigo-400 animate-pulse" />
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white font-heading uppercase tracking-wide">
                    Synergizing Features...
                  </h4>
                  <p className="text-[10px] text-zinc-400 max-w-xs mt-2 leading-relaxed">
                    ASI Agent is analyzing your face vectors, structuring clothes, formulating studio lighting, and painting the customized background canvas.
                  </p>
                  
                  {/* Dynamic Progress indicator */}
                  <div className="w-40 bg-white/5 h-1 rounded-full overflow-hidden mt-4">
                    <div className="bg-indigo-500 h-full w-2/3 animate-pulse rounded-full" />
                  </div>
                </motion.div>
              ) : resultImageUrl ? (
                <motion.div
                  key="result-state"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <img
                    src={resultImageUrl}
                    alt="Synthesized custom portrait"
                    className="h-full w-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle top overlay shadow for high-class contrast */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold">
                      Fully Synergized
                    </p>
                    <p className="text-xs font-semibold text-white truncate max-w-full">
                      {customStyle}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 mb-4">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                    Awaiting Portrait Synthesis
                  </h4>
                  <p className="text-[10px] text-zinc-500 max-w-xs mt-1.5 leading-relaxed">
                    Upload your face on the left, describe your dream cinematic portrait style, and click Fuse to generate.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic downloadable bar triggers */}
        <div className="mt-4 pt-4 border-t border-white/5 relative z-10 flex flex-col space-y-2">
          {resultImageUrl ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadPngResult}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-3 text-xs font-bold font-heading tracking-wide uppercase shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download portrait (.png)</span>
            </motion.button>
          ) : (
            <div className="w-full py-3 text-center text-[10px] font-mono text-zinc-500 border border-dashed border-white/5 rounded-xl bg-black/10">
              Output download will unlock after synthesis complete
            </div>
          )}
          <p className="text-[8px] text-center text-zinc-500 uppercase tracking-widest font-mono">
            Powered by ASI One autonomous rendering agents
          </p>
        </div>
      </div>
    </div>
  );
}
