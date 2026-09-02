import React from "react";
import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  Bell,
  CheckCircle,
  Flame,
  TrendingUp,
  LucideIcon,
} from "lucide-react-native";
import Text from "@components/atoms/Text";
import { useThemeColors } from "@constants/theme";
import type { ProfileStat } from "@types";

interface ProfileStatsCardProps {
  stats: ProfileStat[];
  animationDelay?: number;
}

const iconMap: Record<string, LucideIcon> = {
  bell: Bell,
  "check-circle": CheckCircle,
  flame: Flame,
  "trending-up": TrendingUp,
};

const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({
  stats,
  animationDelay = 0,
}) => {
  const colors = useThemeColors();

  return (
    <Animated.View
      entering={FadeInUp.delay(animationDelay).duration(500).springify()}
      style={{
        marginBottom: 16,
      }}
    >
      <View
        style={{
          backgroundColor: colors.backgroundTwo,
          borderRadius: 24,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {/* Title */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: colors.heading,
            marginBottom: 16,
          }}
        >
          Your Activity
        </Text>

        {/* Stats Grid */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginHorizontal: -6,
          }}
        >
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon];

            return (
              <View
                key={stat.id}
                style={{
                  width: "50%",
                  paddingHorizontal: 6,
                  marginBottom: index < 2 ? 12 : 0,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: 16,
                    padding: 16,
                    alignItems: "center",
                  }}
                >
                  {/* Icon */}
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: stat.bgColor,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                    }}
                  >
                    {IconComponent && (
                      <IconComponent
                        size={24}
                        color={stat.color}
                        strokeWidth={2.5}
                      />
                    )}
                  </View>

                  {/* Value */}
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: colors.heading,
                      marginBottom: 4,
                    }}
                  >
                    {stat.value}
                  </Text>

                  {/* Label */}
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.text,
                      textAlign: "center",
                    }}
                  >
                    {stat.label}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
};

export default ProfileStatsCard;
