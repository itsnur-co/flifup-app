/**
 * Auth Context
 * Manages authentication state across the app
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, authService } from '@/services/api/auth.service';
import { getUserData, getRefreshToken, removeTokens, removeUserData } from '@/utils/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  /**
   * Load user data from storage on app start
   */
  const loadUser = async () => {
    console.log('[AuthContext] Loading user data from storage...');
    try {
      const userData = await getUserData();
      if (userData) {
        console.log('[AuthContext] User data found:', userData.email || userData.name || 'unknown');
        setUser(userData);
      } else {
        console.log('[AuthContext] No user data found in storage');
      }
    } catch (error) {
      console.error('[AuthContext] Error loading user:', error);
    } finally {
      console.log('[AuthContext] Finished loading user, setting isLoading to false');
      setIsLoading(false);
    }
  };

  /**
   * Set user after successful login/signup
   */
  const login = (userData: User) => {
    console.log('[AuthContext] Login called with user:', userData.email || userData.fullName);
    setUser(userData);
    console.log('[AuthContext] User state updated, isAuthenticated will be true');
  };

  /**
   * Logout user and clear storage
   */
  const logout = async () => {
    console.log('[AuthContext] Starting logout process...');
    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        console.log('[AuthContext] Calling logout API...');
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('[AuthContext] Logout API error:', error);
    } finally {
      // Always clear local state and storage
      console.log('[AuthContext] Clearing user state and storage...');
      setUser(null);
      await removeTokens();
      await removeUserData();
      console.log('[AuthContext] Logout complete - user state cleared');
    }
  };

  /**
   * Refresh user data from storage
   */
  const refreshUser = async () => {
    const userData = await getUserData();
    if (userData) {
      setUser(userData);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
