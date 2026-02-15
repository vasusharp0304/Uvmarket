import 'dotenv/config';

import { prisma } from '@/lib/prisma';

const run = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful.');
  } catch (error) {
    console.error('❌ Database connection failed.', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

run();
