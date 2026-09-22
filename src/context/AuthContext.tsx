import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; address?: string; city?: string; password?: string }) => Promise<void>;
  logout: () => void;
  switchDemoUser: (role: 'admin' | 'customer') => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hf_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to initial customer so user can immediately experience the store without friction
    return INITIAL_USERS[1];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('hf_user_session', JSON.stringify(user));
      localStorage.setItem('hf_auth_token', `hf_token_${user.id}_session`);
    } else {
      localStorage.removeItem('hf_user_session');
      localStorage.removeItem('hf_auth_token');
    }
  }, [user]);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
    } catch (err: any) {
      // Fallback matching
      const found = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
      } else {
        throw new Error(err?.message || 'Login failed. Check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; phone: string; address?: string; city?: string; password?: string }) => {
    setLoading(true);
    try {
      const res = await api.register(data);
      setUser(res.user);
    } catch (err: any) {
      // Fallback
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'customer',
        address: data.address || '',
        city: data.city || 'Karachi',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchDemoUser = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setUser(INITIAL_USERS[0]);
    } else {
      setUser(INITIAL_USERS[1]);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    try {
      const updated = await api.updateUser(user.id, data);
      setUser(updated);
    } catch {
      setUser((prev) => (prev ? { ...prev, ...data } : null));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        switchDemoUser,
        updateProfile,
      }}
    >
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
