import { prisma } from "../../db/prisma.js";
import { CreateSocietyPayload, UpdateSocietyPayload } from "@mynsut/shared";
import { Prisma } from "@prisma/client";

export const societiesRepository = {
  async getSocieties(params: { category?: string | undefined; skip?: number; take?: number }) {
    const { category, skip = 0, take = 10 } = params;
    const where: Prisma.SocietyWhereInput = {};
    if (category) {
      where.category = category as any;
    }
    
    const [data, total] = await Promise.all([
      prisma.society.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      prisma.society.count({ where })
    ]);
    return { data, total };
  },

  async getSocietyById(id: string) {
    return prisma.society.findUnique({
      where: { id }
    });
  },

  async createSociety(data: CreateSocietyPayload) {
    return prisma.society.create({ data });
  },

  async updateSociety(id: string, data: UpdateSocietyPayload) {
    return prisma.society.update({
      where: { id },
      ...Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))
    });
  },

  async deleteSociety(id: string) {
    return prisma.society.delete({
      where: { id }
    });
  }
};