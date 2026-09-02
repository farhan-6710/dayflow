import React from "react";
import { View, TouchableOpacity, Switch } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  Palette,
  Bell,
  Volume2,
  CloudUpload,
  Download,
  Shield,
  HelpCircle,
  MessageCircle,
  Star,
  LogOut,
  ChevronRight,
  LucideIcon,
} from "lucide-react-native";
import Text from "@components/atoms/Text";
import { useThemeColors } from "@constants/theme";
import type { ProfileSection, ProfileMenuItem } from "@types";

interface ProfileSettingsListProps {
  sections: ProfileSection[];
  onItemPress: (itemId: string) => void;
  animationDelay?: number;
}

const iconMap: Record<string, LucideIcon> = {
  palette: Palette,
  bell: Bell,
  "volume-2": Volume2,
  "cloud-upload": CloudUpload,
  download: Download,
  shield: Shield,
  "help-circle": HelpCircle,
  "message-circle": MessageCircle,
  star: Star,
  "log-out": LogOut,
};

const ProfileSettingsList: React.FC<ProfileSettingsListProps> = ({
  sections,
  onItemPress,
  animationDelay = 0,
}) => {
  const colors = useThemeColors();

  const renderMenuItem = (item: ProfileMenuItem) => {
    const IconComponent = iconMap[item.icon];

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => onItemPress(item.id)}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: item.iconBgColor,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          {IconComponent && (
            <IconComponent size={22} color={item.iconColor} strokeWidth={2} />
          )}
        </View>

        {/* Title and Subtitle */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: colors.heading,
              marginBottom: item.subtitle ? 4 : 0,
            }}
          >
            {item.title}
          </Text>
          {item.subtitle && (
            <Text
              style={{
                fontSize: 13,
                color: colors.text,
              }}
            >
              {item.subtitle}
            </Text>
          )}
        </View>

        {/* Right Content */}
        {item.rightContent === "arrow" && (
          <ChevronRight size={20} color={colors.text} strokeWidth={2} />
        )}
        {item.rightContent === "switch" && (
          <Switch
            value={true}
            onValueChange={() => onItemPress(item.id)}
            trackColor={{
              false: colors.border,
              true: colors.primary,
            }}
            thumbColor={colors.white}
          />
        )}
        {item.rightContent === "badge" && item.badgeText && (
          <View
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: colors.white,
              }}
            >
              {item.badgeText}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {sections.map((section, sectionIndex) => (
        <Animated.View
          key={section.id}
          entering={FadeInUp.delay(animationDelay + sectionIndex * 50)
            .duration(500)
            .springify()}
          style={{
            marginBottom: 16,
          }}
        >
          {/* Section Title */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: colors.text,
              marginBottom: 8,
              marginLeft: 4,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {section.title}
          </Text>

          {/* Section Items */}
          <View
            style={{
              backgroundColor: colors.backgroundTwo,
              borderRadius: 16,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {section.items.map((item, index) => (
              <View
                key={item.id}
                style={{
                  borderBottomWidth: index === section.items.length - 1 ? 0 : 1,
                  borderBottomColor: colors.border,
                }}
              >
                {renderMenuItem(item)}
              </View>
            ))}
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

export default ProfileSettingsList;
