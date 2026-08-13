import { describe, expect, it } from "vitest";
import { createAnnouncementSchema, updateAnnouncementSchema } from "../../src/modules/classAnnouncements/classAnnouncements.validation.js";

describe("Class Announcements Validation", () => {
  describe("createAnnouncementSchema", () => {
    it("accepts valid payloads", () => {
      const valid = {
        title: "Mid Sem Exam Schedule",
        content: "Please find the attached PDF for the mid semester exam schedule.",
        attachments: [
          { url: "https://example.com/schedule.pdf", title: "Schedule", displayName: "Mid Sem PDF" }
        ]
      };
      expect(() => createAnnouncementSchema.parse(valid)).not.toThrow();
    });

    it("rejects missing title", () => {
      const invalid = {
        content: "Content only"
      };
      expect(() => createAnnouncementSchema.parse(invalid)).toThrow();
    });

    it("rejects excessively long titles", () => {
      const invalid = {
        title: "a".repeat(256),
        content: "Valid content"
      };
      expect(() => createAnnouncementSchema.parse(invalid)).toThrow();
    });

    it("accepts no attachments", () => {
      const valid = {
        title: "Valid Title",
        content: "Valid content without attachments"
      };
      expect(createAnnouncementSchema.parse(valid).attachments).toBeUndefined();
    });
  });

  describe("updateAnnouncementSchema", () => {
    it("accepts partial updates", () => {
      const valid = { title: "New Title" };
      expect(() => updateAnnouncementSchema.parse(valid)).not.toThrow();
    });

    it("accepts valid full updates", () => {
      const valid = {
        title: "New Title",
        content: "New content",
        attachments: []
      };
      expect(() => updateAnnouncementSchema.parse(valid)).not.toThrow();
    });
  });
});
