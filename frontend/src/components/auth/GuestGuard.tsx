"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { LoadingScreen } from "@/components/auth/LoadingScreen";
import { MotionButton } from "@/components/ui/MotionButton";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";

export function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status, user, error, refreshAuth } = useAuth();

  useEffect(() => {
    if (status === "authenticated" && user) {
      const timeoutId = setTimeout(() => {
        router.replace(user.onboardingCompleted ? routes.dashboard : routes.onboarding);
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [status, user, router]);

  if (status === "loading") {
    return <LoadingScreen message="Checking your session…" />;
  }

  if (status === "error") {
    return (
      <main className="motion-page grid min-h-screen place-items-center px-5">
        <section className="glass max-w-md rounded-[34px] p-8 text-center">
          <p className="eyebrow">Connection issue</p>
          <h1 className="display-font mt-3 text-2xl font-black">Unable to continue</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {error?.message ?? "The authentication service could not be reached."}
          </p>
          <MotionButton className="mt-6" onClick={() => void refreshAuth()}>
            Retry
          </MotionButton>
        </section>
      </main>
    );
  }

  if (status === "authenticated") {
    return <LoadingScreen message="Redirecting…" />;
  }

  return children;
}
