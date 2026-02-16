import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// This endpoint is for one-time setup after deployment
// It should be protected and ideally disabled after initial setup
const ADMIN_EMAIL = 'uvmarketsignal@gmail.com';
const ADMIN_PASSWORD = 'Admin@123456';

const seedDatabase = async () => {
  try {
    // In production, verify the request is authorized
    // For initial deployment, you might want to add a token check here

    console.log('🌱 Seeding database...');

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
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
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
      console.log('✅ Default app settings created');
    } else {
      console.log('✅ App settings already exist');
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      adminEmail: ADMIN_EMAIL,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
};

export async function GET() {
  return seedDatabase();
}

export async function POST() {
  return seedDatabase();
}
