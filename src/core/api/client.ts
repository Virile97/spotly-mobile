import * as axios from 'axios';

import { apiConfig } from '@/config/api.config';
import { attachInterceptors } from './interceptors';

export const apiClient = axios.default.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

attachInterceptors(apiClient);
