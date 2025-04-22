'use client';

import { createContext, PropsWithChildren, useEffect, useState } from 'react';

import { useAuth } from '@/hooks/auth/useAuth';

type AuthContextType = {
  userId: string | null;
  authLoading?: boolean;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const { data, isFetching: authLoading } = useAuth({
    options: { enabled: !!token, retry: false },
  });

  const logout = () => {
    localStorage.removeItem('token');

    window.location.replace('/');
  };

  useEffect(() => {
    const storageToken = localStorage.getItem('token');

    setToken(storageToken);
  }, []);

  useEffect(() => {
    if (data) setUserId(data.userId);
  }, [data]);

  return (
    <AuthContext.Provider value={{ userId, authLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
