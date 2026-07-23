import type { AuthErrorDescriptor, AuthenticatedUser } from "@mynsut/shared/types/auth";

export type FrontendAuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";

export interface AuthContextValue {
  status: FrontendAuthStatus;
  user: AuthenticatedUser | null;
  error: AuthErrorDescriptor | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  requiresOnboarding: boolean;
  refreshAuth: () => Promise<AuthenticatedUser | null>;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<void>;
  clearError: () => void;
}
