import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Prisma client based on environment
let prisma: PrismaClient;

const databaseUrl = process.env.DATABASE_URL;
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

// Check for PostgreSQL (Railway)
if (databaseUrl && databaseUrl.startsWith('postgres://')) {
    console.log('🔌 Using PostgreSQL database...');
    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
}
// Check for Turso/LibSQL
else if (tursoUrl && tursoUrl.startsWith('libsql://')) {
    console.log('🔌 Using Turso database...');
    const adapter = new PrismaLibSql({
        url: tursoUrl,
        authToken: tursoAuthToken,
    });
    prisma = new PrismaClient({ adapter });
} else {
    // Fallback to local SQLite
    const dbPath = path.join(process.cwd(), 'dev.db');
    console.log('💾 Using local SQLite database...');
    const adapter = new PrismaBetterSqlite3({ url: dbPath });
    prisma = new PrismaClient({ adapter });
}

async function main() {
    // Create admin user
    const adminEmail = 'admin@uvmarketschool.com';
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existing) {
        const passwordHash = await bcrypt.hash('admin123', 12);
        await prisma.user.create({
            data: {
                name: 'UV Market Admin',
                email: adminEmail,
                passwordHash,
                role: 'ADMIN',
                isActive: true,
                subscriptionStatus: 'active',
            },
        });
        console.log('✅ Admin user created:');
        console.log('   Email: admin@uvmarketschool.com');
        console.log('   Password: admin123');
    } else {
        console.log('ℹ️  Admin user already exists.');
    }

    // Create some sample signals
    const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!admin) return;

    const signalCount = await prisma.signal.count();
    if (signalCount === 0) {
        await prisma.signal.createMany({
            data: [
                {
                    createdById: admin.id,
                    symbol: 'TATASTEEL',
                    companyName: 'Tata Steel Ltd',
                    segment: 'Equity',
                    signalType: 'Swing',
                    direction: 'BUY',
                    entryPrice: 142.50,
                    targetPrice: 155.00,
                    stopLossPrice: 136.00,
                    status: 'TARGET_HIT',
                    exitPrice: 154.80,
                    returnPercent: 8.63,
                    notes: 'Strong breakout above resistance with volume confirmation.',
                    isVisibleToCustomers: true,
                },
                {
                    createdById: admin.id,
                    symbol: 'RELIANCE',
                    companyName: 'Reliance Industries Ltd',
                    segment: 'Equity',
                    signalType: 'Swing',
                    direction: 'BUY',
                    entryPrice: 2450.00,
                    targetPrice: 2600.00,
                    stopLossPrice: 2380.00,
                    status: 'ACTIVE',
                    notes: 'Bullish flag pattern forming on daily chart.',
                    isVisibleToCustomers: true,
                },
                {
                    createdById: admin.id,
                    symbol: 'HDFCBANK',
                    companyName: 'HDFC Bank Ltd',
                    segment: 'Equity',
                    signalType: 'Positional',
                    direction: 'BUY',
                    entryPrice: 1680.00,
                    targetPrice: 1780.00,
                    stopLossPrice: 1640.00,
                    status: 'TARGET_HIT',
                    exitPrice: 1775.00,
                    returnPercent: 5.65,
                    notes: 'Bounce from 200 DMA support.',
                    isVisibleToCustomers: true,
                },
                {
                    createdById: admin.id,
                    symbol: 'INFY',
                    companyName: 'Infosys Ltd',
                    segment: 'Equity',
                    signalType: 'Intraday',
                    direction: 'SELL',
                    entryPrice: 1520.00,
                    targetPrice: 1480.00,
                    stopLossPrice: 1540.00,
                    status: 'STOP_LOSS',
                    exitPrice: 1540.00,
                    returnPercent: -1.32,
                    notes: 'Bearish engulfing candle on hourly chart.',
                    isVisibleToCustomers: true,
                },
                {
                    createdById: admin.id,
                    symbol: 'SBIN',
                    companyName: 'State Bank of India',
                    segment: 'Equity',
                    signalType: 'Swing',
                    direction: 'BUY',
                    entryPrice: 780.00,
                    targetPrice: 830.00,
                    stopLossPrice: 755.00,
                    status: 'PENDING',
                    notes: 'Awaiting breakout confirmation above 785 level.',
                    isVisibleToCustomers: true,
                },
                {
                    createdById: admin.id,
                    symbol: 'TCS',
                    companyName: 'Tata Consultancy Services',
                    segment: 'Equity',
                    signalType: 'Positional',
                    direction: 'BUY',
                    entryPrice: 3950.00,
                    targetPrice: 4150.00,
                    stopLossPrice: 3850.00,
                    status: 'TARGET_HIT',
                    exitPrice: 4140.00,
                    returnPercent: 4.81,
                    notes: 'Strong quarterly results catalyst.',
                    isVisibleToCustomers: true,
                },
            ],
        });
        console.log('✅ Sample signals created.');
    } else {
        console.log('ℹ️  Signals already exist, skipping seed.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
