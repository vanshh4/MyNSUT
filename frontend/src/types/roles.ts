import type { PERMISSIONS } from "@/constants/permissions";
import type { ROLES } from "@/constants/roles";

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
