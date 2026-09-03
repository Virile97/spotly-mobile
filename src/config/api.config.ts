import { env } from './env';

export const apiConfig = {
  baseURL: env.apiUrl,
  timeout: 15000,
} as const;
