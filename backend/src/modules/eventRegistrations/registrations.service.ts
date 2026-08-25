import { prisma } from "../../db/prisma.js";
import { EventNotFoundError } from "../events/events.errors.js";

export const registrationsService = {
  async handleRegistrationAction(eventId: string, studentId: string, action: "INTERESTED" | "REGISTER" | "CANCEL") {
    if (action === "INTERESTED") {
      await prisma.eventInterest.upsert({
        where: { eventId_studentId: { eventId, studentId } },
        create: { eventId, studentId },
        update: {}
      });
      return { status: "INTERESTED" };
    }

    return prisma.$transaction(async (tx) => {
      // 1. Lock the event row to prevent concurrent capacity breaches
      const eventLocked = await tx.$queryRaw<{id: string, maxCapacity: number}[]>`
        SELECT id, max_capacity as "maxCapacity" 
        FROM "events" 
        WHERE id = ${eventId}::uuid 
        FOR UPDATE
      `;
      
      if (eventLocked.length === 0) {
        throw new EventNotFoundError();
      }
      
      const maxCapacity = eventLocked[0]!.maxCapacity;

      if (action === "REGISTER") {
        const existing = await tx.eventRegistration.findUnique({
          where: { eventId_studentId: { eventId, studentId } }
        });
        if (existing && existing.status === 'REGISTERED') {
          return { status: "REGISTERED" };
        }

        const currentRegistrations = await tx.eventRegistration.count({
          where: { eventId, status: "REGISTERED" }
        });

        if (currentRegistrations < maxCapacity) {
          await tx.eventRegistration.upsert({
            where: { eventId_studentId: { eventId, studentId } },
            create: { eventId, studentId, status: "REGISTERED" },
            update: { status: "REGISTERED" }
          });
          
          await tx.eventWaitlistEntry.deleteMany({
            where: { eventId, studentId }
          });
          
          return { status: "REGISTERED" };
        } else {
          await tx.eventWaitlistEntry.upsert({
            where: { eventId_studentId: { eventId, studentId } },
            create: { eventId, studentId, status: "WAITLISTED" },
            update: { status: "WAITLISTED" }
          });
          return { status: "WAITLISTED" };
        }
      } 
      
      if (action === "CANCEL") {
        const reg = await tx.eventRegistration.findUnique({
          where: { eventId_studentId: { eventId, studentId } }
        });
        
        if (reg && reg.status === "REGISTERED") {
          await tx.eventRegistration.update({
            where: { id: reg.id },
            data: { status: "CANCELLED" }
          });

          // Synchronous promotion from waitlist
          const oldestWaitlist = await tx.eventWaitlistEntry.findFirst({
            where: { eventId, status: "WAITLISTED" },
            orderBy: { joinedAt: 'asc' }
          });

          if (oldestWaitlist) {
            await tx.eventWaitlistEntry.update({
              where: { id: oldestWaitlist.id },
              data: { status: "REGISTERED" }
            });
            
            await tx.eventRegistration.upsert({
              where: { eventId_studentId: { eventId, studentId: oldestWaitlist.studentId } },
              create: { eventId, studentId: oldestWaitlist.studentId, status: "REGISTERED" },
              update: { status: "REGISTERED" }
            });
          }
        } else {
          const wl = await tx.eventWaitlistEntry.findUnique({
             where: { eventId_studentId: { eventId, studentId } }
          });
          if (wl && wl.status === "WAITLISTED") {
             await tx.eventWaitlistEntry.update({
               where: { id: wl.id },
               data: { status: "CANCELLED" }
             });
          }
        }
        
        await tx.eventInterest.deleteMany({
          where: { eventId, studentId }
        });

        return { status: "CANCELLED" };
      }
    });
  }
};
