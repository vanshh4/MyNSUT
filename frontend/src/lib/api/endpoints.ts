export const apiEndpoints = {
  health: "/health",
  auth: { google: "/auth/google", me: "/auth/me", logout: "/auth/logout" },
  onboarding: "/students/onboarding",
  dashboard: "/dashboard",
  profile: { me: "/students/me" },
  notices: "/notices",
  societies: "/societies",
  events: "/events",
  admin: "/admin",
} as const;
