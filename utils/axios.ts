// lib/apiClient.ts
import axios, { AxiosError, AxiosInstance } from "axios";

const logApiError = (error: AxiosError): void => {
  if (process.env.NODE_ENV !== "production") return;
  if (error.config?.url?.includes("/log-error")) return;

  try {
    navigator.sendBeacon(
      "/api/log-error",
      JSON.stringify({
        message: error.response?.data ?? error.message,
        status: error.response?.status,
        route: error.config?.url,
        method: error.config?.method,
        metadata: {
          data: error.config?.data,
        },
      })
    );
  } catch {
    /* silent */
  }
};

const withAuth = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: "",
    timeout: 60000,
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (res) => res,
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        logApiError(error);

        throw new AxiosError(
          error.response?.data?.message ?? "API request failed",
          error.code,
          error.config,
          error.request,
          error.response
        );
      }

      throw error;
    }
  );

  return instance;
};

export const apiClient = withAuth();
