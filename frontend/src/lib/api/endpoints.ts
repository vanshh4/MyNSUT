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
  admin: {
    users: { search: "/admin/users", detail: (id: string) => `/admin/users/${id}` },
    roles: {
      list: "/admin/roles",
      userAssignments: (id: string) => `/admin/roles/users/${id}`,
      assign: "/admin/roles/assign",
      revoke: (id: string) => `/admin/roles/revoke/${id}`,
    },
    auditLogs: { list: "/audit-logs", detail: (id: string) => `/audit-logs/${id}` },
  },
} as const;
