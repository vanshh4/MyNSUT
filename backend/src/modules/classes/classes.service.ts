import { prisma } from "../../db/prisma.js";
import { classErrors } from "./classes.errors.js";
import * as classesRepository from "./classes.repository.js";
import { logAction } from "../audit/audit.service.js";
import { AUDIT_ACTIONS } from "../../constants/audit.js";

export async function getClassDetails(classId: string, userId?: string) {
  const academicClass = await classesRepository.findClassById(prisma, classId);
  if (!academicClass) throw classErrors.classNotFound();

  let isCr = false;
  if (userId) {
    const existingRole = await classesRepository.findActiveCrRoleForStudent(prisma, classId, userId);
    if (existingRole) isCr = true;
  }

  return { ...academicClass, isCr };
}

export async function getClassMembers(classId: string) {
  const academicClass = await classesRepository.findClassById(prisma, classId);
  if (!academicClass) throw classErrors.classNotFound();
  
  const members = await classesRepository.findClassMembers(prisma, classId);
  return members.map(m => ({
    id: m.id,
    userId: m.userId,
    fullName: m.user.fullName,
    email: m.user.email,
    profileImageUrl: m.user.profileImageUrl,
    rollNumber: m.rollNumber,
    umsRollNumber: m.umsRollNumber,
  }));
}

export async function assignClassCr(classId: string, studentId: string, actorId: string, actorIp?: string) {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({ where: { id: studentId } });
    if (!student || student.classId !== classId) throw classErrors.memberNotFound();

    const existing = await classesRepository.findActiveCrRoleForStudent(tx, classId, student.userId);
    if (existing) throw classErrors.invalidAssignment();

    const role = await classesRepository.assignCrRole(tx, classId, student.userId, actorId);
    
    await logAction(
      tx,
      actorId,
      AUDIT_ACTIONS.CLASS_ROLE_ASSIGNED,
      "CLASS_ROLE",
      role.id,
      student.userId,
      { classId, roleCode: "CLASS_CR" },
      actorIp
    );
    return role;
  });
}

export async function revokeClassCr(classId: string, studentId: string, actorId: string, actorIp?: string) {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({ where: { id: studentId } });
    if (!student || student.classId !== classId) throw classErrors.memberNotFound();

    const existing = await classesRepository.findActiveCrRoleForStudent(tx, classId, student.userId);
    if (!existing) throw classErrors.invalidAssignment();

    const revoked = await classesRepository.revokeCrRole(tx, existing.id, actorId);
    
    await logAction(
      tx,
      actorId,
      AUDIT_ACTIONS.CLASS_ROLE_REVOKED,
      "CLASS_ROLE",
      existing.id,
      student.userId,
      { classId, roleCode: "CLASS_CR" },
      actorIp
    );
    return revoked;
  });
}

export async function listClasses() {
  return classesRepository.listClasses(prisma);
}

