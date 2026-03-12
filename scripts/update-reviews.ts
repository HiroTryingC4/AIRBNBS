import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating reviews to set isPublished = true...');
  
  const result = await prisma.review.updateMany({
    where: {
      isPublished: false
    },
    data: {
      isPublished: true
    }
  });
  
  console.log(`Updated ${result.count} reviews`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
