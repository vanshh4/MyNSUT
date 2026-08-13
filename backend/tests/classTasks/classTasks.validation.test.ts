import { describe, expect, it } from "vitest";
import { createTaskSchema, updateTaskSchema } from "../../src/modules/classTasks/classTasks.validation.js";

describe("Class Tasks Validation", () => {
  describe("createTaskSchema", () => {
    it("accepts valid minimum payload", () => {
      const valid = {
        title: "Submit Lab File",
        taskType: "SUBMIT_ASSIGNMENT"
      };
      expect(() => createTaskSchema.parse(valid)).not.toThrow();
    });

    it("accepts valid full payload", () => {
      const valid = {
        title: "Fill Placement Form",
        taskType: "FILL_FORM",
        description: "Please fill this Google form.",
        url: "https://docs.google.com/forms/d/e/1FAIpQLS...",
        dueDate: new Date().toISOString()
      };
      expect(() => createTaskSchema.parse(valid)).not.toThrow();
    });

    it("rejects invalid task types", () => {
      const invalid = {
        title: "Invalid Type",
        taskType: "UNKNOWN_TYPE"
      };
      expect(() => createTaskSchema.parse(invalid)).toThrow(/Invalid option/);
    });

    it("rejects invalid URLs", () => {
      const invalid = {
        title: "Check this out",
        taskType: "OTHER",
        url: "not-a-valid-url"
      };
      expect(() => createTaskSchema.parse(invalid)).toThrow(/Invalid URL/);
    });
  });

  describe("updateTaskSchema", () => {
    it("accepts partial updates", () => {
      expect(() => updateTaskSchema.parse({ title: "Updated Title" })).not.toThrow();
      expect(() => updateTaskSchema.parse({ taskType: "READ_DOCUMENT" })).not.toThrow();
    });

    it("rejects invalid updates", () => {
      expect(() => updateTaskSchema.parse({ taskType: "INVALID" })).toThrow();
    });
  });
});
