import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { supabase } from '../utils/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string, role?: 'CLIENTE' | 'CAFICULTOR') => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email?: string, name?: string) => {
    try {
      // First attempt to get existing profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, let's try to create it if we have info
        // This is a safety net for users returning from email confirmation
        if (email) {
          const { data: newData, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: email,
              name: name || email.split('@')[0],
              role: (await supabase.auth.getUser()).data.user?.user_metadata?.role || 'CLIENTE',
            })
            .select()
            .single();

          if (insertError) throw insertError;
          setUser(newData);
        } else {
          // If no email, we might be in a weird state, but let's try to look up user from auth
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            const { data: retryData, error: retryError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                email: authUser.email!,
                name: authUser.user_metadata?.full_name || authUser.email!.split('@')[0],
                role: authUser.user_metadata?.role || 'CLIENTE',
              })
              .select()
              .single();
            if (retryError) throw retryError;
            setUser(retryData);
          }
        }
      } else if (error) {
        throw error;
      } else {
        setUser(data);
      }
    } catch (error: any) {
      console.error('Error in fetchProfile:', error.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'CLIENTE' | 'CAFICULTOR' = 'CLIENTE'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            name,
            role,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError.message);
        }

        toast.success('¡Registro exitoso!', {
          description: 'Revisa tu correo para confirmar tu cuenta si es necesario.'
        });
        return true;
      }
    } catch (error: any) {
      toast.error(`Error al registrar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchProfile(data.user.id);
        toast.success(`¡Bienvenido!`);
        return true;
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success('Sesión cerrada correctamente');
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, isLoading }}>
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
