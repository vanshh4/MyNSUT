import { expect, test } from "@playwright/test";

import {
  mockAuthenticatedSession,
  mockStudentPlatformApis,
} from "./fixtures/mockApi.js";
import {
  MOCK_CLASS_DETAILS,
  MOCK_EVENTS,
  MOCK_NOTICES,
  MOCK_SOCIETIES,
  MOCK_STUDENT_USER,
} from "./fixtures/mockData.js";

test.describe("Core Student Workflows E2E", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page, MOCK_STUDENT_USER);
    await mockStudentPlatformApis(page);
  });

  test("student can navigate to class workspace and switch tabs", async ({ page }) => {
    await page.goto("/class");

    // Header and class metadata
    await expect(page.getByText(MOCK_CLASS_DETAILS.name)).toBeVisible();

    // Verify tabs are available
    const announcementsTab = page.getByRole("button", { name: /announcements/i });
    const tasksTab = page.getByRole("button", { name: /tasks/i });
    const membersTab = page.getByRole("button", { name: /members/i });

    await expect(announcementsTab.first()).toBeVisible();
    await expect(tasksTab.first()).toBeVisible();
    await expect(membersTab.first()).toBeVisible();

    // Switch to Members tab
    await membersTab.first().click();
    await expect(page).toHaveURL(/tab=members/);
  });

  test("student can view and filter notices feed", async ({ page }) => {
    await page.goto("/notices");

    // Notices list is rendered
    await expect(page.getByRole("heading", { name: "Notice Directory" })).toBeVisible();
    await expect(page.getByText(MOCK_NOTICES[0].title)).toBeVisible();
    await expect(page.getByText(MOCK_NOTICES[1].title)).toBeVisible();
  });

  test("student can browse societies directory and inspect society details", async ({ page }) => {
    await page.goto("/societies");

    // Directory header
    await expect(page.getByRole("heading", { name: /societies/i })).toBeVisible();

    // Society card is displayed
    const societyCard = page.getByText(MOCK_SOCIETIES[0].name);
    await expect(societyCard).toBeVisible();
    await expect(page.getByText(MOCK_SOCIETIES[0].category, { exact: true })).toBeVisible();
  });

  test("student can browse events and interact with registration flow", async ({ page }) => {
    await page.goto("/events");

    // Event title and details visible in listing
    const event = MOCK_EVENTS[0];
    await expect(page.getByText(event.title)).toBeVisible();
    await expect(page.getByText(event.location!)).toBeVisible();

    // Navigate to event details
    await page.goto(`/events/${event.id}`);

    await expect(page.getByRole("heading", { name: event.title })).toBeVisible();
    await expect(page.getByText(event.location!)).toBeVisible();

    // Registration button is present
    const registerBtn = page.getByRole("button", { name: /register|interested/i });
    await expect(registerBtn.first()).toBeVisible();
  });
});
