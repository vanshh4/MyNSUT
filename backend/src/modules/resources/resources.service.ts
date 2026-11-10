import { resourcesRepository } from "./resources.repository.js";
import { ResourceNotFoundError, ResourceArchivedError } from "./resources.errors.js";
import type { CreateResourcePayload, UpdateResourcePayload, ResourceFilters } from "@mynsut/shared";
import type { Prisma, ResourceType, ResourceStatus } from "@prisma/client";

export const resourcesService = {
  async getResources(filters: ResourceFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ResourceWhereInput = {};

    if (filters.status) {
      where.status = filters.status as ResourceStatus;
    }
    
    if (filters.resourceType) {
      where.resourceType = filters.resourceType as ResourceType;
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
        { subjectName: { contains: filters.query, mode: "insensitive" } },
        { subjectCode: { contains: filters.query, mode: "insensitive" } },
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
    const createData: Prisma.ResourceUncheckedCreateInput = {
      title: data.title,
      subjectCode: data.subjectCode,
      subjectName: data.subjectName,
      fileUrl: data.fileUrl,
      resourceType: data.resourceType as ResourceType,
      status: (data.status as ResourceStatus) || "DRAFT",
      creatorId,
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.department !== undefined ? { department: data.department } : {}),
      ...(data.semester !== undefined ? { semester: data.semester } : {}),
      ...(data.academicYear !== undefined ? { academicYear: data.academicYear } : {}),
      ...(data.examSession !== undefined ? { examSession: data.examSession } : {}),
      ...(data.source !== undefined ? { source: data.source } : {}),
    };
    return resourcesRepository.create(createData);
  },

  async updateResource(id: string, data: UpdateResourcePayload) {
    const existing = await resourcesRepository.findById(id);
    if (!existing) {
      throw new ResourceNotFoundError();
    }
    if (existing.status === "ARCHIVED") {
      throw new ResourceArchivedError();
    }
    
    const updateData: Prisma.ResourceUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.resourceType !== undefined) updateData.resourceType = data.resourceType as ResourceType;
    if (data.subjectCode !== undefined) updateData.subjectCode = data.subjectCode;
    if (data.subjectName !== undefined) updateData.subjectName = data.subjectName;
    if (data.department !== undefined) updateData.department = data.department;
    if (data.semester !== undefined) updateData.semester = data.semester;
    if (data.academicYear !== undefined) updateData.academicYear = data.academicYear;
    if (data.examSession !== undefined) updateData.examSession = data.examSession;
    if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.status !== undefined) updateData.status = data.status as ResourceStatus;

    return resourcesRepository.update(id, updateData);
  },

  async deleteResource(id: string) {
    const existing = await resourcesRepository.findById(id);
    if (!existing) {
      throw new ResourceNotFoundError();
    }
    
    return resourcesRepository.delete(id);
  }
};
