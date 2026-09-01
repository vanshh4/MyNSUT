import { PrismaClient } from "@prisma/client";
import { getStudentPeerProfile } from "./src/modules/profiles/profiles.service.js";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst();
  const student = await prisma.student.findFirst();
  if (!admin || !student) return;
  
  try {
    const profile = await getStudentPeerProfile(admin.id, student.rollNumber);
    console.log(`ROLES for ${student.rollNumber}:`, JSON.stringify(profile.roles, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
  await prisma.$disconnect();
}
main();
