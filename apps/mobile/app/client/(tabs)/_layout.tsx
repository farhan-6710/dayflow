import { Tabs } from "expo-router";
import { Bell, Folder, House, Menu } from "lucide-react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { tabBarOptions } from "@/ui/tabBarOptions";

export default function ClientTabs() {
  const { colors } = useTheme();
  return (
    <Tabs screenOptions={tabBarOptions(colors)}>
      <Tabs.Screen name="home" options={{ title: "Home", tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }} />
      <Tabs.Screen name="projects" options={{ title: "Projects", tabBarIcon: ({ color, size }) => <Folder color={color} size={size} /> }} />
      <Tabs.Screen name="alerts" options={{ title: "Alerts", tabBarIcon: ({ color, size }) => <Bell color={color} size={size} /> }} />
      <Tabs.Screen name="more" options={{ title: "More", tabBarIcon: ({ color, size }) => <Menu color={color} size={size} /> }} />
    </Tabs>
  );
}
