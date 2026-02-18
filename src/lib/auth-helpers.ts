import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
    const session = await getServerSession(authOptions);
    return session?.user?.role === 'ADMIN';
}

/**
 * Get the current authenticated session
 */
export async function getAuthSession() {
    return await getServerSession(authOptions);
}

/**
 * Require admin access - throws error if not admin
 */
export async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized: Admin access required');
    }
    return session;
}
