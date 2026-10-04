export const RESOURCE_TYPES = {
  PYQ: "PYQ",
  NOTE: "NOTE",
  BOOK: "BOOK",
  REFERENCE: "REFERENCE",
  OTHER: "OTHER",
} as const;

export type ResourceTypeCode = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES];

export const RESOURCE_TYPE_CODES = Object.freeze(
  Object.values(RESOURCE_TYPES)
) as readonly ResourceTypeCode[];

export function isResourceTypeCode(value: unknown): value is ResourceTypeCode {
  return (
    typeof value === "string" &&
    RESOURCE_TYPE_CODES.includes(value as ResourceTypeCode)
  );
}

export const RESOURCE_STATUS = {
  PUBLISHED: "PUBLISHED",
  DRAFT: "DRAFT",
  ARCHIVED: "ARCHIVED",
} as const;

export type ResourceStatusCode = (typeof RESOURCE_STATUS)[keyof typeof RESOURCE_STATUS];

export const RESOURCE_STATUS_CODES = Object.freeze(
  Object.values(RESOURCE_STATUS)
) as readonly ResourceStatusCode[];

export function isResourceStatusCode(value: unknown): value is ResourceStatusCode {
  return (
    typeof value === "string" &&
    RESOURCE_STATUS_CODES.includes(value as ResourceStatusCode)
  );
}
