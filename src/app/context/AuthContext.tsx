import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USER, User } from '../data/mock';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simular sesión persistente
    const stored = localStorage.getItem('vet_app_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = () => {
    // En una app real, aquí iría la validación contra Supabase
    setUser(MOCK_USER);
    localStorage.setItem('vet_app_user', JSON.stringify(MOCK_USER));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vet_app_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
