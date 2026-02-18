import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

async function main() {
  const dbPath = path.join(process.cwd(), 'dev.db');
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  const prisma = new PrismaClient({ adapter });

  const admin = await prisma.user.findUnique({
    where: { email: 'uvmarketsignal@gmail.com' }
  });

  console.log('Admin user:', admin ? 'EXISTS' : 'NOT FOUND');
  if (admin) {
    console.log('ID:', admin.id);
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('isActive:', admin.isActive);
    console.log('Password hash length:', admin.passwordHash.length);
    console.log('Password hash:', admin.passwordHash.substring(0, 20) + '...');
  }

  await prisma.$disconnect();
}

main().catch(console.error);
