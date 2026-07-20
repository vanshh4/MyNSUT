export const routes = {
  home: "/",
  signIn: "/auth/signin",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  profile: "/profile/me",
  notices: "/notices",
  societies: "/societies",
  events: "/events",
  admin: "/admin",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
