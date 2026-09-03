import { env } from './env';

export const appConfig = {
  name: 'Spotly',
  environment: env.environment,
  isProduction: env.isProduction,
} as const;
