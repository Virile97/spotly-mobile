import type { AxiosError, AxiosInstance } from "axios";

import { authEvents } from "@/core/auth/auth-events";
import { tokenStorage } from "@/core/auth/token-storage";
import { ApiError } from "./api-error";

export function attachInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(async (config) => {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; code?: string }>) => {
      const status = error.response?.status ?? 0;
      const message = error.response?.data?.message ?? error.message;
      const code = error.response?.data?.code;

      if (status === 401) {
        authEvents.emit("unauthorized");
      }

      return Promise.reject(new ApiError(message, status, code));
    }
  );
}
