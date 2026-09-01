import type { Prisma, PrismaClient } from "@prisma/client";
import type { ClassAnnouncementPayload } from "@mynsut/shared/types/class";

export type AnnouncementDbClient = PrismaClient | Prisma.TransactionClient;

export function findAnnouncementsByClassId(client: AnnouncementDbClient, classId: string) {
  return client.classAnnouncement.findMany({
    where: { classId },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profileImageUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function findAnnouncementById(client: AnnouncementDbClient, id: string) {
  return client.classAnnouncement.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profileImageUrl: true,
        },
      },
    },
  });
}

export function createAnnouncement(
  client: AnnouncementDbClient,
  classId: string,
  authorId: string,
  data: ClassAnnouncementPayload
) {
  return client.classAnnouncement.create({
    data: {
      classId,
      authorId,
      title: data.title,
      content: data.content,
      attachments: data.attachments as unknown as Prisma.InputJsonValue,
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profileImageUrl: true,
        },
      },
    },
  });
}

export function updateAnnouncement(
  client: AnnouncementDbClient,
  id: string,
  data: Partial<ClassAnnouncementPayload>
) {
  const cleanData = Object.fromEntries(
    Object.entries({
      title: data.title,
      content: data.content,
      attachments: data.attachments !== undefined ? (data.attachments as unknown as Prisma.InputJsonValue) : undefined,
    }).filter(([_, v]) => v !== undefined)
  ) as any;
  
  return client.classAnnouncement.update({
    where: { id },
    data: cleanData,
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profileImageUrl: true,
        },
      },
    },
  });
}

export function deleteAnnouncement(client: AnnouncementDbClient, id: string) {
  return client.classAnnouncement.delete({
    where: { id },
  });
}
