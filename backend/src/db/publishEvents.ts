import { prisma } from "./prisma.js";

async function main() {
  const result = await prisma.event.updateMany({
    where: {
      status: "DRAFT"
    },
    data: {
      status: "PUBLISHED"
    }
  });
  console.log(`Updated ${result.count} events to PUBLISHED.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
