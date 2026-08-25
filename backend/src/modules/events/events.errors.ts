export class EventNotFoundError extends Error {
  constructor(message = "Event not found") {
    super(message);
    this.name = "EventNotFoundError";
  }
}

export class EventOwnershipError extends Error {
  constructor(message = "You do not have permission to manage this event") {
    super(message);
    this.name = "EventOwnershipError";
  }
}
