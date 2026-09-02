import { useState, useCallback } from "react";

/**
 * Generic async action state
 */
interface AsyncState<T = unknown> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

/**
 * Options for async action execution
 */
interface AsyncActionOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

/**
 * Enterprise-grade hook for managing async operations with loading/error states
 *
 * @example
 * ```tsx
 * const { execute, isLoading, error } = useAsyncAction(async (id: string) => {
 *   return await api.fetchUser(id);
 * });
 *
 * const handleClick = async () => {
 *   await execute('123', {
 *     onSuccess: (user) => console.log('Success:', user),
 *     onError: (err) => console.error('Failed:', err)
 *   });
 * };
 * ```
 */
export function useAsyncAction<TArgs extends unknown[], TResult = unknown>(
  asyncFn: (...args: TArgs) => Promise<TResult>
) {
  const [state, setState] = useState<AsyncState<TResult>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const execute = useCallback(
    async (
      ...args: [...TArgs, AsyncActionOptions<TResult>?]
    ): Promise<TResult | null> => {
      // Extract options if provided as last argument
      const lastArg = args[args.length - 1];
      const hasOptions =
        lastArg &&
        typeof lastArg === "object" &&
        ("onSuccess" in lastArg ||
          "onError" in lastArg ||
          "onFinally" in lastArg);

      const options = hasOptions
        ? (lastArg as AsyncActionOptions<TResult>)
        : {};
      const fnArgs = hasOptions ? args.slice(0, -1) : args;

      setState((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        isSuccess: false,
        error: null,
      }));

      try {
        const result = await asyncFn(...(fnArgs as TArgs));

        setState({
          data: result,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });

        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        setState({
          data: null,
          error,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });

        options.onError?.(error);
        return null;
      } finally {
        options.onFinally?.();
      }
    },
    [asyncFn]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
