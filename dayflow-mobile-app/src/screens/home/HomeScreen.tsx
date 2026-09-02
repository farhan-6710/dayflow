import { ScrollView, TouchableOpacity, View } from "react-native";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "expo-router";
import { useNotification } from "@notifications/context/NotificationProvider";
import { useRegisterDFN } from "@notifications/hooks/useRegisterDFN";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@redux/store";
import {
  getRemindersRequest,
  toggleGlobalPause,
} from "@redux/slices/remindersSlice";
import StatsCard from "@components/molecules/StatsCard";
import RemindersSection from "@screens/home/sections/RemindersSection";
import RemindersGuide from "@screens/home/sections/RemindersGuide";
import BottomSheetComponent from "@components/atoms/drawer/BottomSheet";
import { BottomSheetRef } from "@types";
import AddReminderDrawer from "@screens/home/add-reminder/AddReminderDrawer";
import { Reminder } from "@types";
import DebugLogsSection from "@screens/home/sections/DebugLogsSection";
import { copyTokenToClipboard } from "@notifications/utils/notificationUtils";
import { useAuth } from "@providers/AuthProvider";
import Toast from "react-native-toast-message";
import PageHeader from "@components/organisms/PageHeader";
import { Menu } from "lucide-react-native";
import { useThemeColors } from "@constants";
import { useDrawer } from "@/providers/DrawerProvider";
import { HomeScreenSkeleton } from "@components/skeletons";

export default function HomeScreen() {
  const router = useRouter();
  const { permissionStatus, expoPushToken } = useNotification();
  const { session, loading: authLoading } = useAuth();
  const colors = useThemeColors();
  const { openDrawer } = useDrawer();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (session) {
      // Refetch reminders every time HomeScreen is rendered
      dispatch(getRemindersRequest());
    }
  }, [dispatch, session]);

  // getAuthToken().then((token) => {
  //   console.log("Auth Token:", token);
  // });

  // Redux selectors
  const reminders = useSelector(
    (state: RootState) => state.reminders.reminders
  );
  const getRemindersLoading = useSelector(
    (state: RootState) => state.reminders.getRemindersLoading
  );

  // Sort reminders by time (hour and minute)
  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => {
      const timeA = a.hour * 60 + a.minute;
      const timeB = b.hour * 60 + b.minute;
      return timeA - timeB;
    });
  }, [reminders]);

  const [logs, setLogs] = useState<string[]>([]);
  const addReminderSheetRef = useRef<BottomSheetRef>(null);

  const handleLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  useRegisterDFN(handleLog);

  const handleReminderPress = (reminder: Reminder) => {
    router.push(`/reminder-details/${reminder.id}`);
  };

  const handleAddReminderPress = () => {
    if (!session) {
      Toast.show({
        type: "error",
        text1: "Not logged in",
        text2: "Please log in to add reminders.",
      });
      return;
    }
    addReminderSheetRef.current?.open();
  };

  const handleToggleGlobalPause = () => {
    dispatch(toggleGlobalPause());
  };

  // Show skeleton while auth is loading or fetching reminders
  if (authLoading || getRemindersLoading) {
    return <HomeScreenSkeleton />;
  }

  return (
    <>
      <View className="bg-background dark:bg-background-dark">
        <PageHeader
          icon="notifications"
          title="DayFlow"
          subtitle="Daily reminders for your tasks"
          actionButton={
            <TouchableOpacity
              className="w-12 h-12 rounded-xl justify-center items-center border border-border dark:border-border-dark bg-card dark:bg-card-dark"
              onPress={openDrawer}
              activeOpacity={0.7}
            >
              <Menu size={24} color={colors.heading} strokeWidth={2} />
            </TouchableOpacity>
          }
        />
      </View>

      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 70,
          paddingTop: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <StatsCard permissionGranted={permissionStatus === "granted"} />
        <RemindersSection
          reminders={sortedReminders}
          onReminderPress={handleReminderPress}
          onToggleSchedule={handleToggleGlobalPause}
          onAddReminderPress={handleAddReminderPress}
        />
        <RemindersGuide />
        <DebugLogsSection
          logs={logs}
          expoPushToken={expoPushToken}
          onCopy={() => copyTokenToClipboard(expoPushToken)}
        />
      </ScrollView>

      <BottomSheetComponent ref={addReminderSheetRef} snapPoints={["60%"]}>
        <AddReminderDrawer
          onClose={() => addReminderSheetRef.current?.close()}
        />
      </BottomSheetComponent>
    </>
  );
}
