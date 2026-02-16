import bcrypt from 'bcryptjs';
import { PrismaClient } from './src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

async function main() {
  const dbPath = path.join(process.cwd(), 'dev.db');
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  const prisma = new PrismaClient({ adapter });

  const credentials = {
    email: 'uvmarketsignal@gmail.com',
    password: 'Admin@123456'
  };

  console.log('Testing authentication with credentials:', credentials);

  if (!credentials?.email || !credentials?.password) {
    console.log('FAIL: Email and password are required');
    await prisma.$disconnect();
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email.toLowerCase() },
  });

  if (!user) {
    console.log('FAIL: No account found with this email');
    await prisma.$disconnect();
    return;
  }

  console.log('User found:', user.email, user.isActive);

  if (!user.isActive) {
    console.log('FAIL: Your account has been deactivated');
    await prisma.$disconnect();
    return;
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    console.log('FAIL: Invalid password');
    await prisma.$disconnect();
    return;
  }

  console.log('SUCCESS: Authentication successful');
  console.log('User ID:', user.id);
  console.log('User Role:', user.role);
  console.log('Subscription Status:', user.subscriptionStatus);

  await prisma.$disconnect();
}

main().catch(console.error);
