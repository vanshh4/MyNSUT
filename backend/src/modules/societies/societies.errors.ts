export class SocietyNotFoundError extends Error {
  constructor(message = "Society not found") {
    super(message);
    this.name = "SocietyNotFoundError";
  }
}
export class SocietyAlreadyExistsError extends Error {
  constructor(message = "Society already exists") {
    super(message);
    this.name = "SocietyAlreadyExistsError";
  }
}