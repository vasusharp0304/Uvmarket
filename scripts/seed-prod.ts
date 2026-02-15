import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';
import path from 'path';

// Initialize Prisma client based on environment
let prisma: PrismaClient;

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (tursoUrl && tursoAuthToken && tursoUrl.startsWith('libsql://')) {
  console.log('Using Turso database...');
  const adapter = new PrismaLibSql({
    url: tursoUrl,
    authToken: tursoAuthToken,
  });
  prisma = new PrismaClient({ adapter });
} else {
  console.log('Using local SQLite database...');
  const dbPath = path.join(process.cwd(), 'dev.db');
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  prisma = new PrismaClient({ adapter });
}

const ADMIN_EMAIL = 'uvmarketsignal@gmail.com';
const ADMIN_PASSWORD = 'Admin@123456';

async function main() {
  console.log('🌱 Starting production seed...');

  // Check if admin user exists
  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (!existing) {
    console.log('Creating admin user...');
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await prisma.user.create({
      data: {
        name: 'UV Market Admin',
        email: ADMIN_EMAIL,
        passwordHash,
        role: 'ADMIN',
        isActive: true,
        subscriptionStatus: 'active',
      },
    });
    console.log('✅ Admin user created:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
  } else {
    console.log('✅ Admin user already exists, skipping creation.');
  }

  // Create default app settings if they don't exist
  const existingSettings = await prisma.appSettings.findUnique({
    where: { id: 'default' },
  });

  if (!existingSettings) {
    console.log('Creating default app settings...');
    await prisma.appSettings.create({
      data: {
        id: 'default',
        appName: 'UV Market School',
        tagline: 'Professional Trading Signals',
        primaryColor: '#7c3aed',
        companyName: 'UV Market School',
        gstPercent: 18,
      },
    });
    console.log('✅ Default app settings created.');
  } else {
    console.log('✅ App settings already exist, skipping creation.');
  }

  console.log('🌱 Production seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
