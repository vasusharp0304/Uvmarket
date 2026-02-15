'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import DisclaimerModal from './DisclaimerModal';

const Chatbot = dynamic(() => import('./Chatbot'), { ssr: false });

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <DisclaimerModal />
            {children}
            <Chatbot />
        </SessionProvider>
    );
}
