import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { Mail, Lock, X, Globe, Sparkles } from "lucide-react";
import { auth } from "../firebase";

interface AuthModalProps {
  onClose: () => void;
  message?: string;
}

export default function AuthModal({ onClose, message }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose(); // Exit on successful authentication
    } catch (err: any) {
      console.error("Auth error:", err);
      // Clean up common firebase errors into readable user feedback
      let friendlyMessage = err.message || "An authentication error occurred.";
      if (err.code === "auth/wrong-password") friendlyMessage = "Invalid credentials. Please attempt again.";
      if (err.code === "auth/user-not-found") friendlyMessage = "No user matches this email.";
      if (err.code === "auth/email-already-in-use") friendlyMessage = "This email is registered with an existing account.";
      if (friendlyMessage.includes("weak-password")) friendlyMessage = "Password is too weak. Must be at least 6 characters.";
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      // Prefer signInWithPopup for stable iframe redirection in AI Studio
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setError(err?.message || "Google Sign-In was cancelled or failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark frosted overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      {/* Main Container with immersive double border styling */}
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-[#09090c]/90 backdrop-blur-3xl p-7 sm:p-8 shadow-2xl shadow-indigo-950/40"
      >
        {/* Glow visual highlights */}
        <div className="absolute -right-20 -top-20 -z-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 -z-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 mb-4 border border-indigo-500/20">
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </div>
          <h2 className="font-heading text-xl font-extrabold tracking-tight text-white uppercase">
            {isSignUp ? "Portal Registry" : "Unlock Portal"}
          </h2>
          <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
            {message || "Authentication is required to reveal the secret face-swapping prompts and creation parameters."}
          </p>
        </div>

        {/* Alert Error Box */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-mono text-zinc-500 mb-1.5 font-semibold">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-zinc-300 placeholder-zinc-500 focus:border-indigo-500/50 focus:bg-zinc-950/95 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-mono text-zinc-500 mb-1.5 font-semibold">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-zinc-300 placeholder-zinc-500 focus:border-indigo-500/50 focus:bg-zinc-950/95 focus:outline-none"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? "Authorizing..." : isSignUp ? "Create Prompt Profile" : "Reveal Prompts"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex py-1 items-center justify-center">
          <div className="flex-grow border-t border-white/5" />
          <span className="mx-3.5 bg-transparent px-2 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
            Or access via
          </span>
          <div className="flex-grow border-t border-white/5" />
        </div>

        {/* Google Authentication Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleGoogleAuth}
          disabled={loading}
          className="flex w-full items-center justify-center space-x-2 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:bg-white/10 hover:text-white cursor-pointer transition-all disabled:opacity-50"
        >
          <Globe className="h-4 w-4 text-indigo-400" />
          <span>Continue with Google</span>
        </motion.button>

        {/* Switch Auth mode footer */}
        <div className="mt-6 text-center text-xs">
          <span className="text-zinc-500 font-medium">
            {isSignUp ? "Already hold an identity? " : "New to the portal? "}
          </span>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-bold text-indigo-400 underline decoration-indigo-500/40 decoration-2 underline-offset-4 hover:text-indigo-300 cursor-pointer"
          >
            {isSignUp ? "Sign In Here" : "Create Account Free"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
