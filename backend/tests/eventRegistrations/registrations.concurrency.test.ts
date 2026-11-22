import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../src/db/prisma.js';
import { registrationsService } from '../../src/modules/eventRegistrations/registrations.service.js';

describe('Event Registrations Concurrency', () => {
  const isCI = process.env.CI?.trim().toLowerCase() === 'true';
  let isDbAvailable = false;
  let eventId: string;
  let societyId: string;
  let classId: string;
  const students: string[] = [];
  const userIds: string[] = [];

  beforeAll(async () => {
    try {
      await prisma.$connect();
      isDbAvailable = true;
    } catch (error) {
      if (isCI) {
        throw new Error(
          `[FATAL] PostgreSQL test database is unreachable in CI environment (CI=true).\n` +
            `Database-dependent concurrency integration tests cannot be skipped in automated CI pipelines.\n` +
            `Ensure the PostgreSQL service container is running and healthy on port 5432.\n` +
            `Underlying connection error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
      console.warn('PostgreSQL database not available; skipping concurrency integration tests.');
      return;
    }

    // Create a dummy society
    const society = await prisma.society.create({
      data: {
        name: `Concurrency Test Society ${Date.now()}`,
        category: 'ACADEMIC',
      }
    });
    societyId = society.id;

    // Create an event with capacity 3
    const event = await prisma.event.create({
      data: {
        societyId,
        title: 'Concurrency Test Event',
        startDate: new Date(Date.now() + 86400000),
        endDate: new Date(Date.now() + 86400000 * 2),
        maxCapacity: 3,
        status: 'PUBLISHED',
        description: 'Test Event'
      }
    });
    eventId = event.id;

    // Create an academic class for students
    const academicClass = await prisma.academicClass.upsert({
      where: {
        admissionYear_branchCode_section: {
          admissionYear: 2099,
          branchCode: 'CONC',
          section: 'C1',
        },
      },
      update: {},
      create: {
        name: 'Concurrency Test Class',
        admissionYear: 2099,
        branchCode: 'CONC',
        section: 'C1',
      },
    });
    classId = academicClass.id;

    // Create 5 students
    for (let i = 0; i < 5; i++) {
      const user = await prisma.user.create({
        data: {
          email: `concurrency-test-${Date.now()}-${i}@nsut.ac.in`,
          fullName: `Concurrency User ${i}`,
          status: 'ACTIVE'
        }
      });
      const student = await prisma.student.create({
        data: {
          userId: user.id,
          classId: academicClass.id,
          umsRollNumber: `UMS-CONC-${Date.now()}-${i}`,
          admissionYear: 2099,
          branchCode: 'CONC',
          rollNumber: `2099CONC00${i}`,
          section: 'C1',
          graduationYear: 2103,
        }
      });
      userIds.push(user.id);
      students.push(student.id);
    }
  });

  afterAll(async () => {
    if (!isDbAvailable) return;
    try {
      if (eventId) {
        await prisma.eventRegistration.deleteMany({ where: { eventId } });
        await prisma.eventWaitlistEntry.deleteMany({ where: { eventId } });
        await prisma.eventInterest.deleteMany({ where: { eventId } });
        await prisma.event.delete({ where: { id: eventId } }).catch(() => {});
      }
      if (societyId) {
        await prisma.society.delete({ where: { id: societyId } }).catch(() => {});
      }
      if (students.length > 0) {
        await prisma.student.deleteMany({ where: { id: { in: students } } });
      }
      if (userIds.length > 0) {
        await prisma.user.deleteMany({ where: { id: { in: userIds } } });
      }
      if (classId) {
        await prisma.academicClass.delete({ where: { id: classId } }).catch(() => {});
      }
    } catch {
      // Ignore cleanup error if already cleared
    } finally {
      await prisma.$disconnect().catch(() => {});
    }
  });

  it('should not overbook the event when multiple users register concurrently', async (ctx) => {
    if (!isDbAvailable) {
      if (isCI) {
        throw new Error(
          '[FATAL] Concurrency integration test was executed in CI (CI=true) without an available PostgreSQL database.'
        );
      }
      ctx.skip();
      return;
    }
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

