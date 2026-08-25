import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../src/db/prisma.js';
import { registrationsService } from '../../src/modules/eventRegistrations/registrations.service.js';

describe('Event Registrations Concurrency', () => {
  let eventId: string;
  let societyId: string;
  let students: string[] = [];
  let userIds: string[] = [];

  beforeAll(async () => {
    // Create a dummy society
    const society = await prisma.society.create({
      data: {
        name: 'Concurrency Test Society',
        slug: 'concurrency-test-society',
        category: 'ACADEMIC',
      }
    });
    societyId = society.id;

    // Create an event with capacity 3
    const event = await prisma.event.create({
      data: {
        societyId,
        title: 'Concurrency Test Event',
        slug: 'concurrency-test-event',
        startDate: new Date(Date.now() + 86400000),
        endDate: new Date(Date.now() + 86400000 * 2),
        maxCapacity: 3,
        status: 'PUBLISHED',
        description: 'Test Event'
      }
    });
    eventId = event.id;

    // Create 5 students
    for (let i = 0; i < 5; i++) {
      const user = await prisma.user.create({
        data: {
          email: `concurrency-test-${i}@nsut.ac.in`,
          fullName: `Concurrency User ${i}`,
          status: 'ACTIVE'
        }
      });
      const student = await prisma.student.create({
        data: {
          id: user.id,
          rollNumber: `2024CS000${i}`,
          branch: 'CS',
          semester: 1
        }
      });
      userIds.push(user.id);
      students.push(student.id);
    }
  });

  afterAll(async () => {
    await prisma.eventRegistration.deleteMany({ where: { eventId } });
    await prisma.eventWaitlistEntry.deleteMany({ where: { eventId } });
    await prisma.eventInterest.deleteMany({ where: { eventId } });
    await prisma.event.delete({ where: { id: eventId } });
    await prisma.society.delete({ where: { id: societyId } });
    await prisma.student.deleteMany({ where: { id: { in: students } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  });

  it('should not overbook the event when multiple users register concurrently', async () => {
    // 5 concurrent registrations for a capacity of 3
    const promises = students.map(studentId => 
      registrationsService.handleRegistrationAction(eventId, studentId, 'REGISTER')
        .catch(err => err)
    );

    const results = await Promise.all(promises);

    let registeredCount = 0;
    let waitlistedCount = 0;

    for (const result of results) {
      if (result.status === 'REGISTERED') registeredCount++;
      if (result.status === 'WAITLISTED') waitlistedCount++;
    }

    expect(registeredCount).toBe(3);
    expect(waitlistedCount).toBe(2);

    const regCount = await prisma.eventRegistration.count({ where: { eventId, status: 'REGISTERED' } });
    const wlCount = await prisma.eventWaitlistEntry.count({ where: { eventId, status: 'WAITLISTED' } });

    expect(regCount).toBe(3);
    expect(wlCount).toBe(2);
  });
});

