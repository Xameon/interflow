import type { Metadata } from 'next';
import './globals.css';
import { Provider } from '@/components/ui/provider';
import { NavHeader } from '@/components/NavHeader';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/lib/providers/QueryProvider';

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
      <body style={{ padding: '1rem' }}>
        <QueryProvider>
          <AuthProvider>
            <Provider>
              <header>
                <NavHeader />
              </header>
              <main>{children}</main>
            </Provider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
