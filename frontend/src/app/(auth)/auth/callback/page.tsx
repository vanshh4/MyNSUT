"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { LoadingScreen } from "@/components/auth/LoadingScreen";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    void refreshAuth().then((user) => {
      if (!user) {
        router.replace("/auth/error?code=GOOGLE_AUTHENTICATION_FAILED");
        return;
      }
      router.replace(user.onboardingCompleted ? routes.dashboard : routes.onboarding);
    });
  }, [refreshAuth, router]);

  return <LoadingScreen message="Completing secure sign-in…" />;
}
