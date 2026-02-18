import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = 'uvmarketsignal@gmail.com';
const ADMIN_PASSWORD = 'Admin@123456';

/**
 * POST /api/admin/seed
 * 
 * Seeds the database with initial admin user and app settings.
 * This endpoint is safe to call multiple times - it will only create
 * records if they don't already exist.
 * 
 * For production deployments, you may want to add additional
 * authentication or a secret token check.
 */
export async function POST() {
    try {
        console.log('🌱 Starting database seed...');

        const results = {
            adminCreated: false,
            settingsCreated: false,
            errors: [] as string[],
        };

        // Check if admin user exists
        console.log('Checking for admin user...');
        const existingAdmin = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL },
        });

        if (!existingAdmin) {
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
            console.log('✅ Admin user created:', admin.id);
            results.adminCreated = true;
        } else {
            console.log('✅ Admin user already exists:', existingAdmin.id);
        }

        // Create default app settings if they don't exist
        console.log('Checking for app settings...');
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
            console.log('✅ Default app settings created:', settings.id);
            results.settingsCreated = true;
        } else {
            console.log('✅ App settings already exist');
        }

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
            results,
            adminEmail: ADMIN_EMAIL,
            notes: 'If this is your first deployment, log in with the provided credentials and change the password immediately.',
        });

    } catch (error) {
        console.error('❌ Seed error:', error);
        
        let errorMessage = 'Failed to seed database';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { 
                success: false, 
                error: errorMessage,
                details: error instanceof Error ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/admin/seed
 * 
 * Returns the current seed status without modifying the database.
 */
export async function GET() {
    try {
        const adminUser = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL },
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });

        const appSettings = await prisma.appSettings.findUnique({
            where: { id: 'default' },
            select: {
                id: true,
                appName: true,
                companyName: true,
            },
        });

        return NextResponse.json({
            status: 'ready',
            adminExists: !!adminUser,
            settingsExist: !!appSettings,
            adminUser: adminUser ? {
                id: adminUser.id,
                email: adminUser.email,
                role: adminUser.role,
                isActive: adminUser.isActive,
                createdAt: adminUser.createdAt,
            } : null,
            appSettings: appSettings ? {
                id: appSettings.id,
                appName: appSettings.appName,
                companyName: appSettings.companyName,
            } : null,
            message: 'Use POST request to seed the database',
        });

    } catch (error) {
        console.error('Error checking seed status:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to check seed status',
            },
            { status: 500 }
        );
    }
}
