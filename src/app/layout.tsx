import { Box } from '@chakra-ui/react';
import type { Metadata } from 'next';

import { NavHeader } from '@/components/NavHeader';
import { Provider } from '@/components/ui/provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/lib/providers/QueryProvider';

import './globals.css';

export const metadata: Metadata = {
  title: 'InterFlow',
  description:
    'A social network for communities based on interests and hobbies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <QueryProvider>
          <AuthProvider>
            <Provider defaultTheme='light'>
              <NavHeader />
              <Box as='main'>{children}</Box>
            </Provider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
