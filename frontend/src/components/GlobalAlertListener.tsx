'use client';

import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';
import { TokenService } from '@/lib/tokenService';

export default function GlobalAlertListener() {
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window === 'undefined' || !user?.id) return;

    const token = TokenService.getAccessToken();
    if (!token) return;

    // Use a separate Pusher instance for authenticated channels
    const pusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? 'app-key',
      {
        wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST ?? '127.0.0.1',
        wsPort: Number(process.env.NEXT_PUBLIC_PUSHER_PORT ?? 6001),
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? 'mt1',
        authEndpoint: `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    const channelName = `private-user.${user.id}.alerts`;
    const channel = pusher.subscribe(channelName);

    channel.bind('alert.triggered', (data: any) => {
      console.log('[Alert Triggered]', data);
      
      const conditionText = data.condition === 'above' ? 'tăng vượt' : 'giảm xuống dưới';
      
      toast.success(
        `🚨 ${data.symbol} đã ${conditionText} $${data.target_price}! (Hiện tại: $${data.triggered_at_price})`,
        { duration: 6000, icon: '🚀' }
      );

      // Trigger custom window event to allow UI components (like coin page) to refresh
      window.dispatchEvent(new CustomEvent('alertTriggered', { detail: data }));
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [user]);

  return null;
}
