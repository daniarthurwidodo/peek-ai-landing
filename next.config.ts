import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async headers() {
    // Only apply CSP in production
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: [
                "default-src 'self'",
                "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.paddle.com https://*.clerk.accounts.dev",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: https:",
                "font-src 'self' data:",
                "connect-src 'self' https://sandbox-checkout-service.paddle.com https://sandbox-api.paddle.com https://cdn.paddle.com https://*.clerk.accounts.dev",
                "frame-src 'self' https://sandbox-buy.paddle.com https://sandbox-checkout.paddle.com https://*.clerk.accounts.dev",
                "frame-ancestors 'self'",
              ].join('; '),
            },
          ],
        },
      ];
    }
    return [];
  },
};

export default nextConfig;

