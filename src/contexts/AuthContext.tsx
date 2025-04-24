'use client';

import { createContext, PropsWithChildren, useEffect, useState } from 'react';

import { useAuth } from '@/hooks/auth/useAuth';

type AuthContextType = {
  userId: string | null;
  authLoading?: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userId, setUserId] = useState<string | null>(null);

  const { data, isFetching: authLoading } = useAuth({
    options: { retry: false },
  });

  useEffect(() => {
    if (data) setUserId(data.userId);
  }, [data]);

  return (
    <AuthContext.Provider value={{ userId, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
