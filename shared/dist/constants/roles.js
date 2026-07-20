/**
 * Stable role identifiers used by the frontend, backend, database seed,
 * and authorization policies. Do not change persisted values casually.
 */
export const ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    STUDENT: "STUDENT",
    CLASS_CR: "CLASS_CR",
    SOCIETY_PRESIDENT: "SOCIETY_PRESIDENT",
    SOCIETY_VICE_PRESIDENT: "SOCIETY_VICE_PRESIDENT",
    SOCIETY_MEMBER: "SOCIETY_MEMBER",
};
export const ROLE_CODES = Object.freeze(Object.values(ROLES));
export function isRoleCode(value) {
    return typeof value === "string" && ROLE_CODES.includes(value);
}
//# sourceMappingURL=roles.js.map