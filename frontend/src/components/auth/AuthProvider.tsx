"use client";

import type { AuthErrorCode } from "@mynsut/shared/constants/auth";
import type { AuthenticatedUser } from "@mynsut/shared/types/auth";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  logoutCurrentSession,
  logoutEverySession,
} from "@/lib/api/auth";
import { ApiClientError } from "@/lib/api/client";
import type {
  AuthContextValue,
  FrontendAuthStatus,
} from "@/lib/auth/auth.types";

export const AuthContext = createContext<AuthContextValue | null>(null);

function getErrorCode(error: ApiClientError): AuthErrorCode {
  const body = error.details;

  if (body && typeof body === "object" && "error" in body) {
    const apiError = body.error;
    if (apiError && typeof apiError === "object" && "code" in apiError) {
      const code = apiError.code;
      if (typeof code === "string") {
        return code as AuthErrorCode;
      }
    }
  }

  return "GOOGLE_AUTHENTICATION_FAILED";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<FrontendAuthStatus>("loading");
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [error, setError] = useState<AuthContextValue["error"]>(null);

  const refreshAuth = useCallback(async (): Promise<AuthenticatedUser | null> => {
    setStatus("loading");
    setError(null);

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setStatus("authenticated");
      return currentUser;
    } catch (caught: unknown) {
      if (caught instanceof ApiClientError && caught.status === 401) {
        setUser(null);
        setStatus("unauthenticated");
        return null;
      }

      const message = caught instanceof Error ? caught.message : "Unable to verify your session.";
      const code = caught instanceof ApiClientError
        ? getErrorCode(caught)
        : "GOOGLE_AUTHENTICATION_FAILED";

      setUser(null);
      setStatus("error");
      setError({ code, message });
      return null;
    }
  }, []);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    await logoutCurrentSession();
    setUser(null);
    setError(null);
    setStatus("unauthenticated");
  }, []);

  const logoutAllDevices = useCallback(async () => {
    await logoutEverySession();
    setUser(null);
    setError(null);
    setStatus("unauthenticated");
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      error,
      isLoading: status === "loading",
      isAuthenticated: status === "authenticated" && user !== null,
      requiresOnboarding:
        status === "authenticated" && user !== null && !user.onboardingCompleted,
      refreshAuth,
      logout,
      logoutAllDevices,
      clearError,
    }),
    [status, user, error, refreshAuth, logout, logoutAllDevices, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
