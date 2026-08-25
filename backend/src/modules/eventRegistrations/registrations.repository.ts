import { prisma } from "../../db/prisma.js";

export const registrationsRepository = {
  async getStudentRegistrationState(eventId: string, studentId: string) {
    const [registration, waitlist, interest] = await Promise.all([
      prisma.eventRegistration.findUnique({
        where: { eventId_studentId: { eventId, studentId } }
      }),
      prisma.eventWaitlistEntry.findUnique({
        where: { eventId_studentId: { eventId, studentId } }
      }),
      prisma.eventInterest.findUnique({
        where: { eventId_studentId: { eventId, studentId } }
      })
    ]);

    let waitlistPosition;
    if (waitlist && waitlist.status === 'WAITLISTED') {
      const position = await prisma.eventWaitlistEntry.count({
        where: {
          eventId,
          status: 'WAITLISTED',
          joinedAt: { lte: waitlist.joinedAt }
        }
      });
      waitlistPosition = position;
    }

    return {
      isRegistered: !!registration && registration.status === 'REGISTERED',
      isWaitlisted: !!waitlist && waitlist.status === 'WAITLISTED',
      isInterested: !!interest,
      waitlistPosition
    };
  }
};
