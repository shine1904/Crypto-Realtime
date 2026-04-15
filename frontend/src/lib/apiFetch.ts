import { TokenService } from './tokenService';

export const BASE_URL = 'http://localhost:8000/api';

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = TokenService.getAccessToken();
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let res = await fetch(url, { ...options, headers, credentials: 'include' });

  // Handle 401 Unauthorized
  if (res.status === 401) {
    try {
      // Avoid infinite loop: only retry if we haven't already retried this request
      // We can check if the token we used is still the one in storage
      // If TokenService already has a NEW token, we just retry.
      // If it's the same old token, we trigger refresh.
      
      const latestToken = TokenService.getAccessToken();
      
      // Attempt refresh (this will return existing promise if already refreshing)
      const newToken = await TokenService.performRefresh();
      
      if (newToken) {
        headers.set('Authorization', `Bearer ${newToken}`);
        res = await fetch(url, { ...options, headers, credentials: 'include' });
      }
    } catch (e) {
      console.error('fetchWithAuth: Token refresh failed or max retries reached', e);
      // TokenService.performRefresh already handles clearData on failure
    }
  }

  return res;
}
