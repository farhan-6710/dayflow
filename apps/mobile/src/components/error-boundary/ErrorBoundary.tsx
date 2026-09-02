import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text as RNText, TouchableOpacity } from "react-native";
import { router } from "expo-router";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service (e.g., Sentry, LogRocket)
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    router.replace("/");
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <View className="flex-1 justify-center items-center bg-background dark:bg-background-dark p-6">
          <View className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 w-full max-w-md">
            <RNText className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4 text-center">
              Oops! Something went wrong
            </RNText>

            <RNText className="text-base text-gray-700 dark:text-gray-300 mb-4 text-center">
              We're sorry for the inconvenience. The app encountered an
              unexpected error.
            </RNText>

            {__DEV__ && this.state.error && (
              <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <RNText className="text-xs font-mono text-gray-800 dark:text-gray-200">
                  {this.state.error.toString()}
                </RNText>
                {this.state.errorInfo && (
                  <RNText className="text-xs font-mono text-gray-600 dark:text-gray-400 mt-2">
                    {this.state.errorInfo.componentStack}
                  </RNText>
                )}
              </View>
            )}

            <TouchableOpacity
              onPress={this.handleReset}
              className="bg-primary rounded-xl py-3 px-6"
              activeOpacity={0.7}
            >
              <RNText className="text-white text-center font-semibold text-base">
                Go to Home
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
