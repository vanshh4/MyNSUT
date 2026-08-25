export class UnauthorizedPostAnnouncementError extends Error {
  constructor(message = "Not authorized to post announcements in this society") {
    super(message);
    this.name = "UnauthorizedPostAnnouncementError";
  }
}
export class UnauthorizedViewAnnouncementError extends Error {
  constructor(message = "Not authorized to view private announcements in this society") {
    super(message);
    this.name = "UnauthorizedViewAnnouncementError";
  }
}