import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { MOCK_USERS, DEMO_CREDENTIALS } from '../utils/mockData';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('cafe_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check demo credentials
    const isCliente = 
      email === DEMO_CREDENTIALS.cliente.email && 
      password === DEMO_CREDENTIALS.cliente.password;
    
    const isCaficultor = 
      email === DEMO_CREDENTIALS.caficultor.email && 
      password === DEMO_CREDENTIALS.caficultor.password;

    if (isCliente || isCaficultor) {
      const foundUser = MOCK_USERS.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('cafe_user', JSON.stringify(foundUser));
        toast.success(`¡Bienvenido, ${foundUser.name}!`);
        setIsLoading(false);
        return true;
      }
    }

    toast.error('Credenciales incorrectas');
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cafe_user');
    toast.success('Sesión cerrada correctamente');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
