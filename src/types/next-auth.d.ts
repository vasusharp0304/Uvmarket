import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            subscriptionStatus: string;
            subscriptionExpiresAt: string | null;
        };
    }

    interface User {
        role: string;
        subscriptionStatus: string;
        subscriptionExpiresAt: string | null;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: string;
        subscriptionStatus: string;
        subscriptionExpiresAt: string | null;
    }
}
