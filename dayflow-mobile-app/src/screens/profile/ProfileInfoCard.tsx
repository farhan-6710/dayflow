import React from "react";
import { View, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Edit, Mail, Calendar } from "lucide-react-native";
import Text from "@components/atoms/Text";
import { useThemeColors } from "@constants/theme";
import type { UserProfile } from "@types";

interface ProfileInfoCardProps {
  profile: UserProfile;
  initials: string;
  joinedDate: string;
  onEditPress?: () => void;
  animationDelay?: number;
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  profile,
  initials,
  joinedDate,
  onEditPress,
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
          padding: 24,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {/* Avatar and Edit Button Row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: 55,
              height: 55,
              borderRadius: 40,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 3,
              borderColor: colors.borderTwo,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "600",
                color: colors.white,
              }}
            >
              {initials}
            </Text>
          </View>

          {/* User Info */}
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.heading,
                marginBottom: 4,
              }}
            >
              {profile.name}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Mail size={14} color={colors.text} strokeWidth={2} />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.text,
                }}
                numberOfLines={1}
              >
                {profile.email}
              </Text>
            </View>
          </View>

          {/* Edit Button */}
          <TouchableOpacity
            onPress={onEditPress}
            activeOpacity={0.7}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: `${colors.primary}15`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Edit size={20} color={colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Bio Section */}
        {profile.bio && (
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                lineHeight: 20,
                color: colors.text,
              }}
            >
              {profile.bio}
            </Text>
          </View>
        )}

        {/* Joined Date */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: `${colors.primary}10`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar size={16} color={colors.primary} strokeWidth={2} />
          </View>
          <Text
            style={{
              fontSize: 13,
              color: colors.text,
            }}
          >
            {joinedDate}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default ProfileInfoCard;
