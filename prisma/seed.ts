import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const a = await prisma.company.upsert({
    where: { id: "seed-company-demo" },
    update: {},
    create: {
      id: "seed-company-demo",
      name: "Demo Partner A/S",
      website: "https://example.com",
    },
  });

  await prisma.student.upsert({
    where: { id: "seed-student-seeking" },
    update: {},
    create: {
      id: "seed-student-seeking",
      displayName: "Demo Elev (søgende)",
      status: "SEEKING",
      note: "Eksempel fra seed",
      createdBySub: "seed",
    },
  });

  await prisma.student.upsert({
    where: { id: "seed-student-placed" },
    update: {},
    create: {
      id: "seed-student-placed",
      displayName: "Demo Elev (placeret)",
      status: "PLACED",
      companyId: a.id,
      createdBySub: "seed",
    },
  });

  console.log("Seed færdig: demo-partner og to elever.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
