import React from "react";
import { motion } from "motion/react";
import { Lock, Unlock, Bookmark, Sparkles } from "lucide-react";
import { GalleryItem } from "../types";

interface ImageCardProps {
  item: GalleryItem;
  isBookmarked: boolean;
  isLoggedIn: boolean;
  onSelect: () => void;
  onBookmark: (e: React.MouseEvent) => void;
}

export default function ImageCard({
  item,
  isBookmarked,
  isLoggedIn,
  onSelect,
  onBookmark,
}: ImageCardProps) {
  const aspectClass = "aspect-[3/4]";

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark(e);
  };

  // BEFORE LOGIN: Locked feed cells
  if (!isLoggedIn) {
    return (
      <motion.div
        id={`gallery-card-${item.id}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -8, scale: 1.02 }}
        onClick={onSelect}
        className="group relative overflow-hidden rounded-[32px] border border-white/5 bg-zinc-950 p-[1px] transition-all duration-300 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-[31px] aspect-[3/4]">
          <img
            src={item.imageUrl}
            alt="Cinematic Portrait"
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* subtle mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-[#020205]/20 to-transparent opacity-80" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs">
            <div className="h-10 w-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-white mb-2 shadow-lg">
              <Lock className="h-4 w-4 text-indigo-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Unlock Face-Swap</span>
          </div>

          {/* Locked indicators */}
          <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 text-[9px] font-mono tracking-wider uppercase text-zinc-300 rounded-full flex items-center space-x-1">
            <Lock className="h-2.5 w-2.5 text-indigo-400" />
            <span>Locked</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-[8px] font-mono uppercase tracking-widest text-indigo-450 bg-indigo-950/40 border border-indigo-500/20 px-2 py-0.5 rounded">
              {item.category}
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight mt-1 truncate">
              {item.title}
            </h3>
          </div>
        </div>
      </motion.div>
    );
  }

  // AFTER LOGIN: Full Unlocked dynamic card
  return (
    <motion.div
      id={`gallery-card-${item.id}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      whileHover={{ y: -6 }}
      onClick={onSelect}
      className="group relative flex flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#07070a]/90 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer h-full"
    >
      <div className="relative flex flex-col overflow-hidden rounded-[30px] p-2 h-full">
        
        {/* Main image space */}
        <div className={`relative w-full overflow-hidden rounded-[24px] ${aspectClass}`}>
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-[#020205]/10 to-transparent opacity-90" />

          {/* Top badge components */}
          <div className="absolute left-3 top-3 right-3 flex justify-between items-center z-10">
            <div className="flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md px-2.5 py-1 text-[8px] font-mono uppercase tracking-widest text-emerald-400 rounded-full font-bold">
              <Unlock className="h-2.5 w-2.5" />
              <span>Unlocked</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleBookmarkClick}
              className={`flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all cursor-pointer ${
                isBookmarked
                  ? "bg-indigo-600 border-indigo-500/40 text-white shadow-lg"
                  : "bg-black/40 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4 animate-pulse" />
              )}
            </motion.button>
          </div>

          {/* Category sticker badge */}
          <span className="absolute bottom-3 right-3 rounded bg-black/70 border border-white/10 backdrop-blur-md px-2.5 py-1 text-[8px] font-mono uppercase tracking-widest text-zinc-300">
            {item.category}
          </span>
        </div>

        {/* Info detail block */}
        <div className="flex flex-col p-3.5 flex-grow justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors duration-300 truncate">
                {item.title}
              </h3>
              <span className="font-mono text-[8px] text-zinc-650 shrink-0 ml-1">
                {item.author === "Studio" ? "STUDIO" : "USER"}
              </span>
            </div>

            {/* Tags view bar */}
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="rounded-full bg-white/5 border border-white/5 px-2 py-0.5 text-[8.5px] font-mono text-zinc-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick micro action overlay */}
          <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
            <span className="flex items-center space-x-1 text-indigo-400 font-sans font-bold">
              <Sparkles className="h-3 w-3" />
              <span>Assemble Portrait</span>
            </span>
            <span className="group-hover:text-white transition-colors">
              Inspect →
            </span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// Inline mockup components to avoid TS compile issues on original import states
function BookmarkCheck({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
      <path d="m9 10 2 2 4-4" stroke="black" strokeWidth="2.5" />
    </svg>
  );
}
