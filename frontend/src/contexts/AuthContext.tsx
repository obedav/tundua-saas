"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/lib/actions/auth';

export interface User {
  id: number;
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: "user" | "admin" | "super_admin";
  email_verified: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  logout: async () => {},
  checkAuth: async () => {},
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider - Centralized Authentication State Management
 *
 * This provider makes a SINGLE call to /api/auth/me and shares the result
 * across all components that need authentication state.
 *
 * This eliminates redundant API calls and improves performance.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    console.log('🔐 AuthContext: Checking authentication...');
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // Include cookies
      });

      console.log('🔐 AuthContext: Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ AuthContext: Authenticated as:', data.data?.email);
        setUser(data.data);
        setIsAuthenticated(true);
      } else {
        console.log('❌ AuthContext: Not authenticated');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("❌ AuthContext: Auth check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      // Use Server Action for logout (clears HttpOnly cookie)
      await logoutAction();
      // Clean up state
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even on error
      router.push("/auth/login");
    }
  }, [router]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
