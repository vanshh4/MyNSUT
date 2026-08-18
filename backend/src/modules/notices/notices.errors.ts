export class NoticeNotFoundError extends Error {
  public readonly code = "NOTICE_NOT_FOUND";
  constructor(message = "Notice not found") {
    super(message);
    this.name = "NoticeNotFoundError";
  }
}

export class UntrustedUrlError extends Error {
  public readonly code = "UNTRUSTED_URL";
  constructor(message = "The provided URL domain is not trusted.") {
    super(message);
    this.name = "UntrustedUrlError";
  }
}

export class NoticeArchivedError extends Error {
  public readonly code = "NOTICE_ARCHIVED";
  constructor(message = "Cannot modify an archived notice.") {
    super(message);
    this.name = "NoticeArchivedError";
  }
}
