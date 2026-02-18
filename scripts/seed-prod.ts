import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
const envPath = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv.config({ path: envPath });

// Initialize Prisma client based on environment
let prisma: PrismaClient;

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (tursoUrl && tursoAuthToken && tursoUrl.startsWith('libsql://')) {
    console.log('🔌 Using Turso database...');
    console.log(`   URL: ${tursoUrl}`);
    const adapter = new PrismaLibSql({
        url: tursoUrl,
        authToken: tursoAuthToken,
    });
    prisma = new PrismaClient({ adapter });
} else if (tursoUrl && tursoUrl.startsWith('libsql://')) {
    console.log('🔌 Using Turso database without auth token...');
    console.log(`   URL: ${tursoUrl}`);
    const adapter = new PrismaLibSql({
        url: tursoUrl,
    });
    prisma = new PrismaClient({ adapter });
} else {
    console.log('💾 Using local SQLite database...');
    const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
    const filename = dbUrl.replace('file:', '').trim();
    const resolvedPath = path.isAbsolute(filename) ? filename : path.join(process.cwd(), filename);
    console.log(`   Path: ${resolvedPath}`);
    const adapter = new PrismaBetterSqlite3({ url: resolvedPath });
    prisma = new PrismaClient({ adapter });
}

const ADMIN_EMAIL = 'uvmarketsignal@gmail.com';
const ADMIN_PASSWORD = 'Admin@123456';

async function main() {
    console.log('🌱 Starting production seed...\n');

    try {
        // Test database connection
        console.log('Testing database connection...');
        await prisma.$connect();
        console.log('✅ Database connection successful\n');

        // Check if admin user exists
        console.log('Checking for admin user...');
        const existing = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL },
        });

        if (!existing) {
            console.log('Creating admin user...');
            const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
            const admin = await prisma.user.create({
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
            console.log(`   ID: ${admin.id}`);
            console.log(`   Email: ${ADMIN_EMAIL}`);
            console.log(`   Password: ${ADMIN_PASSWORD}`);
            console.log(`   Role: ${admin.role}`);
        } else {
            console.log('✅ Admin user already exists, skipping creation.');
            console.log(`   ID: ${existing.id}`);
            console.log(`   Email: ${existing.email}`);
            console.log(`   Role: ${existing.role}`);
            console.log(`   isActive: ${existing.isActive}`);
        }

        // Create default app settings if they don't exist
        console.log('\nChecking for app settings...');
        const existingSettings = await prisma.appSettings.findUnique({
            where: { id: 'default' },
        });

        if (!existingSettings) {
            console.log('Creating default app settings...');
            const settings = await prisma.appSettings.create({
                data: {
                    id: 'default',
                    appName: 'UV Market School',
                    tagline: 'Professional Trading Signals',
                    primaryColor: '#7c3aed',
                    companyName: 'UV Market School',
                    gstPercent: 18,
                },
            });
            console.log('✅ Default app settings created:');
            console.log(`   App Name: ${settings.appName}`);
            console.log(`   Company: ${settings.companyName}`);
        } else {
            console.log('✅ App settings already exist, skipping creation.');
        }

        console.log('\n🌱 Production seed completed successfully!');
        console.log('\n📋 Admin Credentials:');
        console.log(`   Email: ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
        console.log('\n⚠️  IMPORTANT: Change the admin password after first login!');

    } catch (error) {
        console.error('\n❌ Seed failed:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Stack trace:', error.stack);
        }
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
