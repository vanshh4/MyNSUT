import { prisma } from "./prisma.js";
import { societyPositionsService } from "../modules/societyPositions/societyPositions.service.js";

async function main() {
  const societyId = '6e713753-ae1c-45a4-a250-2847f5e89073'; // Crosslinks
  const actorId = 'e207dcf1-2a42-4dc4-b3d9-95e54d5ed704'; // Admin user id (just put an existing admin user id or we can use 3324 user)
  // Get an admin user id
  const admin = await prisma.user.findFirst();

  console.log("Creating position...");
  const pos = await societyPositionsService.createPosition(societyId, admin!.id, {
    title: "President",
    canAssignPOR: true,
    canManageMembers: true,
    canPostAnnouncements: true,
  }, "127.0.0.1", true); // isAdmin = true

  console.log("Created position:", pos);

  console.log("Assigning position...");
  const assignment = await societyPositionsService.assignPosition(societyId, admin!.id, {
    userId: "3324", // Vansh roll number
    positionId: pos.id,
  }, "127.0.0.1", true);

  console.log("Assigned position:", assignment);
}

main().catch(console.error).finally(() => prisma.$disconnect());
