export const routes = {
  home: "/",
  signIn: "/auth/signin",
  authCallback: "/auth/callback",
  authError: "/auth/error",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  profile: "/profile/me",
  search: "/search",
  notices: "/notices",
  societies: "/societies",
  events: "/events",
  admin: "/admin",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
