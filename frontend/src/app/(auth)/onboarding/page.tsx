"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppLogo } from "@/components/common/AppLogo";
import { LoadingScreen } from "@/components/auth/LoadingScreen";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
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
    <main className="motion-page min-h-screen px-5 py-7">
      <div className="mx-auto max-w-xl">
        <AppLogo />
        <motion.section initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 140, damping: 18 }} className="glass mt-12 rounded-[36px] p-7 sm:p-9">
          <p className="eyebrow">Getting started</p>
          <h1 className="page-title mt-3">Make MyNSUT yours.</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">Enter your UMS roll number and choose your section. Your admission year, branch and graduation year will be derived automatically.</p>
          <OnboardingForm />
        </motion.section>
      </div>
    </main>
  );
}
