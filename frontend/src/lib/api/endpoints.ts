export const apiEndpoints = {
  health: "/health",
  auth: {
    google: "/auth/google",
    me: "/auth/me",
    logout: "/auth/logout",
    logoutAll: "/auth/logout-all",
    refresh: "/auth/session/refresh",
  },
  onboarding: "/students/onboarding",
  dashboard: "/dashboard",
  profile: { me: "/students/me" },
  notices: "/notices",
  societies: "/societies",
  events: "/events",
  admin: "/admin",
} as const;
