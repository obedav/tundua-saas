"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Pusher, { Channel } from 'pusher-js';
import { createPusherClient, NotificationEvent, ApplicationStatusEvent, PaymentEvent } from '@/lib/pusher';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PusherContextType {
  pusher: Pusher | null;
  userChannel: Channel | null;
  subscribe: (channelName: string, eventName: string, callback: (data: any) => void) => void;
  unsubscribe: (channelName: string) => void;
}

const PusherContext = createContext<PusherContextType>({
  pusher: null,
  userChannel: null,
  subscribe: () => {},
  unsubscribe: () => {},
});

export const usePusher = () => useContext(PusherContext);

interface PusherProviderProps {
  children: React.ReactNode;
}

export function PusherProvider({ children }: PusherProviderProps) {
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [userChannel, setUserChannel] = useState<Channel | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Initialize Pusher
  useEffect(() => {
    // Only initialize if we have the required env vars
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
      console.warn('Pusher is not configured. Set NEXT_PUBLIC_PUSHER_KEY to enable real-time features.');
      return;
    }

    const pusherClient = createPusherClient();
    setPusher(pusherClient);

    // Enable Pusher logging in development
    if (process.env.NODE_ENV === 'development') {
      Pusher.logToConsole = true;
    }

    return () => {
      pusherClient.disconnect();
    };
  }, []);

  // Subscribe to user's private channel
  useEffect(() => {
    if (!pusher || !isAuthenticated || !user) {
      return;
    }

    const channelName = `private-user-${user.id}`;
    const channel = pusher.subscribe(channelName);

    setUserChannel(channel);

    // Handle notification events
    channel.bind('notification', (data: NotificationEvent) => {
      console.log('New notification:', data);

      // Show toast based on priority
      const toastConfig = {
        description: data.message,
        duration: data.priority === 'urgent' ? 10000 : 5000,
      };

      switch (data.priority) {
        case 'urgent':
        case 'high':
          toast.error(data.subject, toastConfig);
          break;
        case 'normal':
          toast.info(data.subject, toastConfig);
          break;
        case 'low':
          toast(data.subject, toastConfig);
          break;
      }

      // Trigger a custom event to update notification count
      window.dispatchEvent(new CustomEvent('new-notification', { detail: data }));
    });

    // Handle application status changes
    channel.bind('application-status-changed', (data: ApplicationStatusEvent) => {
      console.log('Application status changed:', data);

      toast.success('Application Updated', {
        description: `Application ${data.reference_number} status: ${data.new_status}`,
        duration: 5000,
      });

      // Trigger refresh event
      window.dispatchEvent(new CustomEvent('application-status-changed', { detail: data }));
    });

    // Handle payment events
    channel.bind('payment-completed', (data: PaymentEvent) => {
      console.log('Payment completed:', data);

      toast.success('Payment Successful', {
        description: `Your payment of ${data.currency} ${data.amount} has been processed.`,
        duration: 7000,
      });

      // Trigger refresh event
      window.dispatchEvent(new CustomEvent('payment-completed', { detail: data }));
    });

    channel.bind('payment-failed', (data: PaymentEvent) => {
      console.log('Payment failed:', data);

      toast.error('Payment Failed', {
        description: 'Your payment could not be processed. Please try again.',
        duration: 7000,
      });

      // Trigger refresh event
      window.dispatchEvent(new CustomEvent('payment-failed', { detail: data }));
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      setUserChannel(null);
    };
  }, [pusher, isAuthenticated, user]);

  // Generic subscribe function
  const subscribe = useCallback((channelName: string, eventName: string, callback: (data: any) => void) => {
    if (!pusher) return;

    const channel = pusher.subscribe(channelName);
    channel.bind(eventName, callback);
  }, [pusher]);

  // Generic unsubscribe function
  const unsubscribe = useCallback((channelName: string) => {
    if (!pusher) return;
    pusher.unsubscribe(channelName);
  }, [pusher]);

  const value: PusherContextType = {
    pusher,
    userChannel,
    subscribe,
    unsubscribe,
  };

  return (
    <PusherContext.Provider value={value}>
      {children}
    </PusherContext.Provider>
  );
}
