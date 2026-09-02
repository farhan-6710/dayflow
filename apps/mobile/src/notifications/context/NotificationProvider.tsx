import * as Notifications from "expo-notifications";
import {
  setupNotifications,
  createNotificationReceivedListener,
  createNotificationResponseListener,
  registerNotificationCategories,
} from "@notifications/utils/notificationUtils";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface NotificationContextType {
  expoPushToken: string | null;
  error: Error | null;
  permissionStatus: string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>("Unknown");

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Categories must be registered before any notification is received
        await registerNotificationCategories();
        const { token, status } = await setupNotifications();
        setPermissionStatus(status);
        setExpoPushToken(token);
      } catch (err) {
        setError(err as Error);
      }
    };

    initializeNotifications();

    // Set up notification listeners
    notificationListener.current = createNotificationReceivedListener();
    responseListener.current = createNotificationResponseListener();

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        error,
        permissionStatus,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
