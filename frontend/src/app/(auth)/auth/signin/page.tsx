"use client";

import { motion } from "framer-motion";
import { GraduationCap, ShieldCheck, UserCircle, Lock, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";

import { GuestGuard } from "@/components/auth/GuestGuard";
import { GlassCard } from "@/components/ui/GlassCard";
import { beginGoogleSignIn } from "@/lib/api/auth";

const GoogleIcon = () => (
  <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.71 17.58V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"></path>
    <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.58C14.72 18.24 13.48 18.64 12 18.64C9.14 18.64 6.72 16.71 5.86 14.13H2.18V16.98C3.99 20.58 7.7 23 12 23Z" fill="#34A853"></path>
    <path d="M5.86 14.13C5.64 13.47 5.51 12.75 5.51 12C5.51 11.25 5.64 10.53 5.86 9.87V7.02H2.18C1.43 8.52 1 10.21 1 12C1 13.79 1.43 15.48 2.18 16.98L5.86 14.13Z" fill="#FBBC05"></path>
    <path d="M12 5.36C13.62 5.36 15.06 5.92 16.2 7.01L19.36 3.85C17.46 2.07 14.97 1 12 1C7.7 1 3.99 3.42 2.18 7.02L5.86 9.87C6.72 7.29 9.14 5.36 12 5.36Z" fill="#EA4335"></path>
  </svg>
);

function SignInContent() {
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const nextPath = searchParams.get("next");

  function handleSignIn() {
    setIsRedirecting(true);
    if (nextPath?.startsWith("/")) sessionStorage.setItem("mynsut_post_login_path", nextPath);
    beginGoogleSignIn();
  }

  return (
    <GuestGuard>
      <main className="flex-grow flex items-center justify-center min-h-screen relative z-10 px-5 md:px-[64px] py-12 overflow-hidden bg-background">
        
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background to-surface-container-high dark:from-background dark:to-surface/10 pointer-events-none -z-10" />

        {/* Sign In Card */}
        <motion.div
          className="w-full max-w-xl"
        >
          <GlassCard className="w-full p-8 md:p-10 flex flex-col items-center shadow-sm" hoverEffect={false}>
            
            {/* Header */}
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 shadow-md">
              <GraduationCap className="w-8 h-8 text-on-primary" />
            </div>
            <h1 className="font-headline text-4xl font-semibold text-primary text-center mb-2">Welcome to MyNSUT</h1>
            <p className="font-body text-lg text-text-muted text-center mb-8">Sign in to continue to your account</p>
            
            {/* Action */}
            <button 
              onClick={handleSignIn}
              disabled={isRedirecting}
              className="w-full bg-surface border border-glass-border rounded-full py-3 px-6 flex items-center justify-center gap-3 hover:bg-glass-surface dark:hover:bg-white/10 transition-colors duration-300 active:scale-95 mb-8 shadow-sm disabled:opacity-50"
            >
              {isRedirecting ? (
                <LoaderCircle className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              <span className="font-label text-sm font-semibold text-text-main">
                {isRedirecting ? "Signing in..." : "Sign in with Google"}
              </span>
            </button>
            
            {/* Divider */}
            <div className="w-full flex items-center gap-4 mb-8">
              <div className="flex-grow h-px bg-outline/30"></div>
              <span className="font-label text-[10px] text-text-muted uppercase tracking-wider font-semibold">Why Google?</span>
              <div className="flex-grow h-px bg-outline/30"></div>
            </div>
            
            {/* Info Section */}
            <div className="w-full flex flex-col gap-4 mb-8">
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }} 
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl border border-glass-border bg-primary/5 dark:bg-white/5 flex items-center gap-4 shadow-sm cursor-default"
              >
                <ShieldCheck className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-label text-sm font-bold text-text-main mb-1">Secure & Verified</h3>
                  <p className="font-body text-xs text-text-muted">Only @nsut.ac.in email IDs are allowed.</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }} 
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl border border-glass-border bg-primary/5 dark:bg-white/5 flex items-center gap-4 shadow-sm cursor-default"
              >
                <UserCircle className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-label text-sm font-bold text-text-main mb-1">One Account</h3>
                  <p className="font-body text-xs text-text-muted">Use your NSUT Google account to access MyNSUT.</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }} 
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl border border-glass-border bg-primary/5 dark:bg-white/5 flex items-center gap-4 shadow-sm cursor-default"
              >
                <Lock className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-label text-sm font-bold text-text-main mb-1">Privacy First</h3>
                  <p className="font-body text-xs text-text-muted">Your data is safe and never shared.</p>
                </div>
              </motion.div>
            </div>
            
            {/* Legal */}
            <p className="font-label text-[10px] text-text-muted text-center font-medium">
              By signing in, you agree to our{" "}
              <Link className="text-primary hover:underline" href="#">Terms of Service</Link> and{" "}
              <Link className="text-primary hover:underline" href="#">Privacy Policy</Link>.
            </p>
          </GlassCard>
        </motion.div>
      </main>
    </GuestGuard>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-background">
          <p className="font-label text-sm text-text-muted">Loading sign-in…</p>
        </main>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
