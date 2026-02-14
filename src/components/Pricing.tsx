'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

declare global {
  interface Window {
    Paddle?: {
      Environment: {
        set: (env: string) => void;
      };
      Initialize: (config: { token: string }) => void;
      Checkout: {
        open: (options: {
          items: Array<{ priceId: string; quantity: number }>;
          customer?: { email?: string };
        }) => void;
      };
    };
  }
}

const features = [
  'Unlimited AI mock interviews',
  'Real-time feedback and analysis',
  'Industry-specific question bank',
  'Progress tracking dashboard',
  'Interview recording playback',
  'Email support',
];

export default function Pricing() {
  const { user } = useUser();
  const [paddleLoaded, setPaddleLoaded] = useState(false);

  useEffect(() => {
    const initPaddle = () => {
      if (!window.Paddle) return;

      const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
      if (!clientToken) {
        console.error('Paddle client token not configured');
        return;
      }

      const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox';
      window.Paddle.Environment.set(environment);
      window.Paddle.Initialize({
        token: clientToken,
      });
      setPaddleLoaded(true);
    };

    if (window.Paddle) {
      initPaddle();
    } else {
      const script = document.querySelector('script[src*="paddle"]');
      script?.addEventListener('load', initPaddle);
    }
  }, []);

  const handleCheckout = () => {
    if (!window.Paddle || !paddleLoaded) {
      console.error('Paddle is not loaded yet');
      return;
    }

    const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;
    if (!priceId) {
      console.error('Price ID not configured');
      return;
    }

    window.Paddle.Checkout.open({
      items: [{ priceId: priceId, quantity: 1 }],
      customer: user?.primaryEmailAddress?.emailAddress
        ? { email: user.primaryEmailAddress.emailAddress }
        : undefined,
    });
  };

  return (
    <section id="pricing" className="bg-gray-50 dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Get unlimited access to all features for one low price
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-lg">
          <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pro Plan
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                $5
              </span>
              <span className="text-base font-semibold text-gray-600 dark:text-gray-400">
                /month
              </span>
            </p>
            <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <span className="text-blue-600">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={handleCheckout}
              disabled={!paddleLoaded}
              className="mt-8 w-full rounded-full bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start your free trial
            </button>
            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              7-day free trial. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
