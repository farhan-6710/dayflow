import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SidebarHeader } from "./sidebar-left/SidebarHeader";
import { SidebarMenu } from "./sidebar-left/SidebarMenu";
import { SidebarFooter } from "./sidebar-left/SidebarFooter";

interface SidebarLeftProps {
  onClose: () => void;
}

export default function SidebarLeft({ onClose }: SidebarLeftProps) {
  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      edges={["top", "left", "right", "bottom"]}
    >
      <SidebarHeader />

      <ScrollView className="flex-1">
        <SidebarMenu onClose={onClose} />
      </ScrollView>

      <SidebarFooter onClose={onClose} />
    </SafeAreaView>
  );
}
