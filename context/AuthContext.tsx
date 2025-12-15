import React, { createContext, useContext, useState } from 'react';

import { Tip } from '../components/GlobalTip';
import { userApi } from '../services/modules/user';
import { AuthContextType } from '../types';
import { User, UserLoginResponse } from '../types/auth';
import { useLanguage } from './LanguageContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLanguage();

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (account: string, password: string) => {
    setIsLoading(true);
    try {
      const result: UserLoginResponse = await userApi.login({ account, password });
      setUser(result.user);
      if (result.role.includes('admin')) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Login failed', error);
      Tip.error(t('auth.login.error'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
