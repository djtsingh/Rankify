'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { analytics } from '../analytics';

// Auth Provider Types
export type AuthProvider = 'google' | 'microsoft' | 'email';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: AuthProvider;
  createdAt: string;
  lastLoginAt: string;
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt?: string;
  };
  preferences?: {
    theme: 'dark' | 'light' | 'system';
    notifications: boolean;
    newsletter: boolean;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEY = 'rankify_auth_user';
const SESSION_KEY = 'rankify_session';

// Generate unique ID
const generateId = () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Simulated OAuth popup flow
const simulateOAuthPopup = (provider: AuthProvider): Promise<{
  email: string;
  name: string;
  avatar: string;
}> => {
  return new Promise((resolve) => {
    // In production, this would open actual OAuth popup
    // For demo, we'll simulate with a delay
    setTimeout(() => {
      const mockUsers = {
        google: {
          email: 'demo.user@gmail.com',
          name: 'Demo User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
        },
        microsoft: {
          email: 'demo.user@outlook.com', 
          name: 'Demo User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=microsoft',
        },
        email: {
          email: '',
          name: '',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=email',
        },
      };
      resolve(mockUsers[provider]);
    }, 1500);
  });
};

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        const session = sessionStorage.getItem(SESSION_KEY);
        
        if (storedUser && session) {
          const user = JSON.parse(storedUser);
          // Update last login
          user.lastLoginAt = new Date().toISOString();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch {
        setState(prev => ({ ...prev, isLoading: false, error: 'Failed to restore session' }));
      }
    };

    initAuth();
  }, []);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const oauthData = await simulateOAuthPopup('google');
      
      // Check if user exists or create new
      const existingUsers = JSON.parse(localStorage.getItem('rankify_users') || '[]');
      let user = existingUsers.find((u: User) => u.email === oauthData.email);
      
      if (!user) {
        user = {
          id: generateId(),
          email: oauthData.email,
          name: oauthData.name,
          avatar: oauthData.avatar,
          provider: 'google' as AuthProvider,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          subscription: {
            plan: 'free' as const,
            status: 'active' as const,
          },
          preferences: {
            theme: 'dark' as const,
            notifications: true,
            newsletter: true,
          },
        };
        existingUsers.push(user);
        localStorage.setItem('rankify_users', JSON.stringify(existingUsers));
      } else {
        user.lastLoginAt = new Date().toISOString();
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      sessionStorage.setItem(SESSION_KEY, 'active');
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      // Track successful sign in
      analytics.trackEvent('login', {
        category: 'authentication',
        label: 'google',
        custom_parameters: {
          method: 'google',
          user_id: user.id,
          is_new_user: !existingUsers.find((u: User) => u.email === oauthData.email),
        },
      });
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to sign in with Google',
      }));

      // Track sign in failure
      analytics.trackEvent('login_error', {
        category: 'authentication',
        label: 'google',
        custom_parameters: {
          method: 'google',
          error: 'oauth_failed',
        },
      });
    }
  }, []);

  // Sign in with Microsoft
  const signInWithMicrosoft = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const oauthData = await simulateOAuthPopup('microsoft');
      
      const existingUsers = JSON.parse(localStorage.getItem('rankify_users') || '[]');
      let user = existingUsers.find((u: User) => u.email === oauthData.email);
      
      if (!user) {
        user = {
          id: generateId(),
          email: oauthData.email,
          name: oauthData.name,
          avatar: oauthData.avatar,
          provider: 'microsoft' as AuthProvider,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          subscription: {
            plan: 'free' as const,
            status: 'active' as const,
          },
          preferences: {
            theme: 'dark' as const,
            notifications: true,
            newsletter: true,
          },
        };
        existingUsers.push(user);
        localStorage.setItem('rankify_users', JSON.stringify(existingUsers));
      } else {
        user.lastLoginAt = new Date().toISOString();
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      sessionStorage.setItem(SESSION_KEY, 'active');
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      // Track successful sign in
      analytics.trackEvent('login', {
        category: 'authentication',
        label: 'microsoft',
        custom_parameters: {
          method: 'microsoft',
          user_id: user.id,
          is_new_user: !existingUsers.find((u: User) => u.email === oauthData.email),
        },
      });
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to sign in with Microsoft',
      }));

      // Track sign in failure
      analytics.trackEvent('login_error', {
        category: 'authentication',
        label: 'microsoft',
        custom_parameters: {
          method: 'microsoft',
          error: 'oauth_failed',
        },
      });
    }
  }, []);

  // Sign in with Email
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find existing user
      const existingUsers = JSON.parse(localStorage.getItem('rankify_users') || '[]');
      const user = existingUsers.find((u: User & { password?: string }) => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!user) {
        throw new Error('No account found with this email');
      }
      
      // Check password (in production, this would be hashed)
      const passwords = JSON.parse(localStorage.getItem('rankify_passwords') || '{}');
      if (passwords[email.toLowerCase()] !== password) {
        throw new Error('Incorrect password');
      }
      
      user.lastLoginAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      sessionStorage.setItem(SESSION_KEY, 'active');
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      // Track successful sign in
      analytics.trackEvent('login', {
        category: 'authentication',
        label: 'email',
        custom_parameters: {
          method: 'email',
          user_id: user.id,
          is_new_user: false,
        },
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to sign in',
      }));

      // Track sign in failure
      analytics.trackEvent('login_error', {
        category: 'authentication',
        label: 'email',
        custom_parameters: {
          method: 'email',
          error: err instanceof Error ? err.message : 'unknown_error',
        },
      });
    }
  }, []);

  // Sign up with Email
  const signUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Validate inputs
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('rankify_users') || '[]');
      const existingUser = existingUsers.find((u: User) => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }
      
      // Create new user
      const newUser: User = {
        id: generateId(),
        email: email.toLowerCase(),
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        provider: 'email',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        subscription: {
          plan: 'free',
          status: 'active',
        },
        preferences: {
          theme: 'dark',
          notifications: true,
          newsletter: true,
        },
      };
      
      // Store user and password
      existingUsers.push(newUser);
      localStorage.setItem('rankify_users', JSON.stringify(existingUsers));
      
      const passwords = JSON.parse(localStorage.getItem('rankify_passwords') || '{}');
      passwords[email.toLowerCase()] = password;
      localStorage.setItem('rankify_passwords', JSON.stringify(passwords));
      
      // Auto sign in after signup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      sessionStorage.setItem(SESSION_KEY, 'active');
      
      setState({
        user: newUser,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      // Track successful signup
      analytics.trackEvent('sign_up', {
        category: 'authentication',
        label: 'email',
        custom_parameters: {
          method: 'email',
          user_id: newUser.id,
        },
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to create account',
      }));

      // Track signup failure
      analytics.trackEvent('sign_up_error', {
        category: 'authentication',
        label: 'email',
        custom_parameters: {
          method: 'email',
          error: err instanceof Error ? err.message : 'unknown_error',
        },
      });
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });

      // Track sign out
      analytics.trackEvent('logout', {
        category: 'authentication',
        label: 'user_signout',
      });
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to sign out',
      }));
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would send an email
      // For demo, we'll just simulate success
      const existingUsers = JSON.parse(localStorage.getItem('rankify_users') || '[]');
      const user = existingUsers.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        // Don't reveal if email exists for security
        console.log('Password reset requested for:', email);
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      // Return success regardless (security best practice)
      return;
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to send reset email',
      }));
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: Partial<User>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!state.user) {
        throw new Error('No user logged in');
      }
      
      const updatedUser = { ...state.user, ...data };
      
      // Update in storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      
      // Update in users list
      const existingUsers = JSON.parse(localStorage.getItem('rankify_users') || '[]');
      const userIndex = existingUsers.findIndex((u: User) => u.id === state.user?.id);
      if (userIndex >= 0) {
        existingUsers[userIndex] = updatedUser;
        localStorage.setItem('rankify_users', JSON.stringify(existingUsers));
      }
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to update profile',
      }));
    }
  }, [state.user]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextType = {
    ...state,
    signInWithGoogle,
    signInWithMicrosoft,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
