import { prisma } from "../../db/prisma.js";
import { Prisma } from "@prisma/client";
import { NoticeFilterQuery } from "./notices.validation.js";

export const noticesRepository = {
  async create(data: Prisma.NoticeUncheckedCreateInput) {
    return prisma.notice.create({ data });
  },

  async update(id: string, data: Prisma.NoticeUpdateInput) {
    return prisma.notice.update({
      where: { id },
      data,
    });
  },

  async findById(id: string) {
    return prisma.notice.findUnique({
      where: { id },
    });
  },

  async delete(id: string) {
    return prisma.notice.delete({
      where: { id },
    });
  },

  async findAll(filters: NoticeFilterQuery) {
    const { page = 1, limit = 10, category, status, search } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.NoticeWhereInput = {};

    if (category) {
      where.category = category;
    }
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { sourceAuthority: { contains: search, mode: "insensitive" } },
      ];
    }

    const [notices, totalCount] = await Promise.all([
      prisma.notice.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notice.count({ where }),
    ]);

    return {
      data: notices,
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  },
};