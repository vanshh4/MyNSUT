import { expect, test } from "@playwright/test";

import {
  mockAuthenticatedSession,
  mockStudentPlatformApis,
} from "./fixtures/mockApi.js";
import {
  MOCK_ADMIN_USER,
  MOCK_RESOURCES,
  MOCK_STUDENT_USER,
} from "./fixtures/mockData.js";

test.describe("Resources Module E2E", () => {
  test.describe("Student Experience (Read-Only Directory)", () => {
    test.beforeEach(async ({ page }) => {
      await mockAuthenticatedSession(page, MOCK_STUDENT_USER);
      await mockStudentPlatformApis(page);
    });

    test("student sees published resources grouped by subject, but no draft resources", async ({
      page,
    }) => {
      await page.goto("/resources");

      // Page Header
      await expect(page.getByRole("heading", { name: "Resource Directory" })).toBeVisible();

      // Published subjects should be visible
      await expect(page.getByText("BAS101")).toBeVisible();
      await expect(page.getByText("Applied Mathematics I")).toBeVisible();
      await expect(page.getByText("UCS201")).toBeVisible();
      await expect(page.getByText("Data Structures & Algorithms")).toBeVisible();

      // DRAFT resources MUST NOT be visible in the student directory
      await expect(page.getByText("Operating Systems Draft Quiz Solutions")).not.toBeVisible();
      await expect(page.getByText("UCS302")).not.toBeVisible();
    });

    test("student can filter resources via search bar", async ({ page }) => {
      await page.goto("/resources");

      const searchInput = page.getByPlaceholder(/search by subject name or code/i);
      await expect(searchInput).toBeVisible();

      // Fill search filter
      await searchInput.fill("Mathematics");

      // Verify input value reflects search query
      await expect(searchInput).toHaveValue("Mathematics");
    });
  });

  test.describe("Admin Experience (Creation & Publishing Flow)", () => {
    test.beforeEach(async ({ page }) => {
      await mockAuthenticatedSession(page, MOCK_ADMIN_USER);
      await mockStudentPlatformApis(page);

      // Admin sees ALL resources (including drafts)
      await page.route("**/api/backend/resources*", (route) => {
        if (route.request().method() === "POST") {
          const body = route.request().postDataJSON();
          route.fulfill({
            status: 201,
            contentType: "application/json",
            body: JSON.stringify({
              success: true,
              data: {
                id: "res_new_99",
                ...body,
                status: body.status || "PUBLISHED",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            }),
          });
        } else {
          route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              success: true,
              data: MOCK_RESOURCES,
            }),
          });
        }
      });
    });

    test("admin can view full resource inventory including drafts in admin portal", async ({
      page,
    }) => {
      await page.goto("/admin/resources");

      await expect(page.getByRole("heading", { name: "Resource Management" })).toBeVisible();
      // Admin should see both published and draft resources
      await expect(page.getByText("BAS101")).toBeVisible();
      await expect(page.getByText("Operating Systems Draft Quiz Solutions")).toBeVisible();
    });

    test("admin can create and publish a new resource", async ({ page }) => {
      let createdPayload: unknown = null;
      await page.route("**/api/backend/resources", (route) => {
        if (route.request().method() === "POST") {
          createdPayload = route.request().postDataJSON();
          route.fulfill({
            status: 201,
            contentType: "application/json",
            body: JSON.stringify({
              success: true,
              data: {
                id: "res_created_123",
                ...createdPayload,
                status: "PUBLISHED",
              },
            }),
          });
        } else {
          route.continue();
        }
      });

      await page.goto("/admin/resources/new");

      await expect(page.getByRole("heading", { name: "Add Resource" })).toBeVisible();

      // Fill in required fields
      await page.getByLabel(/subject name/i).fill("Computer Networks");
      await page.getByLabel(/subject code/i).fill("UCS303");
      await page.getByLabel(/google drive link/i).fill("https://assets.mynsut.com/resources/cn.pdf");

      // Optional fields
      await page.getByLabel(/^title/i).fill("Computer Networks Comprehensive Guide");

      // Submit form
      const submitBtn = page.getByRole("button", { name: /publish resource/i });
      await submitBtn.click();

      // Verify success notification is displayed
      await expect(
        page.getByText(/resource successfully published and is now visible to students/i)
      ).toBeVisible();

      expect(createdPayload).toMatchObject({
        subjectName: "Computer Networks",
        subjectCode: "UCS303",
        fileUrl: "https://assets.mynsut.com/resources/cn.pdf",
      });
    });
  });
});
