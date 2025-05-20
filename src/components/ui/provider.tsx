'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import system from '@/lib/theme';

export function Provider({
  children,
  defaultTheme = 'light',
}: {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark';
}) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme={defaultTheme}
      enableSystem
      disableTransitionOnChange
    >
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </NextThemesProvider>
  );
}
