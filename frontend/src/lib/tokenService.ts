'use client';

// auth_channel handles cross-tab communication
const AUTH_CHANNEL_NAME = 'auth_channel';
let authChannel: BroadcastChannel | null = null;

if (typeof window !== 'undefined') {
  authChannel = new BroadcastChannel(AUTH_CHANNEL_NAME);
}

export type AuthEvent = {
  type: 'LOGIN' | 'LOGOUT' | 'REFRESH_SUCCESS';
  payload?: any;
};

// Singleton state
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export const TokenService = {
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },

  getUserName(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('user_name');
  },

  getTokenExpiry(): number {
    if (typeof window === 'undefined') return 0;
    const expiry = localStorage.getItem('token_expiry');
    return expiry ? parseInt(expiry, 10) : 0;
  },

  saveTokenData(token: string, expiresIn: number, userName?: string) {
    if (typeof window === 'undefined') return;

    // Calculate absolute expiry timestamp
    const expiryTime = Date.now() + expiresIn * 1000;
    
    localStorage.setItem('access_token', token);
    localStorage.setItem('token_expiry', expiryTime.toString());
    if (userName) {
      localStorage.setItem('user_name', userName);
    }

    // Notify other tabs and components in same tab
    this.broadcast({ type: 'LOGIN', payload: { token, userName, expiryTime } });
  },

  clearData() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('user_name');
    
    this.broadcast({ type: 'LOGOUT' });
  },

  broadcast(event: AuthEvent) {
    if (authChannel) {
      authChannel.postMessage(event);
    }
  },

  onEvent(callback: (event: AuthEvent) => void) {
    if (!authChannel) return () => {};
    
    // Listen to channel
    const handler = (e: MessageEvent) => callback(e.data);
    authChannel.addEventListener('message', handler);
    
    // Return cleanup function
    return () => authChannel?.removeEventListener('message', handler);
  },

  shouldRefresh(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return false;

    const now = Date.now();
    const timeRemaining = expiry - now;
    
    // Get initial duration to calculate percentage
    // For simplicity, if we don't have total duration, we use 2 minutes as threshold
    // But better: use 20% of the total duration (assuming 15m = 900s)
    const threshold = 120 * 1000; // 2 minutes in ms
    
    return timeRemaining < threshold;
  },

  async performRefresh(): Promise<string> {
    // If already refreshing, return the existing promise
    if (refreshPromise) {
      return refreshPromise;
    }

    if (isRefreshing) {
      // Emergency fallback if isRefreshing got stuck but promise is null
      return Promise.reject('Already refreshing');
    }

    isRefreshing = true;
    
    refreshPromise = (async () => {
      try {
        const res = await fetch('http://localhost:8000/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Important for HttpOnly refresh_token cookie
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error('[TokenService] Refresh failed with status:', res.status, errText);
          throw new Error('Refresh failed: ' + errText);
        }

        const data = await res.json();
        const newToken = data.access_token;
        const expiresIn = data.expires_in;
        const userName = data.user?.name;

        this.saveTokenData(newToken, expiresIn, userName);
        this.broadcast({ type: 'REFRESH_SUCCESS', payload: { token: newToken } });

        return newToken;
      } catch (error) {
        this.clearData();
        throw error;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }
};
