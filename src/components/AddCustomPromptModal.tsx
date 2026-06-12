import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Sparkles, Image as ImageIcon, Send } from "lucide-react";

interface AddCustomPromptModalProps {
  onClose: () => void;
  onSave: (prompt: {
    title: string;
    category: string;
    generationPrompt: string;
    imageUrl: string;
    tags: string[];
  }) => Promise<void>;
}

// Beautiful stock visual presets for users who don't have direct hosting URLs on hand
const PRESET_MOCKUP_ASSETS = [
  {
    name: "Cyberpunk Hunter",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Golden Pharaoh",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Cyber-Valkyrie",
    url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Midnight Shinobi",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
  },
];

export default function AddCustomPromptModal({
  onClose,
  onSave,
}: AddCustomPromptModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Cyberpunk");
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(PRESET_MOCKUP_ASSETS[0].url);
  const [customUrlMode, setCustomUrlMode] = useState(false);
  const [customTagsText, setCustomTagsText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Please enter a descriptive title.");
    if (!generationPrompt.trim()) return setError("Please provide the face-swapping generation prompt instructions.");
    if (!imageUrl.trim()) return setError("Please select or input a reference mockup image.");

    setSubmitting(true);
    try {
      const parsedTags = customTagsText
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const resolvedTags = parsedTags.length > 0 ? parsedTags : [category, "Custom"];

      await onSave({
        title: title.trim(),
        category,
        generationPrompt: generationPrompt.trim(),
        imageUrl: imageUrl.trim(),
        tags: resolvedTags,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to persist your custom prompt card.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Frosted dim background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
      />

      {/* Main Container with immersive double border design */}
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg rounded-[32px] border border-white/10 bg-[#09090c]/90 backdrop-blur-3xl p-7 sm:p-8 shadow-2xl z-10"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-white">Save Custom Recipe</h3>
            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">Save a personal face-swapping configuration to the community board.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/15 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title input */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-mono text-zinc-500 mb-1.5 font-semibold">
              Recipe Name / Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Glowing cyber-ninja commander"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs text-zinc-300 placeholder-zinc-500 focus:border-indigo-500/50 focus:bg-zinc-950/95 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category Select */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-mono text-zinc-500 mb-1.5 font-semibold">
                Creative Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900 py-2.5 px-3 text-xs text-zinc-300 focus:border-indigo-500/50 focus:outline-none"
              >
                <option value="Cyberpunk">Cyberpunk</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Anime">Anime</option>
                <option value="Classic Art">Classic Art</option>
                <option value="Cinematic">Cinematic</option>
              </select>
            </div>

            {/* Tags input */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-mono text-zinc-500 mb-1.5 font-semibold">
                Custom Tags (comma separated)
              </label>
              <input
                type="text"
                value={customTagsText}
                onChange={(e) => setCustomTagsText(e.target.value)}
                placeholder="rebel, dark, glowing"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs text-zinc-300 placeholder-zinc-500 focus:border-indigo-500/50 focus:bg-zinc-950/95 focus:outline-none"
              />
            </div>
          </div>

          {/* Reference Image selection */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-[10px] uppercase tracking-wider font-mono text-zinc-500 font-semibold">
                Reference Base Image
              </label>
              <button
                type="button"
                onClick={() => setCustomUrlMode(!customUrlMode)}
                className="text-[10px] font-mono text-indigo-400 hover:underline cursor-pointer font-bold"
              >
                {customUrlMode ? "Use presets templates" : "Supply custom URL link"}
              </button>
            </div>

            {customUrlMode ? (
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/your-hosted-image-link..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-zinc-300 placeholder-zinc-500 focus:border-indigo-500/50 focus:bg-zinc-950/95 focus:outline-none"
                />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {PRESET_MOCKUP_ASSETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`relative aspect-[3/4] overflow-hidden rounded-xl border transition-all cursor-pointer ${
                      imageUrl === preset.url
                        ? "border-indigo-500 ring-4 ring-indigo-500/25"
                        : "border-white/10 grayscale opacity-60 hover:opacity-100 hover:grayscale-0"
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-end p-1.5">
                      <span className="text-[7.5px] text-zinc-300 font-mono font-bold truncate block w-full">
                        {preset.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Prompt Input text box */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-mono text-zinc-500 mb-1.5 font-semibold">
              The Secret Generation Prompt
            </label>
            <textarea
              required
              rows={4}
              value={generationPrompt}
              onChange={(e) => setGenerationPrompt(e.target.value)}
              placeholder="e.g. Ultra high resolution portrait of [YOUR FACE] featuring metallic armor shards, cosmic particles, soft focus..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs text-zinc-300 leading-relaxed placeholder-zinc-500 focus:border-indigo-500/50 focus:bg-zinc-950/95 focus:outline-none font-sans"
            />
            <span className="text-[9px] text-zinc-500 font-mono mt-1.5 block leading-normal">
              💡 Ensure to write <code className="bg-black/40 border border-white/5 px-1 py-0.5 rounded text-indigo-400 font-bold">[YOUR FACE]</code> in the prompt where the face-swap should trigger!
            </span>
          </div>

          {/* Controls Footer */}
          <div className="flex space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 font-bold uppercase tracking-widest text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 py-3 font-bold uppercase tracking-widest text-xs text-white shadow-lg cursor-pointer disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitting ? "Saving..." : "Publish"}</span>
            </motion.button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
