import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/health
 * 
 * Health check endpoint for Railway and monitoring.
 * Returns 200 if the application and database are healthy.
 */
export async function GET() {
    try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'connected',
            version: process.env.npm_package_version || '0.1.0',
        }, { status: 200 });
    } catch (error) {
        console.error('Health check failed:', error);

        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 503 });
    }
}
