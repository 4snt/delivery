'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import AuthTokenProvider from './AuthTokenProvider';
import { OrderProvider } from '@/contexts';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthTokenProvider>
        <OrderProvider>
          {children}
        </OrderProvider>
      </AuthTokenProvider>
    </SessionProvider>
  );
}
