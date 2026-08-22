import { describe, it, expect, vi, beforeEach } from "vitest";
import { noticesService } from "../../src/modules/notices/notices.service.js";
import { noticesRepository } from "../../src/modules/notices/notices.repository.js";
import { auditService } from "../../src/modules/audit/audit.service.js";
import { UntrustedUrlError, NoticeArchivedError } from "../../src/modules/notices/notices.errors.js";

vi.mock("../../src/modules/notices/notices.repository.js");
vi.mock("../../src/modules/audit/audit.service.js");

describe("Notices Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("URL Validation Policy", () => {
    it("should allow nsut.ac.in URLs", async () => {
      vi.mocked(noticesRepository.create).mockResolvedValue({ id: "1" } as any);
      
      const result = await noticesService.createNotice("creator1", {
        title: "Test",
        category: "ACADEMIC",
        sourceAuthority: "Dean",
        officialUrl: "https://www.nsut.ac.in/notice.pdf",
        publishedAt: new Date().toISOString()
      });

      expect(result).toBeDefined();
    });

    it("should reject non-HTTPS URLs", async () => {
      await expect(noticesService.createNotice("creator1", {
        title: "Test",
        category: "ACADEMIC",
        sourceAuthority: "Dean",
        officialUrl: "http://nsut.ac.in/notice.pdf",
        publishedAt: new Date().toISOString()
      })).rejects.toThrow(UntrustedUrlError);
    });

    it("should reject non-NSUT domains", async () => {
      await expect(noticesService.createNotice("creator1", {
        title: "Test",
        category: "ACADEMIC",
        sourceAuthority: "Dean",
        officialUrl: "https://example.com/notice.pdf",
        publishedAt: new Date().toISOString()
      })).rejects.toThrow(UntrustedUrlError);
    });
  });

  describe("State Transitions", () => {
    it("should reject updates to ARCHIVED notices", async () => {
      vi.mocked(noticesRepository.findById).mockResolvedValue({
        id: "1",
        status: "ARCHIVED"
      } as any);

      await expect(noticesService.updateNotice("1", "editor1", {
        title: "Updated"
      })).rejects.toThrow(NoticeArchivedError);
    });
  });
});
