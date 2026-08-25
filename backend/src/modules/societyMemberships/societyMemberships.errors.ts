export class SocietyMembershipNotFoundError extends Error {
  constructor(message = "Society membership not found") {
    super(message);
    this.name = "SocietyMembershipNotFoundError";
  }
}
export class UserNotFoundError extends Error {
  constructor(message = "User not found with the provided email") {
    super(message);
    this.name = "UserNotFoundError";
  }
}
export class AlreadyMemberError extends Error {
  constructor(message = "User is already a member of this society") {
    super(message);
    this.name = "AlreadyMemberError";
  }
}
export class UnauthorizedManageMembersError extends Error {
  constructor(message = "Not authorized to manage members in this society") {
    super(message);
    this.name = "UnauthorizedManageMembersError";
  }
}