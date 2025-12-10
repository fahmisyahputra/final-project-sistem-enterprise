/**
 * Environment Configuration
 * Centralized environment variables management
 */

export const env = {
  // App
  nodeEnv: process.env.NODE_ENV,
  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV === 'development',

  // API Endpoints
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
  },
} as const;

export type Env = typeof env;
