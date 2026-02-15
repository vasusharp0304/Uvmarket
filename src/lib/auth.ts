import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email.toLowerCase() },
                });

                if (!user) {
                    throw new Error('No account found with this email');
                }

                if (!user.isActive) {
                    throw new Error('Your account has been deactivated. Contact support.');
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    subscriptionStatus: user.subscriptionStatus,
                    subscriptionExpiresAt: user.subscriptionExpiresAt?.toISOString() || null,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.subscriptionStatus = user.subscriptionStatus;
                token.subscriptionExpiresAt = user.subscriptionExpiresAt;
            }

            // Allow session updates
            if (trigger === 'update' && session) {
                if (session.subscriptionStatus) {
                    token.subscriptionStatus = session.subscriptionStatus;
                }
                if (session.subscriptionExpiresAt !== undefined) {
                    token.subscriptionExpiresAt = session.subscriptionExpiresAt;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.subscriptionStatus = token.subscriptionStatus as string;
                session.user.subscriptionExpiresAt = token.subscriptionExpiresAt as string | null;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
