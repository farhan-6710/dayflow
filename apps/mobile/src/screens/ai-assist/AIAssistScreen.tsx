import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Menu } from "lucide-react-native";
import { useThemeColors } from "@constants/theme";
import { AI_QUICK_ACTIONS, AI_INSIGHTS } from "@constants/ai-assist";
import { useDrawer } from "@/providers/DrawerProvider";
import PageHeader from "@components/organisms/PageHeader";
import AIStatusCard from "@screens/ai-assist/AIStatusCard";
import QuickActionCard from "@screens/ai-assist/QuickActionCard";
import AIInsightCard from "@screens/ai-assist/AIInsightCard";
import AIChatInput from "@screens/ai-assist/AIChatInput";
import { useAIAssistant } from "@/hooks/analytics/useAIAssistant";

export default function AIAssistScreen() {
  const colors = useThemeColors();
  const { openDrawer } = useDrawer();
  const { aiStatus, handleActionPress, handleSendMessage } = useAIAssistant();

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <PageHeader
        icon="sparkles"
        title="AI Assistant"
        subtitle="Your intelligent productivity companion"
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
        {/* AI Status Card */}
        <AIStatusCard status={aiStatus} animationDelay={150} />

        {/* Quick Actions */}
        <QuickActionCard
          actions={AI_QUICK_ACTIONS}
          onActionPress={handleActionPress}
          animationDelay={200}
        />

        {/* AI Insights */}
        <AIInsightCard insights={AI_INSIGHTS} animationDelay={300} />

        {/* Chat Input */}
        <AIChatInput onSend={handleSendMessage} animationDelay={400} />
      </ScrollView>
    </View>
  );
}
