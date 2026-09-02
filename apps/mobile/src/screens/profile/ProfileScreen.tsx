import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Menu } from "lucide-react-native";
import { useThemeColors } from "@constants/theme";
import { useDrawer } from "@/providers/DrawerProvider";
import { useProfileData } from "@hooks";
import PageHeader from "@components/organisms/PageHeader";
import {
  ProfileInfoCard,
  ProfileStatsCard,
  ProfileSettingsList,
} from "@screens/profile";

export default function ProfileScreen() {
  const colors = useThemeColors();
  const { openDrawer } = useDrawer();
  const {
    profile,
    initials,
    joinedDate,
    stats,
    menuSections,
    handleMenuItemPress,
  } = useProfileData();

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <PageHeader
        icon="person"
        title="Profile"
        subtitle="Manage your account and preferences"
        animationDelay={100}
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

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 70,
          paddingTop: 20,
          paddingHorizontal: 24,
        }}
      >
        <ProfileInfoCard
          profile={profile}
          initials={initials}
          joinedDate={joinedDate}
          onEditPress={() => {
            // TODO: Navigate to edit profile
          }}
          animationDelay={150}
        />

        <ProfileStatsCard stats={stats} animationDelay={200} />

        <ProfileSettingsList
          sections={menuSections}
          onItemPress={handleMenuItemPress}
          animationDelay={250}
        />
      </ScrollView>
    </View>
  );
}
