import type { Prisma, PrismaClient } from "@prisma/client";
import type { ClassTaskPayload } from "@mynsut/shared/types/class";

export type TaskDbClient = PrismaClient | Prisma.TransactionClient;

export function findTasksByClassId(client: TaskDbClient, classId: string) {
  return client.classTask.findMany({
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

export function findTaskById(client: TaskDbClient, id: string) {
  return client.classTask.findUnique({
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

export function createTask(
  client: TaskDbClient,
  classId: string,
  authorId: string,
  data: ClassTaskPayload
) {
  return client.classTask.create({
    data: {
      classId,
      authorId,
      title: data.title,
      description: data.description ?? null,
      taskType: data.taskType,
      url: data.url ?? null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
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

export function updateTask(
  client: TaskDbClient,
  id: string,
  data: Partial<ClassTaskPayload>
) {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined)) as any;
  return client.classTask.update({
    where: { id },
    data: {
      ...cleanData,
      dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
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

export function deleteTask(client: TaskDbClient, id: string) {
  return client.classTask.delete({
    where: { id },
  });
}

export function getTaskCompletions(client: TaskDbClient, taskId: string) {
  return client.classTaskCompletion.findMany({
    where: { taskId },
  });
}

export function completeTask(client: TaskDbClient, taskId: string, studentId: string) {
  return client.classTaskCompletion.upsert({
    where: {
      taskId_studentId: {
        taskId,
        studentId,
      },
    },
    update: {},
    create: {
      taskId,
      studentId,
    },
  });
}
