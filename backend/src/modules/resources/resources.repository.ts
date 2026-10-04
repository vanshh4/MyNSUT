import { prisma } from "../../db/prisma.js";
import type { Prisma } from "@prisma/client";

export const resourcesRepository = {
  async create(data: Prisma.ResourceUncheckedCreateInput) {
    return prisma.resource.create({
      data,
    });
  },

  async update(id: string, data: Prisma.ResourceUpdateInput) {
    return prisma.resource.update({
      where: { id },
      data,
    });
  },

  async findById(id: string) {
    return prisma.resource.findUnique({
      where: { id },
    });
  },

  async findMany(where: Prisma.ResourceWhereInput, skip?: number, take?: number) {
    return prisma.resource.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  async count(where: Prisma.ResourceWhereInput) {
    return prisma.resource.count({ where });
  },

  async delete(id: string) {
    return prisma.resource.delete({
      where: { id },
    });
  }
};
