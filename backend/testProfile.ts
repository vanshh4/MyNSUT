import { PrismaClient } from "@prisma/client";
import { getStudentOwnProfile } from "./src/modules/profiles/profiles.service.js";

const prisma = new PrismaClient();

async function main() {
  const student = await prisma.student.findFirst();
  if (!student) return;
  try {
    const profile = await getStudentOwnProfile(student.userId);
    console.log("ROLES:", JSON.stringify(profile.roles, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
  await prisma.$disconnect();
}
main();
