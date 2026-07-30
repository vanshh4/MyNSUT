import { ApiError } from "../../utils/apiError.js";

export class RbacError extends ApiError {
  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(statusCode, message, { code, details });
    this.name = "RbacError";
  }
}

export const roleNotFound = (roleCode: string) =>
  new RbacError(404, "ROLE_NOT_FOUND", `The role '${roleCode}' does not exist.`);

export const invalidScope = (scope: string) =>
  new RbacError(400, "INVALID_SCOPE", `The scope '${scope}' is invalid.`);

export const duplicateRoleAssignment = () =>
  new RbacError(409, "DUPLICATE_ROLE_ASSIGNMENT", "The user already has this active role assignment.");

export const roleAssignmentNotFound = () =>
  new RbacError(404, "ROLE_ASSIGNMENT_NOT_FOUND", "The specified role assignment was not found.");

export const scopedPermissionDenied = () =>
  new RbacError(403, "SCOPED_PERMISSION_DENIED", "You do not have the required scoped permission to perform this action.");

export const invalidRoleScopeAssignment = () =>
  new RbacError(400, "INVALID_ROLE_SCOPE_ASSIGNMENT", "The requested role cannot be assigned to this scope.");

export const cannotRevokeMandatoryRole = () =>
  new RbacError(400, "CANNOT_REVOKE_MANDATORY_ROLE", "Mandatory system roles cannot be revoked.");
