/**
 * Error normalization utilities
 * Converts various error formats into a consistent NormalizedError structure
 */

import { AxiosError } from "axios";
import { ErrorType, NormalizedError, ApiErrorResponse } from "./types";

/**
 * Normalizes any error into a consistent NormalizedError format
 *
 * @example
 * ```ts
 * try {
 *   await api.call();
 * } catch (error) {
 *   const normalized = normalizeError(error);
 *   console.error(normalized.message); // Always a string
 * }
 * ```
 */
export function normalizeError(error: unknown): NormalizedError {
  // Handle Axios errors
  if (isAxiosError(error)) {
    return normalizeAxiosError(error as AxiosError<ApiErrorResponse>);
  }

  // Handle native Error objects
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message || "An unexpected error occurred",
      originalError: error,
    };
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      type: ErrorType.UNKNOWN,
      message: error,
      originalError: error,
    };
  }

  // Handle unknown error types
  return {
    type: ErrorType.UNKNOWN,
    message: "An unexpected error occurred",
    originalError: error,
  };
}

/**
 * Type guard for Axios errors
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}

/**
 * Normalizes Axios-specific errors
 */
function normalizeAxiosError(
  error: AxiosError<ApiErrorResponse>
): NormalizedError {
  const statusCode = error.response?.status;
  const responseData = error.response?.data;

  // Network errors (no response)
  if (!error.response) {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return {
        type: ErrorType.TIMEOUT,
        message:
          "Request timed out. Please check your connection and try again.",
        originalError: error,
      };
    }

    return {
      type: ErrorType.NETWORK,
      message: "Network error. Please check your internet connection.",
      originalError: error,
    };
  }

  // Map status codes to error types
  switch (statusCode) {
    case 400:
      return {
        type: ErrorType.VALIDATION,
        message: extractErrorMessage(responseData) || "Invalid request data",
        statusCode,
        originalError: error,
        details: responseData?.errors,
      };

    case 401:
      return {
        type: ErrorType.AUTHENTICATION,
        message:
          extractErrorMessage(responseData) ||
          "Authentication required. Please log in.",
        statusCode,
        originalError: error,
      };

    case 403:
      return {
        type: ErrorType.AUTHORIZATION,
        message:
          extractErrorMessage(responseData) ||
          "You don't have permission to perform this action.",
        statusCode,
        originalError: error,
      };

    case 404:
      return {
        type: ErrorType.NOT_FOUND,
        message:
          extractErrorMessage(responseData) ||
          "The requested resource was not found.",
        statusCode,
        originalError: error,
      };

    case 408:
      return {
        type: ErrorType.TIMEOUT,
        message: "Request timed out. Please try again.",
        statusCode,
        originalError: error,
      };

    case 422:
      return {
        type: ErrorType.VALIDATION,
        message: extractErrorMessage(responseData) || "Validation failed",
        statusCode,
        originalError: error,
        details: responseData?.errors,
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        type: ErrorType.SERVER,
        message: "Server error. Please try again later.",
        statusCode,
        originalError: error,
      };

    default:
      return {
        type: ErrorType.UNKNOWN,
        message:
          extractErrorMessage(responseData) || "An unexpected error occurred",
        statusCode,
        originalError: error,
      };
  }
}

/**
 * Extracts a user-friendly error message from API response
 */
function extractErrorMessage(data?: ApiErrorResponse): string | null {
  if (!data) return null;

  // Try different common error message formats
  if (data.message) return data.message;
  if (data.error) return data.error;

  // Handle validation errors object
  if (data.errors && typeof data.errors === "object") {
    const firstError = Object.values(data.errors)[0];
    if (Array.isArray(firstError) && firstError.length > 0) {
      return firstError[0];
    }
  }

  return null;
}

/**
 * Checks if error is a specific type
 */
export function isErrorType(error: NormalizedError, type: ErrorType): boolean {
  return error.type === type;
}

/**
 * Checks if error is retryable (network, timeout, server errors)
 */
export function isRetryableError(error: NormalizedError): boolean {
  return [ErrorType.NETWORK, ErrorType.TIMEOUT, ErrorType.SERVER].includes(
    error.type
  );
}
