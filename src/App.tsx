import React, { useState, useEffect, useMemo } from "react";
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { AnimatePresence, motion } from "motion/react";
import { 
  Sparkles, 
  Search, 
  Grid, 
  Layers, 
  Smile, 
  Flame, 
  Clock, 
  Cpu, 
  Compass, 
  Bookmark,
  Check,
  Zap,
  CheckCircle,
  FolderLock
} from "lucide-react";

import Navbar from "./components/Navbar";
import ImageCard from "./components/ImageCard";
import DetailModal from "./components/DetailModal";
import AuthModal from "./components/AuthModal";
import AddCustomPromptModal from "./components/AddCustomPromptModal";
import AgentLab from "./components/AgentLab";

import { auth, db, handleFirestoreError, OperationType } from "./firebase";
import { MOCK_GALLERY_ITEMS, GALLERY_CATEGORIES, shuffleGalleryItems } from "./data";
import { GalleryItem } from "./types";

interface ToastState {
  message: string;
  type: "success" | "info" | "error";
  id: number;
}

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  
  // Random page load shuffler algorithm & Infinite scroll loading limit states
  const [shuffledItems] = useState<GalleryItem[]>(() => shuffleGalleryItems(MOCK_GALLERY_ITEMS));
  const [visibleLimit, setVisibleLimit] = useState(30);
  
  // Modals state triggers
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authGatingMessage, setAuthGatingMessage] = useState<string>("");
  const [addPromptOpen, setAddPromptOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [onlyShowBookmarked, setOnlyShowBookmarked] = useState(false);
  const [activeView, setActiveView] = useState<"gallery" | "agent-lab">("gallery");
  
  // Firestore integrated collections state
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [customPrompts, setCustomPrompts] = useState<GalleryItem[]>([]);
  
  // Custom Toast notifications state
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Trigger dynamic custom toast notification
  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // 1. Listen for user authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
      if (firebaseUser) {
        showToast(`Welcome back, ${firebaseUser.email?.split("@")[0]}!`, "success");
      }
    });
    return unsubscribe;
  }, []);

  // 2. Real-time synchronizing of Bookmarks from Firestore the safe way
  useEffect(() => {
    if (!user) {
      setBookmarks({});
      return;
    }
    const path = `users/${user.uid}/bookmarks`;
    const unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        const bMap: Record<string, boolean> = {};
        snapshot.forEach((snapDoc) => {
          const data = snapDoc.data();
          if (data && data.promptId) {
            bMap[data.promptId] = true;
          }
        });
        setBookmarks(bMap);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  }, [user]);

  // 3. Real-time user custom prompts loader from Firestore the safe way
  useEffect(() => {
    if (!user) {
      setCustomPrompts([]);
      return;
    }
    const path = `users/${user.uid}/custom_prompts`;
    const unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items: GalleryItem[] = [];
        snapshot.forEach((snapDoc) => {
          const data = snapDoc.data();
          items.push({
            id: snapDoc.id,
            title: data.title,
            imageUrl: data.imageUrl,
            generationPrompt: data.generationPrompt,
            category: data.category || "Cyberpunk",
            aspectRatio: "portrait", // Uniform portrait for user creations
            tags: data.tags || [],
            author: "User",
            isCustom: true,
          });
        });
        setCustomPrompts(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  }, [user]);

  // Combined master collection of hardcoded + community custom prompts
  const combinedGalleryItems = useMemo(() => {
    return [...customPrompts, ...shuffledItems];
  }, [customPrompts, shuffledItems]);

  // 4. Searching & Filtering logic
  const filteredGalleryItems = useMemo(() => {
    return combinedGalleryItems.filter((item) => {
      // Category check
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

      // Filter query check
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.generationPrompt.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query));

      // Bookmark only filter
      const matchesBookmark = !onlyShowBookmarked || bookmarks[item.id];

      return matchesCategory && matchesQuery && matchesBookmark;
    });
  }, [combinedGalleryItems, activeCategory, searchQuery, onlyShowBookmarked, bookmarks]);

  // Limit images displayed to 30 at a time (and increment as they scroll)
  const visibleGalleryItems = useMemo(() => {
    return filteredGalleryItems.slice(0, visibleLimit);
  }, [filteredGalleryItems, visibleLimit]);

  // 4.5. Infinite Scroll auto-triggered loading scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 350
      ) {
        // Load up to 30 more items as they get down
        setVisibleLimit((prev) => Math.min(prev + 30, filteredGalleryItems.length));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredGalleryItems.length]);

  // 5. User Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      showToast("Signed out successfully.", "info");
    } catch (err: any) {
      showToast("Sign out failed: " + err.message, "error");
    }
  };

  // 6. Grid item card clicks - GATING LOGIC
  const handleSelectItem = (item: GalleryItem) => {
    if (!user) {
      setAuthGatingMessage("Login is required to use the Portrait Face-Swap editor and download your creations.");
      setAuthModalOpen(true);
      showToast("Login required for face swap.", "info");
    } else {
      setSelectedItem(item);
    }
  };

  // 7. Interactive Toggle Bookmarks
  const handleToggleBookmark = async (e: React.MouseEvent | null, item: GalleryItem) => {
    if (e) e.stopPropagation(); // Avoid activating target modal open
    
    if (!user) {
      setAuthGatingMessage("Access credentials are required to save presets in your personal collection.");
      setAuthModalOpen(true);
      return;
    }

    const isBookmarked = bookmarks[item.id];
    const path = `users/${user.uid}/bookmarks`;
    const docId = item.id;

    try {
      if (isBookmarked) {
        await deleteDoc(doc(db, path, docId));
        showToast("Removed from bookmarks.", "info");
      } else {
        // Strict timestamp constraint - uses serverTimestamp as required by security rules
        await setDoc(doc(db, path, docId), {
          userId: user.uid,
          promptId: item.id,
          createdAt: serverTimestamp(),
        });
        showToast("Saved into personal collection!", "success");
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast("Storage error: " + err.message, "error");
      }
    }
  };

  // 8. Custom Action Prompt saved to state + Firestore
  const handleSaveCustomPrompt = async (promptData: {
    title: string;
    category: string;
    generationPrompt: string;
    imageUrl: string;
    tags: string[];
  }) => {
    if (!user) return;

    const customId = `custom_${Date.now()}`;
    const path = `users/${user.uid}/custom_prompts`;

    try {
      // Create user dynamic custom prompt with strict temporal validation
      await setDoc(doc(db, path, customId), {
        userId: user.uid,
        title: promptData.title,
        category: promptData.category,
        imageUrl: promptData.imageUrl,
        generationPrompt: promptData.generationPrompt,
        tags: promptData.tags,
        createdAt: serverTimestamp(),
      });
      showToast("Dynamic custom recipe published!", "success");
    } catch (err) {
      if (err instanceof Error) {
        showToast("Failed to save recipe: " + err.message, "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white pb-12">
      
      {/* Absolute Dynamic Slide-in Toast Banner Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className={`flex items-center space-x-2.5 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md pointer-events-auto ${
                toast.type === "success"
                  ? "bg-indigo-950/80 border-indigo-500/25 text-indigo-300"
                  : toast.type === "error"
                  ? "bg-red-950/80 border-red-500/25 text-red-300"
                  : "bg-zinc-950/80 border-white/10 text-zinc-300"
              }`}
            >
              {toast.type === "success" && <CheckCircle className="h-4 w-4 text-indigo-400" />}
              {toast.type === "error" && <Zap className="h-4 w-4 text-red-400" />}
              {toast.type === "info" && <Sparkles className="h-4 w-4 text-indigo-400" />}
              <span className="text-xs font-semibold font-sans">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main navigation controller */}
      <Navbar
        user={user}
        onOpenAuth={() => {
          setAuthGatingMessage("");
          setAuthModalOpen(true);
        }}
        onLogout={handleSignOut}
        onOpenAddPrompt={() => setAddPromptOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={GALLERY_CATEGORIES}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Interactive Main Sections */}
      <main id="main-content" className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-8 pt-8">
        
        {activeView === "agent-lab" ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="py-4"
          >
            <AgentLab 
              user={user} 
              onOpenAuth={(msg) => {
                setAuthGatingMessage(msg);
                setAuthModalOpen(true);
              }}
              showToast={showToast}
            />
          </motion.div>
        ) : (
          <>
            {/* Dynamic Hero banner styled in high-contrast cinematic negative space */}
            <section id="hero-banner" className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#09090b]/80 backdrop-blur-3xl p-8 sm:p-12 md:p-16 mb-12 text-center shadow-2xl">
              <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-2xl mx-auto"
              >
                {/* Visual badge alert */}
                <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[9px] uppercase tracking-widest mb-6 font-semibold">
                  <Zap className="h-2.5 w-2.5 text-indigo-400" />
                  <span>Face Swapping Unleashed</span>
                </div>

                <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.12]">
                  Stunning Portraits.<br />
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
                    Synthesized Instantly.
                  </span>
                </h1>

                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-lg mx-auto font-medium">
                  Explore professional cinematic templates, bookmark your favorites, and instantly fuse them with your portrait photo using our high-fidelity face-swap generator.
                </p>

                {/* Launch customizer action trigger button */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveView("agent-lab")}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-indigo-500/20 hover:from-indigo-400 hover:to-purple-400 flex items-center justify-center space-x-2.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-white animate-pulse" />
                    <span>Customize with ASI Agent</span>
                  </motion.button>
                  <a
                    href="#filter-controls"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center space-x-2 transition-all"
                  >
                    <span>Browse Gallery Templates</span>
                  </a>
                </div>

                {/* Quick dashboard statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
                  <div className="flex flex-col items-center justify-center p-2.5">
                    <span className="text-lg font-extrabold text-white font-heading">{MOCK_GALLERY_ITEMS.length}</span>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 mt-1">Ref Presets</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2.5 border-l border-white/5">
                    <span className="text-lg font-extrabold text-white font-heading">{customPrompts.length}</span>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 mt-1">My Recipes</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2.5 border-l border-white/5">
                    <span className="text-lg font-extrabold text-white font-heading">
                      {Object.keys(bookmarks).length}
                    </span>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 mt-1">Bookmarks</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2.5 border-l border-white/5">
                    <span className="text-indigo-400 font-mono text-[10px] font-bold shrink-0">ONLINE</span>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 mt-1">Sync state</span>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Categories selector track & Filter tabs bar */}
            <section id="filter-controls" className="mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 items-start sm:items-center justify-between border-b border-white/5 pb-5">
              
              {/* Categories */}
              <div className="flex flex-wrap gap-1.5 max-w-full overflow-x-auto select-scrollbar py-1">
                {GALLERY_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold tracking-wide transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-500/20"
                        : "bg-white/5 border border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Bookmarks toggle filter and count details */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setOnlyShowBookmarked(!onlyShowBookmarked)}
                  className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-bold tracking-wide border transition-all cursor-pointer ${
                    onlyShowBookmarked
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Show Bookmarked ({Object.keys(bookmarks).length})</span>
                </button>
              </div>

            </section>

            {/* Gallery Grid display containing cards */}
            <section id="gallery-display-grid">
              {filteredGalleryItems.length === 0 ? (
                <div className="py-24 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 mb-4 border border-white/10">
                    <FolderLock className="h-6 w-6 text-zinc-500" />
                  </div>
                  <h2 className="text-lg font-bold text-zinc-300 font-heading uppercase">No Prompt Found</h2>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-1 leading-relaxed">
                    We couldn't locate any matching layouts in our directory. Make sure to try another filter or publish your own recipe!
                  </p>
                </div>
              ) : (
                // Responsive Multi-layout grid incorporating masonry widths
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {visibleGalleryItems.map((item) => (
                      <ImageCard
                        key={`card-${item.id}`}
                        item={item}
                        isBookmarked={!!bookmarks[item.id]}
                        isLoggedIn={!!user}
                        onSelect={() => handleSelectItem(item)}
                        onBookmark={(e) => handleToggleBookmark(e, item)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </section>
          </>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-white/5 pt-8 text-center text-[10px] text-zinc-500 font-mono tracking-wider max-w-7xl mx-auto w-full px-4">
        <p>© 2026 Portrait Swap Studio. All rights reserved.</p>
        <p className="mt-1 uppercase text-[8px] tracking-[0.2em] text-zinc-600">Secure cloud processing with verified credentials.</p>
      </footer>

      {/* Modal Dialog System */}
      <AnimatePresence>
        {/* authModalOpen */}
        {authModalOpen && (
          <AuthModal
            key="auth-modal"
            message={authGatingMessage}
            onClose={() => setAuthModalOpen(false)}
          />
        )}

        {/* selectedItem detail view modal */}
        {selectedItem && (
          <DetailModal
            key={`detail-${selectedItem.id}`}
            item={selectedItem}
            isBookmarked={!!bookmarks[selectedItem.id]}
            onToggleBookmark={() => handleToggleBookmark(null, selectedItem)}
            onClose={() => setSelectedItem(null)}
          />
        )}

        {/* Add custom prompt creation modal */}
        {addPromptOpen && (
          <AddCustomPromptModal
            key="add-prompt-modal"
            onClose={() => setAddPromptOpen(false)}
            onSave={handleSaveCustomPrompt}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
