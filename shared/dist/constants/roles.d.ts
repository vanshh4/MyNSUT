/**
 * Stable role identifiers used by the frontend, backend, database seed,
 * and authorization policies. Do not change persisted values casually.
 */
export declare const ROLES: {
    readonly SUPER_ADMIN: "SUPER_ADMIN";
    readonly STUDENT: "STUDENT";
    readonly CLASS_CR: "CLASS_CR";
    readonly SOCIETY_PRESIDENT: "SOCIETY_PRESIDENT";
    readonly SOCIETY_VICE_PRESIDENT: "SOCIETY_VICE_PRESIDENT";
    readonly SOCIETY_MEMBER: "SOCIETY_MEMBER";
};
export type RoleCode = (typeof ROLES)[keyof typeof ROLES];
export declare const ROLE_CODES: readonly RoleCode[];
export declare function isRoleCode(value: unknown): value is RoleCode;
//# sourceMappingURL=roles.d.ts.map