import { societiesRepository } from "./societies.repository.js";
import { CreateSocietyPayload, UpdateSocietyPayload } from "@mynsut/shared";
import { SocietyNotFoundError } from "./societies.errors.js";
import { logAction } from "../audit/audit.service.js";
import { prisma } from "../../db/prisma.js";

export const societiesService = {
  async getSocieties(filters: { category?: string | undefined; page: number; limit: number }) {
    const skip = (filters.page - 1) * filters.limit;
    const { data, total } = await societiesRepository.getSocieties({
      ...(filters.category ? { category: filters.category } : {}),
      skip,
      take: filters.limit
    });

    return {
      data,
      meta: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit)
      }
    };
  },

  async getSocietyById(id: string) {
    const society = await societiesRepository.getSocietyById(id);
    if (!society) {
      throw new SocietyNotFoundError();
    }
    return society;
  },

  async createSociety(actorId: string, data: CreateSocietyPayload, ipAddress?: string) {
    const society = await societiesRepository.createSociety(data);
    await logAction(prisma, actorId, "SOCIETY_CREATE", "SOCIETY", society.id, undefined, undefined, ipAddress);
    return society;
  },

  async updateSociety(id: string, actorId: string, data: UpdateSocietyPayload, ipAddress?: string) {
    const existing = await societiesRepository.getSocietyById(id);
    if (!existing) {
      throw new SocietyNotFoundError();
    }
    const society = await societiesRepository.updateSociety(id, data);
    await logAction(prisma, actorId, "SOCIETY_UPDATE", "SOCIETY", society.id, undefined, undefined, ipAddress);
    return society;
  },

  async deleteSociety(id: string, actorId: string, ipAddress?: string) {
    const existing = await societiesRepository.getSocietyById(id);
    if (!existing) {
      throw new SocietyNotFoundError();
    }
    const society = await societiesRepository.deleteSociety(id);
    await logAction(prisma, actorId, "SOCIETY_DELETE", "SOCIETY", society.id, undefined, undefined, ipAddress);
    return society;
  }
};