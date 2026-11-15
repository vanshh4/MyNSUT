import { expect, test } from "@playwright/test";

import {
  mockAuthenticatedSession,
  mockStudentPlatformApis,
} from "./fixtures/mockApi.js";
import {
  MOCK_OWN_PROFILE,
  MOCK_PEER_PROFILE,
  MOCK_PRIVACY_SETTINGS,
  MOCK_STUDENT_USER,
} from "./fixtures/mockData.js";

test.describe("Profile & Privacy E2E", () => {
  test("student can view their own profile and metadata", async ({ page }) => {
    await mockAuthenticatedSession(page, MOCK_STUDENT_USER);
    await mockStudentPlatformApis(page);

    await page.goto("/profile/me");

    // Profile header assertions
    await expect(page.getByRole("heading", { name: MOCK_STUDENT_USER.fullName }).first()).toBeVisible();
    await expect(page.getByText(MOCK_OWN_PROFILE.student.rollNumber)).toBeVisible();
    await expect(page.getByText(MOCK_OWN_PROFILE.student.branchCode).first()).toBeVisible();
    await expect(page.getByText(MOCK_OWN_PROFILE.bio!)).toBeVisible();
  });

  test("student can update privacy settings and see confirmation", async ({ page }) => {
    await mockAuthenticatedSession(page, MOCK_STUDENT_USER);
    await mockStudentPlatformApis(page);

    let updatedPayload: unknown = null;
    await page.route("**/api/backend/privacy", (route) => {
      if (route.request().method() === "PUT") {
        updatedPayload = route.request().postDataJSON();
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              ...MOCK_PRIVACY_SETTINGS,
              bioVisibility: "PUBLIC",
            },
            message: "Privacy settings updated successfully.",
          }),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: MOCK_PRIVACY_SETTINGS,
          }),
        });
      }
    });

    await page.goto("/settings/privacy");

    await expect(page.getByRole("heading", { name: /privacy preferences/i })).toBeVisible();

    // Select new visibility for bio
    const bioSelect = page.locator('select[name="bioVisibility"]');
    await bioSelect.selectOption("PUBLIC");

    // Save changes
    const saveButton = page.getByRole("button", { name: /save privacy settings/i });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    // Verify success feedback is presented
    await expect(page.getByText("Privacy settings updated successfully.")).toBeVisible();
    expect(updatedPayload).toMatchObject({ bioVisibility: "PUBLIC" });
  });

  test("peer profile withholds hidden academic results from visitors", async ({ page }) => {
    await mockAuthenticatedSession(page, MOCK_STUDENT_USER);
    await mockStudentPlatformApis(page);

    await page.goto(`/profile/${MOCK_PEER_PROFILE.rollNumber}`);

    // Public info is visible
    await expect(page.getByRole("heading", { name: MOCK_PEER_PROFILE.name }).first()).toBeVisible();
    await expect(page.getByText(MOCK_PEER_PROFILE.rollNumber)).toBeVisible();
    await expect(page.getByText(MOCK_PEER_PROFILE.branch).first()).toBeVisible();

    // Sensitive academic CGPA / SGPA / results should NOT be shown for hidden profile
    await expect(page.getByText("Cumulative GPA")).not.toBeVisible();
    await expect(page.getByText("Semester SGPA")).not.toBeVisible();
  });
});
