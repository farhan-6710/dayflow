/**
 * Centralized API client with consistent error handling
 * Enterprise-grade axios wrapper with retry logic and interceptors
 */

import { AxiosRequestConfig, AxiosResponse } from "axios";
import { axiosInstance } from "@lib/axiosInstance";
import { normalizeError, NormalizedError, isRetryableError } from "@api/errors";

/**
 * API response wrapper with data or error
 */
export interface ApiResult<T = unknown> {
  data: T | null;
  error: NormalizedError | null;
  response?: AxiosResponse<T>;
}

/**
 * Retry configuration
 */
interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryableErrors?: boolean;
}

/**
 * Extended request config with retry options
 */
interface ApiRequestConfig extends AxiosRequestConfig {
  retry?: RetryConfig;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableErrors: true,
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Centralized API client
 * All API calls should go through this client for consistent error handling
 *
 * @example
 * ```ts
 * const { data, error } = await apiClient.request({
 *   url: '/api/reminders',
 *   method: 'GET',
 * });
 *
 * if (error) {
 *   console.error(error.message);
 *   return;
 * }
 *
 * console.log(data);
 * ```
 */
export const apiClient = {
  /**
   * Make an API request with automatic error handling and retry logic
   */
  async request<T = unknown>(config: ApiRequestConfig): Promise<ApiResult<T>> {
    const retryConfig = {
      ...DEFAULT_RETRY_CONFIG,
      ...config.retry,
    };

    let lastError: NormalizedError | null = null;
    let attempt = 0;

    while (attempt <= retryConfig.maxRetries) {
      try {
        const response = await axiosInstance.request<T>(config);

        return {
          data: response.data,
          error: null,
          response,
        };
      } catch (error) {
        lastError = normalizeError(error);
        attempt++;

        // Check if we should retry
        const shouldRetry =
          retryConfig.retryableErrors &&
          isRetryableError(lastError) &&
          attempt <= retryConfig.maxRetries;

        if (shouldRetry) {
          // Exponential backoff: delay increases with each retry
          const delay = retryConfig.retryDelay * Math.pow(2, attempt - 1);
          await sleep(delay);
          continue;
        }

        // No more retries, return error
        break;
      }
    }

    return {
      data: null,
      error: lastError,
    };
  },

  /**
   * Convenience method for GET requests
   */
  async get<T = unknown>(
    url: string,
    config?: Omit<ApiRequestConfig, "url" | "method">
  ): Promise<ApiResult<T>> {
    return this.request<T>({ ...config, url, method: "GET" });
  },

  /**
   * Convenience method for POST requests
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<ApiRequestConfig, "url" | "method" | "data">
  ): Promise<ApiResult<T>> {
    return this.request<T>({ ...config, url, method: "POST", data });
  },

  /**
   * Convenience method for PATCH requests
   */
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<ApiRequestConfig, "url" | "method" | "data">
  ): Promise<ApiResult<T>> {
    return this.request<T>({ ...config, url, method: "PATCH", data });
  },

  /**
   * Convenience method for PUT requests
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: Omit<ApiRequestConfig, "url" | "method" | "data">
  ): Promise<ApiResult<T>> {
    return this.request<T>({ ...config, url, method: "PUT", data });
  },

  /**
   * Convenience method for DELETE requests
   */
  async delete<T = unknown>(
    url: string,
    config?: Omit<ApiRequestConfig, "url" | "method">
  ): Promise<ApiResult<T>> {
    return this.request<T>({ ...config, url, method: "DELETE" });
  },
};
