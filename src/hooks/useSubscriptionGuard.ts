// frontend/src/hooks/useSubscriptionGuard.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

type SubscriptionStatus = 'loading' | 'active' | 'trial_no_card' | 'expired' | 'none';

export function useSubscriptionGuard(redirectIfNoCard = false) {
  const router = useRouter();
  const [status, setStatus] = useState<SubscriptionStatus>('loading');
  const [subscription, setSubscription] = useState<any>(null);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number>(0);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const response = await apiClient.stripe.getSubscription();
      const sub = response.data.subscription;

      if (!sub) {
        setStatus('none');
        if (redirectIfNoCard) {
          router.push('/billing?required=true&return=' + window.location.pathname);
        }
        return;
      }

      setSubscription(sub);

      // Calcular días restantes del trial
      if (sub.status === 'trial' && sub.trial_ends_at) {
        const now = new Date();
        const trialEnds = new Date(sub.trial_ends_at);
        const days = Math.max(0, Math.ceil((trialEnds.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        setTrialDaysRemaining(days);
      }

      // Si tiene stripe_subscription_id tiene tarjeta registrada
      const hasCard = !!sub.stripe_subscription_id;

      if (!hasCard) {
        // Está en free_trial sin tarjeta — no puede crear apps
        setStatus('trial_no_card');
        if (redirectIfNoCard) {
          router.push('/billing?required=true&return=' + window.location.pathname);
        }
        return;
      }

      if (sub.status === 'active' || sub.status === 'trial') {
        setStatus('active');
      } else if (sub.status === 'expired' || sub.status === 'canceled') {
        setStatus('expired');
        if (redirectIfNoCard) {
          router.push('/billing?required=true&return=' + window.location.pathname);
        }
      }

    } catch (error) {
      console.error('Error checking subscription:', error);
      setStatus('none');
    }
  };

  return { status, subscription, trialDaysRemaining };
}