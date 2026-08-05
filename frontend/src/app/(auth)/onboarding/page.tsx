"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GraduationCap } from "lucide-react";

import { LoadingScreen } from "@/components/auth/LoadingScreen";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";

export default function OnboardingPage() {
  const router = useRouter();
  const { status, user } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") router.replace(routes.signIn);
    if (status === "authenticated" && user?.onboardingCompleted) router.replace(routes.dashboard);
  }, [status, user, router]);

  if (status === "loading" || status === "unauthenticated" || user?.onboardingCompleted) {
    return <LoadingScreen message="Preparing onboarding…" />;
  }

  return (
    <main className="flex-grow flex items-center justify-center min-h-screen relative z-10 px-5 md:px-[64px] py-12 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-background to-surface-container-high dark:from-background dark:to-surface/10 pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        className="w-full max-w-xl mx-auto"
      >
        <GlassCard className="w-full p-8 md:p-10 flex flex-col shadow-sm" hoverEffect={false}>
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 shadow-md mx-auto">
            <GraduationCap className="w-8 h-8 text-on-primary" />
          </div>
          
          <h1 className="font-headline text-3xl md:text-4xl font-semibold text-primary text-center mb-2">Make MyNSUT yours.</h1>
          <p className="font-body text-sm text-text-muted text-center mb-8">
            Enter your UMS roll number and choose your section. Your admission year, branch and
            graduation year will be derived automatically.
          </p>

          <OnboardingForm />
        </GlassCard>
      </motion.div>
    </main>
  );
}
