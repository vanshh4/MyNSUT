import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

const replace = vi.fn();
const useAuth = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ replace }),
}));
vi.mock("@/hooks/useAuth", () => ({ useAuth }));
vi.mock("@/components/auth/LoadingScreen", () => ({
  LoadingScreen: ({ message }: { message?: string }) => <div>{message ?? "Loading"}</div>,
}));
vi.mock("@/components/ui/MotionButton", () => ({
  MotionButton: ({ children, ...props }: { children: ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));

const { AuthGuard } = await import("./AuthGuard");
const activeUser = {
  id: "user",
  email: "student@nsut.ac.in",
  fullName: "Student",
  profileImageUrl: null,
  status: "ACTIVE",
  onboardingCompleted: true,
  roles: [],
  permissions: [],
  student: null,
};

describe("AuthGuard", () => {
  it("shows a loading state while authentication is resolving", () => {
    useAuth.mockReturnValue({ status: "loading", user: null, error: null, refreshAuth: vi.fn() });
    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("redirects unauthenticated users to sign in", async () => {
    useAuth.mockReturnValue({
      status: "unauthenticated",
      user: null,
      error: null,
      refreshAuth: vi.fn(),
    });
    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/auth/signin?next=%2Fdashboard"));
  });

  it("redirects incomplete users to onboarding", async () => {
    useAuth.mockReturnValue({
      status: "authenticated",
      user: { ...activeUser, onboardingCompleted: false },
      error: null,
      refreshAuth: vi.fn(),
    });
    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/onboarding"));
  });

  it("renders children for an authenticated onboarded user", () => {
    useAuth.mockReturnValue({
      status: "authenticated",
      user: activeUser,
      error: null,
      refreshAuth: vi.fn(),
    });
    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>
    );
    expect(screen.getByText("Protected")).toBeInTheDocument();
  });
});
