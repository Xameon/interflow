import type { Metadata } from 'next';
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
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
