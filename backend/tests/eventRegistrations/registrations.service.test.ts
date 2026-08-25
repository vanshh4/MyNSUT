import { describe, it, expect, vi, beforeEach } from 'vitest';

const transaction = vi.fn();
vi.mock('../../src/db/prisma.js', () => ({
  prisma: { $transaction: transaction },
}));

const { registrationsService } = await import('../../src/modules/eventRegistrations/registrations.service.js');
const { EventNotFoundError } = await import('../../src/modules/events/events.errors.js');

describe('registrationsService', () => {
  const mockStudentId = 'student-1';
  const mockEventId = 'event-1';

  beforeEach(() => {
    vi.clearAllMocks();
    transaction.mockImplementation(async (callback: (tx: any) => Promise<unknown>) => {
      const tx = {
        $queryRaw: vi.fn().mockResolvedValue([{ id: mockEventId, maxCapacity: 10 }]),
        eventRegistration: {
          findUnique: vi.fn(),
          count: vi.fn().mockResolvedValue(0),
          upsert: vi.fn(),
          update: vi.fn(),
        },
        eventWaitlistEntry: {
          deleteMany: vi.fn(),
          upsert: vi.fn(),
          findUnique: vi.fn(),
          findFirst: vi.fn(),
          update: vi.fn(),
        },
        eventInterest: {
          upsert: vi.fn(),
          deleteMany: vi.fn(),
        }
      };
      return callback(tx);
    });
  });

  describe('handleRegistrationAction', () => {
    it('should throw EventNotFoundError if event does not exist in transaction', async () => {
      transaction.mockImplementation(async (callback: (tx: any) => Promise<unknown>) => {
        const tx = {
          $queryRaw: vi.fn().mockResolvedValue([]), // Emulate not found
        };
        return callback(tx);
      });

      await expect(
        registrationsService.handleRegistrationAction(mockEventId, mockStudentId, 'REGISTER')
      ).rejects.toThrow(EventNotFoundError);
    });
  });
});

