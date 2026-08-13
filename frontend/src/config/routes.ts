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
  adminUsers: "/admin/users",
  adminUserDetail: "/admin/users/[userId]",
  adminRoles: "/admin/roles",
  adminAuditLogs: "/admin/audit-logs",
  class: "/class",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
