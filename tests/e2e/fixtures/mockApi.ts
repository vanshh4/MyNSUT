import type { Page, Route } from "@playwright/test";
import type { AuthenticatedUser } from "@mynsut/shared";

import {
  MOCK_CLASS_DETAILS,
  MOCK_EVENTS,
  MOCK_NOTICES,
  MOCK_OWN_PROFILE,
  MOCK_PEER_PROFILE,
  MOCK_PRIVACY_SETTINGS,
  MOCK_REGISTRATION_STATE,
  MOCK_RESOURCES,
  MOCK_SOCIETIES,
  MOCK_STUDENT_PROFILE,
  MOCK_STUDENT_USER,
  MOCK_UNIFIED_FEED,
} from "./mockData.js";

/**
 * Standard JSON response helper for Playwright route fulfillments.
 */
function jsonResponse(route: Route, data: unknown, status = 200, message = "Success") {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify({
      success: status >= 200 && status < 300,
      data,
      message,
      ...(status >= 400 ? { error: { code: "ERROR", details: data } } : {}),
    }),
  });
}

/**
 * Mocks an unauthenticated visitor session (401 on /auth/me).
 */
export async function mockUnauthenticatedSession(page: Page): Promise<void> {
  await page.route("**/api/backend/auth/me", (route) => {
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        message: "Authentication required.",
        error: { code: "UNAUTHORIZED" },
      }),
    });
  });
}

/**
 * Mocks an active authenticated session for a specific user.
 */
export async function mockAuthenticatedSession(
  page: Page,
  user: AuthenticatedUser = MOCK_STUDENT_USER
): Promise<void> {
  await page.route("**/api/backend/auth/me", (route) => {
    jsonResponse(route, user);
  });

  await page.route("**/api/backend/auth/logout*", (route) => {
    jsonResponse(route, null, 200, "Logged out successfully");
  });
}

/**
 * Sets up full API mocking for student workflow testing.
 */
export async function mockStudentPlatformApis(page: Page): Promise<void> {
  // Profiles & Privacy
  await page.route("**/api/backend/students/me", (route) => jsonResponse(route, MOCK_STUDENT_PROFILE));
  await page.route("**/api/backend/profiles/me", (route) => jsonResponse(route, MOCK_OWN_PROFILE));
  await page.route("**/api/backend/privacy", (route) => {
    if (route.request().method() === "PUT") {
      jsonResponse(route, MOCK_PRIVACY_SETTINGS, 200, "Privacy updated");
    } else {
      jsonResponse(route, MOCK_PRIVACY_SETTINGS);
    }
  });
  await page.route("**/api/backend/profiles/2024UCS1002", (route) => jsonResponse(route, MOCK_PEER_PROFILE));

  // Classes
  await page.route("**/api/backend/classes/cls_01/announcements", (route) => jsonResponse(route, []));
  await page.route("**/api/backend/classes/cls_01/tasks", (route) => jsonResponse(route, []));
  await page.route("**/api/backend/classes/cls_01/members", (route) => jsonResponse(route, []));
  await page.route("**/api/backend/classes/cls_01", (route) => jsonResponse(route, MOCK_CLASS_DETAILS));
  await page.route("**/api/backend/classes", (route) => jsonResponse(route, [MOCK_CLASS_DETAILS]));

  // Notices
  await page.route("**/api/backend/notices/feed*", (route) =>
    jsonResponse(route, MOCK_UNIFIED_FEED)
  );
  await page.route("**/api/backend/notices*", (route) => jsonResponse(route, MOCK_NOTICES));

  // Societies
  await page.route("**/api/backend/societies*", (route) => jsonResponse(route, MOCK_SOCIETIES));

  // Events
  await page.route("**/api/backend/events/*/registrations/state", (route) =>
    jsonResponse(route, MOCK_REGISTRATION_STATE)
  );
  await page.route("**/api/backend/events/*/registrations/action", (route) =>
    jsonResponse(route, { status: "REGISTERED" })
  );
  await page.route("**/api/backend/events/*", (route) => {
    const url = route.request().url();
    if (url.includes("/registrations/")) return;
    jsonResponse(route, MOCK_EVENTS[0]);
  });
  await page.route("**/api/backend/events*", (route) => {
    const url = route.request().url();
    if (url.includes("/events/") && !url.includes("/events?")) {
      jsonResponse(route, MOCK_EVENTS[0]);
    } else {
      jsonResponse(route, MOCK_EVENTS);
    }
  });

  // Resources (Students only see PUBLISHED)
  const publishedResources = MOCK_RESOURCES.filter((r) => r.status === "PUBLISHED");
  await page.route("**/api/backend/resources*", (route) => {
    jsonResponse(route, publishedResources);
  });
}
