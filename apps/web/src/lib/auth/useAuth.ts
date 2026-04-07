/**
 * Azure Static Web Apps Authentication Hook
 * 
 * Uses SWA's built-in authentication via /.auth/me endpoint
 * No external dependencies needed - auth is handled at the edge
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// SWA Auth user info structure
export interface SWAUser {
  userId: string;
  userDetails: string; // email
  identityProvider: string; // 'google', 'github', etc.
  userRoles: string[];
  claims: Array<{ typ: string; val: string }>;
}

export interface AuthState {
  user: SWAUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface UseAuthReturn extends AuthState {
  login: (provider?: string, redirectUrl?: string) => void;
  logout: (redirectUrl?: string) => void;
  refresh: () => Promise<void>;
}

/**
 * Hook to manage Azure SWA authentication
 */
export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/.auth/me');
      
      if (!response.ok) {
        throw new Error('Failed to fetch auth status');
      }
      
      const data = await response.json();
      
      // SWA returns { clientPrincipal: null } if not authenticated
      if (data.clientPrincipal) {
        setState({
          user: data.clientPrincipal,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Auth error',
      });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback((provider: string = 'google', redirectUrl: string = '/dashboard') => {
    window.location.href = `/.auth/login/${provider}?post_login_redirect_uri=${encodeURIComponent(redirectUrl)}`;
  }, []);

  const logout = useCallback((redirectUrl: string = '/') => {
    window.location.href = `/.auth/logout?post_logout_redirect_uri=${encodeURIComponent(redirectUrl)}`;
  }, []);

  return {
    ...state,
    login,
    logout,
    refresh: fetchUser,
  };
}

/**
 * Get user email from SWA claims
 */
export function getUserEmail(user: SWAUser | null): string | null {
  if (!user) return null;
  
  // Try userDetails first (usually email)
  if (user.userDetails) return user.userDetails;
  
  // Try to find email in claims
  const emailClaim = user.claims?.find(
    c => c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' ||
         c.typ === 'email'
  );
  
  return emailClaim?.val || null;
}

/**
 * Get user display name from SWA claims
 */
export function getUserName(user: SWAUser | null): string | null {
  if (!user) return null;
  
  const nameClaim = user.claims?.find(
    c => c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name' ||
         c.typ === 'name'
  );
  
  return nameClaim?.val || user.userDetails || null;
}

/**
 * Get user avatar URL from SWA claims (Google provides picture)
 */
export function getUserAvatar(user: SWAUser | null): string | null {
  if (!user) return null;
  
  const pictureClaim = user.claims?.find(c => c.typ === 'picture');
  return pictureClaim?.val || null;
}
