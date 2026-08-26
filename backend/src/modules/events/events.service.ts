import { eventsRepository } from "./events.repository.js";
import { EventNotFoundError, EventOwnershipError } from "./events.errors.js";
import { logAction } from "../audit/audit.service.js";
import { prisma } from "../../db/prisma.js";
import { Prisma } from "@prisma/client";

export const eventsService = {
  async getEvents(filters: { societyId?: string; status?: string; upcoming?: boolean; page: number; limit: number }) {
    const result = await eventsRepository.getEvents(filters);
    return {
      data: result.data,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit)
      }
    };
  },

  async getEventById(id: string) {
    const event = await eventsRepository.getEventById(id);
    if (!event) {
      throw new EventNotFoundError();
    }
    return event;
  },

  async validateEventOwnership(eventId: string, userId: string) {
    const event = await eventsRepository.getEventById(eventId);
    if (!event) {
      throw new EventNotFoundError();
    }
    
    // Check if user is part of the society (basic ownership validation)
    const membership = await prisma.societyMembership.findUnique({
      where: {
        userId_societyId: {
          userId,
          societyId: event.societyId
        }
      }
    });

    if (!membership) {
      const globalAdmin = await prisma.userGlobalRole.findFirst({
        where: { userId, role: { code: 'SUPER_ADMIN' } }
      });
      if (!globalAdmin) {
        throw new EventOwnershipError();
      }
    }
    
    return event;
  },

  async createEvent(actorId: string, data: Prisma.EventUncheckedCreateInput, ipAddress?: string) {
    // Check if user has rights to the society
    const membership = await prisma.societyMembership.findUnique({
      where: {
        userId_societyId: {
          userId: actorId,
          societyId: data.societyId
        }
      }
    });

    if (!membership) {
      const globalAdmin = await prisma.userGlobalRole.findFirst({
        where: { userId: actorId, role: { code: 'SUPER_ADMIN' } }
      });
      if (!globalAdmin) {
        throw new EventOwnershipError("You do not have permission to create events for this society");
      }
    }

    if (new Date(data.startDate) >= new Date(data.endDate)) {
      throw new Error("End date must be after start date");
    }

    data.status = "PUBLISHED";
    const event = await eventsRepository.createEvent(data);
    await logAction(prisma, actorId, "EVENT_CREATE", "EVENT", event.id, undefined, undefined, ipAddress);
    return event;
  },

  async updateEvent(id: string, actorId: string, data: Prisma.EventUpdateInput, ipAddress?: string) {
    const existing = await this.validateEventOwnership(id, actorId);
    
    if (data.startDate && data.endDate && new Date(data.startDate as string) >= new Date(data.endDate as string)) {
      throw new Error("End date must be after start date");
    }
    
    // Status transition validation
    if (data.status && existing.status === 'CANCELLED') {
      throw new Error("Cannot update a cancelled event");
    }

    const event = await eventsRepository.updateEvent(id, data);
    await logAction(prisma, actorId, "EVENT_UPDATE", "EVENT", event.id, undefined, undefined, ipAddress);
    return event;
  }
};
