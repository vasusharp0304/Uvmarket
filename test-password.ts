import bcrypt from 'bcryptjs';
import { PrismaClient } from './src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

async function main() {
  const dbPath = path.join(process.cwd(), 'dev.db');
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  const prisma = new PrismaClient({ adapter });

  const admin = await prisma.user.findUnique({
    where: { email: 'uvmarketsignal@gmail.com' }
  });

  if (!admin) {
    console.log('Admin user not found');
    return;
  }

  const password = 'Admin@123456';
  const isMatch = await bcrypt.compare(password, admin.passwordHash);

  console.log('Password to test:', password);
  console.log('Hash:', admin.passwordHash);
  console.log('Password match:', isMatch);

  await prisma.$disconnect();
}

main().catch(console.error);
