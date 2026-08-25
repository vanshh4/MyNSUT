export class SocietyPositionNotFoundError extends Error {
  constructor(message = "Society position not found") {
    super(message);
    this.name = "SocietyPositionNotFoundError";
  }
}
export class UnauthorizedAssignPORError extends Error {
  constructor(message = "Not authorized to assign PORs in this society") {
    super(message);
    this.name = "UnauthorizedAssignPORError";
  }
}
export class InvalidHierarchyError extends Error {
  constructor(message = "You can only assign or revoke PORs that are below your own POR in the hierarchy") {
    super(message);
    this.name = "InvalidHierarchyError";
  }
}