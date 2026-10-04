export class ResourceNotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "ResourceNotFoundError";
  }
}

export class ResourceArchivedError extends Error {
  constructor(message = "Cannot modify an archived resource") {
    super(message);
    this.name = "ResourceArchivedError";
  }
}
