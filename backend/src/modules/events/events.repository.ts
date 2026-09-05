import { prisma } from "../../db/prisma.js";
import { Prisma } from "@prisma/client";

export const eventsRepository = {
  async getEvents(filters: { societyId?: string; status?: string; upcoming?: boolean; page: number; limit: number }) {
    const { societyId, status, upcoming, page, limit } = filters;
    const where: Prisma.EventWhereInput = {};
    
    if (societyId) where.societyId = societyId;
    if (status) where.status = status as any;
    if (upcoming) {
      where.endDate = { gte: new Date() };
    }

    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'asc' },
        include: {
          society: {
            select: { name: true, logoUrl: true }
          },
          _count: {
            select: { registrations: true, waitlistEntries: true, interests: true }
          }
        }
      }),
      prisma.event.count({ where })
    ]);

    return { data, total, page, limit };
  },

  async getEventById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        society: {
          select: { name: true, logoUrl: true }
        },
        _count: {
          select: { registrations: true, waitlistEntries: true, interests: true }
        }
      }
    });
  },

  async createEvent(data: Prisma.EventUncheckedCreateInput) {
    return prisma.event.create({
      data,
      include: {
        society: { select: { name: true, logoUrl: true } },
        _count: {
          select: { registrations: true, waitlistEntries: true, interests: true }
        }
      }
    });
  },

  async updateEvent(id: string, data: Prisma.EventUpdateInput) {
    return prisma.event.update({
      where: { id },
      data,
      include: {
        society: { select: { name: true, logoUrl: true } },
        _count: {
          select: { registrations: true, waitlistEntries: true, interests: true }
        }
      }
    });
  }
};
