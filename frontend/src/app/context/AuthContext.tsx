'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { fetchWithAuth, BASE_URL } from '@/lib/apiFetch';
import { TokenService, AuthEvent } from '@/lib/tokenService';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // 1. Proactive Refresh Logic: calculate delay based on 80% of remaining life
  const scheduleProactiveRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    const expiry = TokenService.getTokenExpiry();
    if (!expiry) return;

    const now = Date.now();
    const timeRemaining = expiry - now;
    
    // Refresh when 20% of life is left, or at least 2 mins before expiry
    // Assuming 15m duration, 20% is 3 minutes.
    // We'll calculate a delay that triggers when (timeRemaining - threshold) is reached.
    const threshold = Math.max(timeRemaining * 0.2, 60000); // 20% or 1 min
    const delay = timeRemaining - threshold;

    if (delay > 0) {
      refreshTimerRef.current = setTimeout(async () => {
        try {
          console.log('Proactive refresh triggering...');
          await TokenService.performRefresh();
        } catch (e) {
          console.error('Proactive refresh failed', e);
        }
      }, delay);
    } else {
      // If already in the danger zone, refresh immediately
      TokenService.performRefresh().catch(e => console.error(e));
    }
  }, []);

  const fetchUser = async () => {
    const token = TokenService.getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetchWithAuth(`${BASE_URL}/auth/me`);
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        scheduleProactiveRefresh();
      } else {
        TokenService.clearData();
        setUser(null);
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin user:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Lifecycle & Events
  useEffect(() => {
    // Initial fetch
    fetchUser();

    // Listen to token updates (same tab and other tabs via BroadcastChannel)
    const cleanup = TokenService.onEvent((event: AuthEvent) => {
      if (event.type === 'LOGIN' || event.type === 'REFRESH_SUCCESS') {
        fetchUser(); // Re-fetch user data and reschedule timer
      } else if (event.type === 'LOGOUT') {
        setUser(null);
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      }
    });

    // Handle visibility change (tab active again)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab visible: checking token health...');
        if (TokenService.shouldRefresh()) {
          TokenService.performRefresh().catch(e => console.error(e));
        } else {
          scheduleProactiveRefresh();
        }
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cleanup();
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [scheduleProactiveRefresh]);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);