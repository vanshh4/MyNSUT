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
  notices: {
    list: "/notices",
    detail: (id: string) => `/notices/${id}`,
    create: "/notices",
    update: (id: string) => `/notices/${id}`,
    delete: (id: string) => `/notices/${id}`,
  },
  societies: {
    list: "/societies",
    detail: (id: string) => `/societies/${id}`,
    create: "/societies",
    update: (id: string) => `/societies/${id}`,
    delete: (id: string) => `/societies/${id}`,
    members: (id: string) => `/societies/${id}/members`,
    removeMember: (societyId: string, userId: string) => `/societies/${societyId}/members/${userId}`,
    positions: (id: string) => `/societies/${id}/positions`,
    assignPosition: (id: string) => `/societies/${id}/positions/assign`,
    revokePosition: (societyId: string, userId: string, positionId: string) => `/societies/${societyId}/positions/revoke/${userId}/${positionId}`,
    announcements: (id: string) => `/societies/${id}/announcements`,
  },
  events: {
    list: "/events",
    detail: (id: string) => `/events/${id}`,
    create: "/events",
    update: (id: string) => `/events/${id}`,
    registrations: {
      state: (eventId: string) => `/events/${eventId}/registrations/state`,
      action: (eventId: string) => `/events/${eventId}/registrations/action`,
      export: (eventId: string) => `/events/${eventId}/registrations/export`,
    }
  },
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
  profiles: {
    me: "/profiles/me",
    peer: (rollNumber: string) => `/profiles/${rollNumber}`,
  },
  privacy: {
    me: "/privacy",
  },
  academics: {
    summary: (rollNumber: string) => `/academics/summary/${rollNumber}`,
    semester: (rollNumber: string, semester: number) => `/academics/semester/${rollNumber}/${semester}`,
  },
  search: {
    students: "/search/students",
  },
  classes: {
    list: "/classes",
    detail: (classId: string) => `/classes/${classId}`,
    members: (classId: string) => `/classes/${classId}/members`,
    assignCr: (classId: string) => `/classes/${classId}/cr`,
    revokeCr: (classId: string, studentId: string) => `/classes/${classId}/cr/${studentId}`,
  },
  classAnnouncements: {
    list: (classId: string) => `/classes/${classId}/announcements`,
    create: (classId: string) => `/classes/${classId}/announcements`,
    update: (classId: string, announcementId: string) => `/classes/${classId}/announcements/${announcementId}`,
    delete: (classId: string, announcementId: string) => `/classes/${classId}/announcements/${announcementId}`,
  },
  classTasks: {
    list: (classId: string) => `/classes/${classId}/tasks`,
    create: (classId: string) => `/classes/${classId}/tasks`,
    update: (classId: string, taskId: string) => `/classes/${classId}/tasks/${taskId}`,
    delete: (classId: string, taskId: string) => `/classes/${classId}/tasks/${taskId}`,
    completions: (classId: string, taskId: string) => `/classes/${classId}/tasks/${taskId}/completions`,
    complete: (classId: string, taskId: string) => `/classes/${classId}/tasks/${taskId}/complete`,
  }
} as const;
