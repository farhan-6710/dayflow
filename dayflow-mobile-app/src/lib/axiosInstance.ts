import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "@config/config";
import { supabase } from "@lib/supabase";
import Toast from "react-native-toast-message";

// Callback for handling session expiration
let onSessionExpired: (() => void) | null = null;

export const setSessionExpiredCallback = (callback: () => void) => {
  onSessionExpired = callback;
};

export const getAuthToken = async () => {
  try {
    // First try to get Supabase session token
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      return session.access_token;
    }

    // Fallback to AsyncStorage token (for backward compatibility)
    const token = await AsyncStorage.getItem("auth_token");
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

export const setAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("auth_token", token);
  } catch (error) {
    console.error("Error setting auth token:", error);
  }
};

export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem("auth_token");
  } catch (error) {
    console.error("Error removing auth token:", error);
  }
};

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const authToken = await getAuthToken();
  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`;
  }
  return config;
});

// Response interceptor to handle 401 errors (session expired)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      Toast.show({
        type: "error",
        text1: "Session Expired",
        text2: "Please log in again",
        visibilityTime: 3000,
      });

      // Call the session expired callback to trigger sign out
      if (onSessionExpired) {
        onSessionExpired();
      }
    }
    return Promise.reject(error);
  }
);
