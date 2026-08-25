import { prisma } from "../../db/prisma.js";
import { eventsService } from "../events/events.service.js";
import { logAction } from "../audit/audit.service.js";

export const registrationExportService = {
  async generateExportCsv(eventId: string, actorId: string, ipAddress?: string) {
    await eventsService.validateEventOwnership(eventId, actorId);

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId, status: "REGISTERED" },
      include: {
        student: {
          include: {
            user: true
          }
        }
      }
    });

    const headers = ["Name", "UMS Roll Number", "NSUT Email"];
    const rows = registrations.map(reg => [
      `"${reg.student.user.fullName}"`,
      `"${reg.student.umsRollNumber}"`,
      `"${reg.student.user.email}"`
    ]);

    await logAction(prisma, actorId, "EVENT_REGISTRATIONS_EXPORTED", "EVENT", eventId, undefined, undefined, ipAddress);

    return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  }
};
