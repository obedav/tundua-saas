import Pusher from 'pusher-js';

// Initialize Pusher (will be configured in the provider)
export const createPusherClient = () => {
  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/pusher/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? document.cookie.split('auth_token=')[1]?.split(';')[0] : ''}`,
      },
    },
  });

  return pusher;
};

// Pusher event types
export interface NotificationEvent {
  id: number;
  type: string;
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  data?: Record<string, any>;
}

export interface ApplicationStatusEvent {
  application_id: number;
  reference_number: string;
  old_status: string;
  new_status: string;
  updated_at: string;
}

export interface PaymentEvent {
  payment_id: number;
  application_id: number;
  amount: number;
  currency: string;
  status: string;
  paid_at?: string;
}
