import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercelは画像最適化をネイティブサポートしているため、images設定は不要
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            // Enforce HTTPS for 1 year, including subdomains
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            // Prevent clickjacking by disallowing iframe embedding
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            // Prevent MIME type sniffing
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            // Content Security Policy
            // - default-src 'self': Only allow resources from same origin by default
            // - script-src: Allow scripts from self, eval (Next.js), and inline scripts (Next.js)
            // - style-src: Allow styles from self and inline styles (Tailwind)
            // - img-src: Allow images from self, data URIs, and HTTPS sources
            // - font-src: Allow fonts from self and data URIs
            // - connect-src: Allow API calls to self and Twitter API
            // - frame-ancestors 'none': Prevent embedding (redundant with X-Frame-Options but more modern)
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.twitter.com",
              "frame-ancestors 'none'"
            ].join('; ')
          },
          {
            // Referrer policy for privacy
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            // Disable browser features that could be exploited
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
};

export default nextConfig;
