import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../hooks/apiClient';
import type { User } from '../types/user';
import { toast } from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
  login : (accessToken: string, refreshToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;

}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/v1/auth/user');
      // console.log(response.data.data)
      setUser(response?.data?.data);
    } catch (err: any) {
      setUser(null);
      if (err.response?.status !== 401) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load user profile');
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      await apiClient.post('/api/v1/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
      window.location.href = '/login';
    } catch (err: any) {
      console.error('Logout failed:', err);
      toast.error('Logout failed');
    }
  };
//create a login fucntionality here with parameters accessToken and refreshToken
const login = async (accessToken: string, refreshToken: string) => {
  try {
    setLoading(true);
    setError(null);
    const response = await apiClient.post('/api/v1/auth/set-token', {
      accessToken,
      refreshToken,
    }, { withCredentials: true });
    setUser(response.data.data);
    toast.success('Login successful!');
 
  } catch (err: any) {
    console.error('Login failed:', err);
    setUser(null);
    setError('Login failed');
    toast.error('Login failed');
    throw err; 
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    // The following was previously commented out, which prevented
    // the user's session from being retrieved upon refreshing or loading the app.
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, fetchProfile, logout ,login}}>
      {children}
    </AuthContext.Provider>
  );
};

