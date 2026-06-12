import { useState } from "react";
import { User, LogOut, Key, Plus, Sparkles, Sliders, Grid } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User as FirebaseUser } from "firebase/auth";

interface NavbarProps {
  user: FirebaseUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAddPrompt: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  categories: string[];
  activeView: "gallery" | "agent-lab";
  setActiveView: (view: "gallery" | "agent-lab") => void;
}

export default function Navbar({
  user,
  onOpenAuth,
  onLogout,
  onOpenAddPrompt,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  categories,
  activeView,
  setActiveView,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header id="app-header" className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-8">
        
        {/* Brand Logo - Immersive UI Style */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3.5 shrink-0"
          onClick={() => setActiveView("gallery")}
          style={{ cursor: "pointer" }}
        >
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-heading font-black italic text-sm tracking-tighter">PS</span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-heading text-lg font-bold tracking-tight text-white uppercase leading-5">
              PORTRAIT <span className="text-indigo-400 font-extrabold">SWAP</span>
            </h1>
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
              Face Swap Studio
            </span>
          </div>
        </motion.div>

        {/* Navigation Switch - Segmented Switch tab container */}
        <div className="hidden border border-white/10 bg-white/5 rounded-full p-1 sm:flex space-x-1 shrink-0 mx-4">
          <button
            onClick={() => setActiveView("gallery")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeView === "gallery"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>Style Gallery</span>
          </button>
          <button
            onClick={() => setActiveView("agent-lab")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeView === "agent-lab"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>ASI Agent Lab</span>
          </button>
        </div>

        {/* Central Search Query Input */}
        <div className="hidden max-w-md flex-1 px-4 md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search cinematic styles, characters, themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-2 pl-5 pr-10 text-sm text-zinc-300 placeholder-zinc-500 transition-all focus:border-indigo-500/50 focus:bg-zinc-950/95 focus:outline-none focus:ring-1 focus:ring-indigo-500/25"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 hover:text-white"
              >
                esc
              </button>
            )}
          </div>
        </div>

        {/* Auth / Controls Bar */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Add Custom Prompt Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenAddPrompt}
                className="flex items-center space-x-1.5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-purple-400 transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline font-heading">Add Custom</span>
              </motion.button>

              {/* User Dropdown */}
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 p-1.5 pr-3.5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-xs font-bold text-white shadow-inner">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="avatar"
                        referrerPolicy="no-referrer"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      user.email?.[0].toUpperCase() || "U"
                    )}
                  </div>
                  <span className="hidden max-w-[100px] truncate text-xs font-semibold text-zinc-300 sm:inline-block">
                    {user.email?.split("@")[0]}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      {/* Overlay to close */}
                      <div
                        onClick={() => setDropdownOpen(false)}
                        className="fixed inset-0 z-30"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 z-40 w-56 origin-top-right rounded-xl border border-white/10 bg-[#09090b]/95 backdrop-blur-xl p-1.5 shadow-2xl"
                      >
                        <div className="px-3 py-2 border-b border-white/5">
                          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">
                            Signed in as
                          </p>
                          <p className="truncate text-xs font-semibold text-zinc-300">
                            {user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              onLogout();
                              setDropdownOpen(false);
                            }}
                            className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenAuth}
              className="flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold text-zinc-300 hover:border-indigo-500/50 hover:bg-white/10 hover:text-white transition-all cursor-pointer font-heading"
            >
              <Key className="h-3.5 w-3.5 text-indigo-400" />
              <span>Sign In / Unlock</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Mobile Search/Filter Row */}
      <div className="mx-auto flex max-w-7xl flex-col px-4 pb-3 md:hidden space-y-2">
        <div className="grid grid-cols-2 gap-2 sm:hidden">
          <button
            onClick={() => setActiveView("gallery")}
            className={`py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
              activeView === "gallery"
                ? "bg-indigo-600 border border-indigo-600 text-white"
                : "bg-white/5 border border-white/5 text-zinc-400"
            }`}
          >
            <Grid className="h-3 w-3" />
            <span>Style Gallery</span>
          </button>
          <button
            onClick={() => setActiveView("agent-lab")}
            className={`py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
              activeView === "agent-lab"
                ? "bg-indigo-600 border border-indigo-600 text-white"
                : "bg-white/5 border border-white/5 text-zinc-400"
            }`}
          >
            <Sparkles className="h-3 w-3 text-indigo-300" />
            <span>ASI Agent Lab</span>
          </button>
        </div>
        <div className="relative mt-1">
          <input
            type="text"
            placeholder="Search styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 pl-4 text-xs text-zinc-300 placeholder-zinc-500 focus:border-indigo-500/50 focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
}
