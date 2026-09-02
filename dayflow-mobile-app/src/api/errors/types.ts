/**
 * Normalized error types for consistent error handling across the application
 */

export enum ErrorType {
  NETWORK = "NETWORK_ERROR",
  AUTHENTICATION = "AUTHENTICATION_ERROR",
  AUTHORIZATION = "AUTHORIZATION_ERROR",
  VALIDATION = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND_ERROR",
  SERVER = "SERVER_ERROR",
  TIMEOUT = "TIMEOUT_ERROR",
  UNKNOWN = "UNKNOWN_ERROR",
}

export interface NormalizedError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  originalError?: unknown;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}
