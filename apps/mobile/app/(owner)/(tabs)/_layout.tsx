import { Tabs } from "expo-router";
import { CalendarDays, Folder, Menu, Sun, Users } from "lucide-react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { tabBarOptions } from "@/ui/tabBarOptions";

export default function OwnerTabs() {
  const { colors } = useTheme();
  return (
    <Tabs screenOptions={tabBarOptions(colors)}>
      <Tabs.Screen name="today" options={{ title: "Today", tabBarIcon: ({ color, size }) => <Sun color={color} size={size} /> }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendar", tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} /> }} />
      <Tabs.Screen name="projects" options={{ title: "Projects", tabBarIcon: ({ color, size }) => <Folder color={color} size={size} /> }} />
      <Tabs.Screen name="clients" options={{ title: "Clients", tabBarIcon: ({ color, size }) => <Users color={color} size={size} /> }} />
      <Tabs.Screen name="more" options={{ title: "More", tabBarIcon: ({ color, size }) => <Menu color={color} size={size} /> }} />
    </Tabs>
  );
}
