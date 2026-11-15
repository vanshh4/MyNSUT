import { expect, test } from "@playwright/test";

import {
  mockAuthenticatedSession,
  mockStudentPlatformApis,
  mockUnauthenticatedSession,
} from "./fixtures/mockApi.js";
import { MOCK_STUDENT_USER, MOCK_UNONBOARDED_USER } from "./fixtures/mockData.js";

test.describe("Authentication & Onboarding E2E", () => {
  test("unauthenticated visitor is redirected to signin page", async ({ page }) => {
    await mockUnauthenticatedSession(page);

    await page.goto("/dashboard");

    // AuthGuard detects unauthenticated session and redirects to sign in
    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page.getByRole("heading", { name: "Welcome to MyNSUT" })).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in with google/i })).toBeVisible();
  });

  test("google oauth sign-in button routes through the same-origin backend proxy", async ({
    page,
  }) => {
    await mockUnauthenticatedSession(page);
    await page.goto("/auth/signin");

    // Intercept Google OAuth redirect trigger
    const navigationPromise = page.waitForRequest((req) =>
      req.url().includes("/api/backend/auth/google")
    );

    // Clicking Google button should initiate navigation to /api/backend/auth/google
    await page.getByRole("button", { name: /sign in with google/i }).click();

    // Verify proxy endpoint was called
    const request = await navigationPromise;
    expect(request.url()).toContain("/api/backend/auth/google");
  });

  test("unonboarded student is forced to onboarding flow and completes it", async ({ page }) => {
    // Start as logged-in user who hasn't onboarded
    await mockAuthenticatedSession(page, MOCK_UNONBOARDED_USER);

    // Track onboarding submission
    let onboardingSubmitted = false;
    await page.route("**/api/backend/students/onboarding", (route) => {
      onboardingSubmitted = true;
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            id: "std_new_01",
            rollNumber: "2024UCS1001",
            branchCode: "UCS",
            section: "1",
            admissionYear: 2024,
            status: "ACTIVE",
          },
        }),
      });
    });

    // Visiting dashboard should immediately redirect to /onboarding
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/onboarding/);

    // Verify onboarding form elements are present
    const rollInput = page.getByLabel(/UMS roll number/i);
    await expect(rollInput).toBeVisible();

    // Type valid NSUT roll number
    await rollInput.fill("2024UCS1001");

    // Verify automatic preview recognizes roll number and derives details
    await expect(page.getByText("Roll number recognized")).toBeVisible();
    await expect(rollInput).toHaveValue("2024UCS1001");

    // Select section
    const sectionSelect = page.getByLabel(/section/i);
    await sectionSelect.selectOption("1");

    // Mock transition to onboarded user on subsequent /auth/me call
    await page.route("**/api/backend/auth/me", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            ...MOCK_UNONBOARDED_USER,
            onboardingCompleted: true,
          },
        }),
      });
    });

    // Set up student platform APIs for dashboard
    await mockStudentPlatformApis(page);

    // Submit onboarding form
    await page.getByRole("button", { name: /complete onboarding/i }).click();

    // Verify submission occurred and redirected to dashboard
    expect(onboardingSubmitted).toBe(true);
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("logging out clears session and redirects to sign in", async ({ page }) => {
    await mockAuthenticatedSession(page, MOCK_STUDENT_USER);
    await mockStudentPlatformApis(page);

    await page.goto("/dashboard");
    await expect(page.getByText("Aarav Sharma")).toBeVisible();

    // Trigger logout
    const logoutBtn = page.getByRole("button", { name: "Log out" }).first();
    await expect(logoutBtn).toBeVisible();

    // Mock unauthenticated on subsequent checks
    await mockUnauthenticatedSession(page);
    await logoutBtn.click();
    await expect(page).toHaveURL(/\/auth\/signin/);
  });
});
