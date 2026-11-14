import { describe, expect, it } from "vitest";

import { apiUrl, buildUrl, isApiClientError, ApiClientError } from "./client";

describe("Frontend API Client Utilities", () => {
  it("builds consistent proxy URLs from paths with or without leading slashes", () => {
    expect(buildUrl("/events")).toBe("/api/backend/events");
    expect(buildUrl("events")).toBe("/api/backend/events");
    expect(apiUrl("/auth/google")).toBe("/api/backend/auth/google");
  });

  it("identifies ApiClientError instances correctly", () => {
    const apiError = new ApiClientError(404, "Not found", "RECORD_NOT_FOUND");
    const regularError = new Error("Regular error");

    expect(isApiClientError(apiError)).toBe(true);
    expect(isApiClientError(regularError)).toBe(false);
    expect(isApiClientError(null)).toBe(false);
  });
});
