'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

const client = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export const QueryProvider = ({ children }: PropsWithChildren) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
