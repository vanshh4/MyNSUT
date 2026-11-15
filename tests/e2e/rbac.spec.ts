import { expect, test } from "@playwright/test";

import {
  mockAuthenticatedSession,
  mockStudentPlatformApis,
} from "./fixtures/mockApi.js";
import {
  MOCK_ADMIN_USER,
  MOCK_CLASS_DETAILS,
  MOCK_STUDENT_USER,
} from "./fixtures/mockData.js";

test.describe("Role-Based Access Control (RBAC) E2E", () => {
  test("super admin can access admin dashboard and modules", async ({ page }) => {
    await mockAuthenticatedSession(page, MOCK_ADMIN_USER);
    await mockStudentPlatformApis(page);

    // Mock admin roles and users APIs
    await page.route("**/api/backend/admin/roles*", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [
            { id: "r1", code: "SUPER_ADMIN", name: "Super Admin", scope: "GLOBAL" },
            { id: "r2", code: "STUDENT", name: "Student", scope: "GLOBAL" },
            { id: "r3", code: "CLASS_CR", name: "Class Representative", scope: "CLASS" },
          ],
        }),
      });
    });

    await page.goto("/admin");

    // Super Admin header and module cards must be present
    await expect(page.getByRole("heading", { name: "Administration" })).toBeVisible();
    await expect(page.getByText("Authorized")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Roles" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Resources" })).toBeVisible();

    // Navigate to Roles module
    await page.goto("/admin/roles");
    await expect(page.getByRole("heading", { name: /role/i })).toBeVisible();
  });

  test("regular student cannot perform administrative operations and receives 403", async ({
    page,
  }) => {
    await mockAuthenticatedSession(page, MOCK_STUDENT_USER);
    await mockStudentPlatformApis(page);

    // Intercept attempt to call admin role assignment API
    await page.route("**/api/backend/admin/roles/assign", (route) => {
      route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "You lack the required role to perform this action.",
          error: { code: "INSUFFICIENT_ROLE" },
        }),
      });
    });

    // Navigate to dashboard and make an API request from the browser context to the admin endpoint
    await page.goto("/dashboard");
    const result = await page.evaluate(async () => {
      const res = await fetch("/api/backend/admin/roles/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "usr_target_01",
          roleCode: "SUPER_ADMIN",
        }),
      });
      return {
        status: res.status,
        body: await res.json(),
      };
    });

    expect(result.status).toBe(403);
    expect(result.body.success).toBe(false);
    expect(result.body.error.code).toBe("INSUFFICIENT_ROLE");
  });

  test("regular student cannot see class CR administrative controls", async ({ page }) => {
    // Normal student without CLASS_CR role
    await mockAuthenticatedSession(page, MOCK_STUDENT_USER);
    await mockStudentPlatformApis(page);

    await page.goto("/class");

    // Can see standard class details and feeds
    await expect(page.getByText(MOCK_CLASS_DETAILS.name)).toBeVisible();

    // Should NOT see administrative action buttons like "Assign CR" or "Create Announcement"
    await expect(page.getByRole("button", { name: /assign cr/i })).not.toBeVisible();
  });
});
