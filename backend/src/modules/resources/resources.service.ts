import { resourcesRepository } from "./resources.repository.js";
import { ResourceNotFoundError, ResourceArchivedError } from "./resources.errors.js";
import type { CreateResourcePayload, UpdateResourcePayload, ResourceFilters } from "@mynsut/shared";
import type { Prisma } from "@prisma/client";

export const resourcesService = {
  async getResources(filters: ResourceFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ResourceWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.resourceType) {
      where.resourceType = filters.resourceType;
    }

    if (filters.subjectCode) {
      where.subjectCode = filters.subjectCode;
    }
    
    if (filters.department) {
      where.department = filters.department;
    }

    if (filters.semester) {
      where.semester = filters.semester;
    }

    if (filters.academicYear) {
      where.academicYear = filters.academicYear;
    }

    if (filters.examSession) {
      where.examSession = filters.examSession;
    }

    if (filters.query) {
      where.OR = [
        { title: { contains: filters.query, mode: "insensitive" } },
        { description: { contains: filters.query, mode: "insensitive" } },
        { subjectName: { contains: filters.query, mode: "insensitive" } }
      ];
    }

    const [data, total] = await Promise.all([
      resourcesRepository.findMany(where, skip, limit),
      resourcesRepository.count(where)
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  },

  async getResourceById(id: string) {
    const resource = await resourcesRepository.findById(id);
    if (!resource) {
      throw new ResourceNotFoundError();
    }
    return resource;
  },

  async createResource(creatorId: string, data: CreateResourcePayload) {
    return resourcesRepository.create({
      ...data,
      creatorId,
    });
  },

  async updateResource(id: string, data: UpdateResourcePayload) {
    const existing = await resourcesRepository.findById(id);
    if (!existing) {
      throw new ResourceNotFoundError();
    }
    if (existing.status === "ARCHIVED") {
      throw new ResourceArchivedError();
    }
    
    return resourcesRepository.update(id, data);
  },

  async deleteResource(id: string) {
    const existing = await resourcesRepository.findById(id);
    if (!existing) {
      throw new ResourceNotFoundError();
    }
    
    return resourcesRepository.delete(id);
  }
};
