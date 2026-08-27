"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { LoadingScreen } from "@/components/auth/LoadingScreen";
import { MotionButton } from "@/components/ui/MotionButton";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, user, error, refreshAuth } = useAuth();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (status === "unauthenticated") {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      timeoutId = setTimeout(() => {
        router.replace(`${routes.signIn}${next}`);
      }, 50);
    } else if (status === "authenticated" && user && !user.onboardingCompleted) {
      timeoutId = setTimeout(() => {
        router.replace(routes.onboarding);
      }, 50);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [status, user, pathname, router]);

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (status === "error") {
    return (
      <main className="motion-page grid min-h-screen place-items-center px-5">
        <section className="glass max-w-md rounded-[34px] p-8 text-center">
          <p className="eyebrow">Connection issue</p>
          <h1 className="display-font mt-3 text-2xl font-black">Session check failed</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {error?.message ?? "The authentication service could not be reached."}
          </p>
          <MotionButton className="mt-6" onClick={() => void refreshAuth()}>
            Try again
          </MotionButton>
        </section>
      </main>
    );
  }

  if (status !== "authenticated" || !user?.onboardingCompleted) {
    return <LoadingScreen message="Redirecting…" />;
  }

  return children;
}
