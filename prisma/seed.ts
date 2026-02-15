import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

// Helper to generate dates in the past
function getPastDate(daysAgo: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
}

// Helper to generate realistic exit prices based on direction and outcome
function calculateExitPrice(
    entryPrice: number,
    targetPrice: number,
    stopLossPrice: number,
    direction: string,
    status: string
): number | null {
    if (status === 'ACTIVE' || status === 'PENDING') return null;

    const targetDistance = Math.abs(targetPrice - entryPrice);
    const stopDistance = Math.abs(stopLossPrice - entryPrice);

    if (status === 'TARGET_HIT') {
        // Exit near target (90-100% of target reached)
        const variance = Math.random() * 0.1;
        return direction === 'BUY'
            ? targetPrice - (targetDistance * variance)
            : targetPrice + (targetDistance * variance);
    }

    if (status === 'STOP_LOSS') {
        // Exit near stop loss
        const variance = Math.random() * 0.05;
        return direction === 'BUY'
            ? stopLossPrice - (stopDistance * variance)
            : stopLossPrice + (stopDistance * variance);
    }

    if (status === 'CLOSED_MANUAL') {
        // Exit somewhere in between
        const ratio = 0.3 + Math.random() * 0.4;
        return direction === 'BUY'
            ? entryPrice + (targetDistance * ratio)
            : entryPrice - (targetDistance * ratio);
    }

    return null;
}

// Helper to calculate return percentage
function calculateReturnPercent(
    entryPrice: number,
    exitPrice: number | null,
    direction: string
): number | null {
    if (!exitPrice) return null;
    const profit = direction === 'BUY'
        ? exitPrice - entryPrice
        : entryPrice - exitPrice;
    return Math.round((profit / entryPrice) * 100 * 100) / 100;
}

// 20 Realistic Trading Signals
const SIGNALS_DATA = [
    // Large Cap - Blue Chip Stocks
    {
        symbol: 'RELIANCE',
        companyName: 'Reliance Industries Ltd',
        segment: 'Equity',
        signalType: 'Swing',
        direction: 'BUY',
        entryPrice: 2450.00,
        targetPrice: 2600.00,
        stopLossPrice: 2380.00,
        status: 'TARGET_HIT',
        daysAgo: 45,
        notes: 'Bullish flag pattern breakout with volume surge. Strong support at 200 DMA. Positive momentum in retail and digital segments.',
    },
    {
        symbol: 'TCS',
        companyName: 'Tata Consultancy Services Ltd',
        segment: 'Equity',
        signalType: 'Positional',
        direction: 'BUY',
        entryPrice: 3950.00,
        targetPrice: 4150.00,
        stopLossPrice: 3850.00,
        status: 'TARGET_HIT',
        daysAgo: 38,
        notes: 'Strong quarterly results beat expectations. Deal wins accelerating in AI and cloud segments. Technical breakout above resistance.',
    },
    {
        symbol: 'HDFCBANK',
        companyName: 'HDFC Bank Ltd',
        segment: 'Equity',
        signalType: 'Swing',
        direction: 'BUY',
        entryPrice: 1680.00,
        targetPrice: 1780.00,
        stopLossPrice: 1640.00,
        status: 'TARGET_HIT',
        daysAgo: 32,
        notes: 'Post-merger synergies visible. NIM expansion continuing. Strong bounce from 200 DMA support with institutional buying.',
    },
    {
        symbol: 'INFY',
        companyName: 'Infosys Ltd',
        segment: 'Equity',
        signalType: 'Intraday',
        direction: 'SELL',
        entryPrice: 1520.00,
        targetPrice: 1480.00,
        stopLossPrice: 1540.00,
        status: 'STOP_LOSS',
        daysAgo: 28,
        notes: 'Bearish engulfing pattern on hourly chart. Margins under pressure due to wage hikes. However, strong buying emerged at lower levels.',
    },
    {
        symbol: 'ICICIBANK',
        companyName: 'ICICI Bank Ltd',
        segment: 'Equity',
        signalType: 'Swing',
        direction: 'BUY',
        entryPrice: 985.00,
        targetPrice: 1050.00,
        stopLossPrice: 960.00,
        status: 'TARGET_HIT',
        daysAgo: 25,
        notes: 'Strong loan growth momentum. Asset quality improving. Breaking out of consolidation range with volume expansion.',
    },
    {
        symbol: 'SBIN',
        companyName: 'State Bank of India',
        segment: 'Equity',
        signalType: 'Positional',
        direction: 'BUY',
        entryPrice: 780.00,
        targetPrice: 830.00,
        stopLossPrice: 755.00,
        status: 'ACTIVE',
        daysAgo: 8,
        notes: 'Awaiting breakout confirmation above 785 level. PSU banking theme showing strength. NPA reduction continuing.',
    },
    {
        symbol: 'BHARTIARTL',
        companyName: 'Bharti Airtel Ltd',
        segment: 'Equity',
        signalType: 'Swing',
        direction: 'BUY',
        entryPrice: 1125.00,
        targetPrice: 1200.00,
        stopLossPrice: 1090.00,
        status: 'TARGET_HIT',
        daysAgo: 22,
        notes: 'ARPU improvement driving profitability. 5G rollout accelerating. Breaking out from ascending triangle pattern.',
    },
    {
        symbol: 'ITC',
        companyName: 'ITC Ltd',
        segment: 'Equity',
        signalType: 'Positional',
        direction: 'BUY',
        entryPrice: 425.00,
        targetPrice: 465.00,
        stopLossPrice: 410.00,
        status: 'CLOSED_MANUAL',
        daysAgo: 35,
        notes: 'FMCG growth accelerating. Hotel business recovery strong. Partial profits booked at resistance, holding remaining position.',
    },

    // Mid Cap Stocks
    {
        symbol: 'TATASTEEL',
        companyName: 'Tata Steel Ltd',
        segment: 'Equity',
        signalType: 'Swing',
        direction: 'BUY',
        entryPrice: 142.50,
        targetPrice: 155.00,
        stopLossPrice: 136.00,
        status: 'TARGET_HIT',
        daysAgo: 40,
        notes: 'Strong breakout above resistance with volume confirmation. China stimulus supporting metal prices. Cost reduction initiatives showing results.',
    },
    {
        symbol: 'ADANIPORTS',
        companyName: 'Adani Ports & SEZ Ltd',
        segment: 'Equity',
        signalType: 'Swing',
        direction: 'SELL',
        entryPrice: 1280.00,
        targetPrice: 1200.00,
        stopLossPrice: 1320.00,
        status: 'TARGET_HIT',
        daysAgo: 30,
        notes: 'Double top formation visible. Cargo volume growth slowing. Technical breakdown below key support level.',
    },
    {
        symbol: 'AXISBANK',
        companyName: 'Axis Bank Ltd',
        segment: 'Equity',
        signalType: 'Swing',
        direction: 'BUY',
        entryPrice: 1125.00,
        targetPrice: 1200.00,
        stopLossPrice: 1090.00,
        status: 'TARGET_HIT',
        daysAgo: 26,
        notes: 'CASA ratio improving. Retail loan growth healthy. Breaking out from cup and handle pattern.',
    },
    {
        symbol: 'WIPRO',
        companyName: 'Wipro Ltd',
        segment: 'Equity',
        signalType: 'Intraday',
        direction: 'BUY',
        entryPrice: 285.00,
        targetPrice: 295.00,
        stopLossPrice: 280.00,
        status: 'STOP_LOSS',
        daysAgo: 15,
        notes: 'Morning star pattern on hourly chart. However, broader IT weakness stopped out the position.',
    },

    // F&O Segment
    {
        symbol: 'NIFTY',
        companyName: 'Nifty 50 Index',
        segment: 'F&O',
        signalType: 'Intraday',
        direction: 'BUY',
        entryPrice: 22450.00,
        targetPrice: 22600.00,
        stopLossPrice: 22350.00,
        status: 'TARGET_HIT',
        daysAgo: 12,
        notes: 'Gap up opening with strong momentum. PCR indicating bullish sentiment. RSI breakout above 60.',
    },
    {
        symbol: 'BANKNIFTY',
        companyName: 'Bank Nifty Index',
        segment: 'F&O',
        signalType: 'Intraday',
        direction: 'SELL',
        entryPrice: 47800.00,
        targetPrice: 47400.00,
        stopLossPrice: 48000.00,
        status: 'TARGET_HIT',
        daysAgo: 10,
        notes: 'Evening star formation at resistance. Heavy call writing at 48000 strike. Momentum divergence visible.',
    },
    {
        symbol: 'FINNIFTY',
        companyName: 'FinNifty Index',
        segment: 'F&O',
        signalType: 'Intraday',
        direction: 'BUY',
        entryPrice: 21400.00,
        targetPrice: 21600.00,
        stopLossPrice: 21300.00,
        status: 'CLOSED_MANUAL',
        daysAgo: 7,
        notes: 'Ascending channel support held. Reduced exposure due to expiry week volatility. Partial profits booked.',
    },

    // High Momentum Stocks
    {
        symbol: 'ZOMATO',
        companyName: 'Zomato Ltd',
        segment: 'Equity',
        signalType: 'Swing',
        direction: 'BUY',
        entryPrice: 185.00,
        targetPrice: 210.00,
        stopLossPrice: 175.00,
        status: 'TARGET_HIT',
        daysAgo: 20,
        notes: 'Quick commerce growth surprising positively. Blinkit profitability improving. Technical breakout with volume surge.',
    },
    {
        symbol: 'DMART',
        companyName: 'Avenue Supermarts Ltd',
        segment: 'Equity',
        signalType: 'Positional',
        direction: 'BUY',
        entryPrice: 4250.00,
        targetPrice: 4500.00,
        stopLossPrice: 4100.00,
        status: 'ACTIVE',
        daysAgo: 15,
        notes: 'Store expansion continuing at steady pace. Same-store sales growth healthy. Consolidation breakout in progress.',
    },
    {
        symbol: 'TATAMOTORS',
        companyName: 'Tata Motors Ltd',
        segment: 'Equity',
        signalType: 'Swing',
        direction: 'BUY',
        entryPrice: 875.00,
        targetPrice: 925.00,
        stopLossPrice: 850.00,
        status: 'TARGET_HIT',
        daysAgo: 18,
        notes: 'JLR turnaround visible. EV momentum strong. Breaking out from multi-month consolidation.',
    },
    {
        symbol: 'MARUTI',
        companyName: 'Maruti Suzuki India Ltd',
        segment: 'Equity',
        signalType: 'Swing',
        direction: 'SELL',
        entryPrice: 11250.00,
        targetPrice: 10800.00,
        stopLossPrice: 11450.00,
        status: 'STOP_LOSS',
        daysAgo: 14,
        notes: 'Market share pressure from competition. SUV segment losing ground. However, buying emerged at support.',
    },

    // Commodity Play
    {
        symbol: 'COALINDIA',
        companyName: 'Coal India Ltd',
        segment: 'Equity',
        signalType: 'Positional',
        direction: 'BUY',
        entryPrice: 425.00,
        targetPrice: 465.00,
        stopLossPrice: 408.00,
        status: 'TARGET_HIT',
        daysAgo: 33,
        notes: 'Power demand surge supporting volumes. Dividend yield attractive. Breaking out from 6-month consolidation.',
    },
];

async function main() {
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
        console.log('✅ Admin user already exists.');
    }

    const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!admin) return;

    const signalCount = await prisma.signal.count();
    if (signalCount === 0) {
        const signalsWithCalculatedFields = SIGNALS_DATA.map((signal) => {
            const exitPrice = calculateExitPrice(
                signal.entryPrice,
                signal.targetPrice,
                signal.stopLossPrice,
                signal.direction,
                signal.status
            );
            const returnPercent = calculateReturnPercent(
                signal.entryPrice,
                exitPrice,
                signal.direction
            );

            return {
                createdById: admin.id,
                symbol: signal.symbol,
                companyName: signal.companyName,
                segment: signal.segment,
                signalType: signal.signalType,
                direction: signal.direction,
                entryPrice: signal.entryPrice,
                targetPrice: signal.targetPrice,
                stopLossPrice: signal.stopLossPrice,
                status: signal.status,
                exitPrice,
                returnPercent,
                notes: signal.notes,
                isVisibleToCustomers: true,
                entryDateTime: getPastDate(signal.daysAgo),
                exitDateTime: signal.status !== 'ACTIVE' && signal.status !== 'PENDING'
                    ? getPastDate(signal.daysAgo - Math.floor(Math.random() * 5) - 2)
                    : null,
            };
        });

        await prisma.signal.createMany({
            data: signalsWithCalculatedFields,
        });

        console.log(`✅ Created ${SIGNALS_DATA.length} realistic trading signals with detailed analysis`);

        // Print summary statistics
        const closedSignals = signalsWithCalculatedFields.filter(
            s => s.status === 'TARGET_HIT' || s.status === 'STOP_LOSS' || s.status === 'CLOSED_MANUAL'
        );
        const winners = closedSignals.filter(s => (s.returnPercent || 0) > 0);
        const losers = closedSignals.filter(s => (s.returnPercent || 0) < 0);

        const totalReturn = closedSignals.reduce((sum, s) => sum + (s.returnPercent || 0), 0);
        const avgReturn = totalReturn / closedSignals.length;

        console.log('\n📊 Signal Performance Summary:');
        console.log(`   Total Signals: ${SIGNALS_DATA.length}`);
        console.log(`   Closed Trades: ${closedSignals.length}`);
        console.log(`   Winners: ${winners.length} (${((winners.length / closedSignals.length) * 100).toFixed(1)}%)`);
        console.log(`   Losers: ${losers.length} (${((losers.length / closedSignals.length) * 100).toFixed(1)}%)`);
        console.log(`   Average Return: ${avgReturn.toFixed(2)}%`);
        console.log(`   Total P&L: ${totalReturn.toFixed(2)}%`);
    } else {
        console.log('✅ Signals already exist, skipping seed.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
