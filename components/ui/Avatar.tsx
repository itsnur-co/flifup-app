/**
 * Reusable Avatar Component
 * Supports single avatar and avatar group display
 * Matches Figma design with colored rings
 */

import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 32,
  borderColor = '#FCD34D',
  borderWidth = 2,
  style,
}) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '';

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth,
    borderColor,
    overflow: 'hidden',
    backgroundColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <View style={[containerStyle, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size - borderWidth * 2, height: size - borderWidth * 2 }}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={[
            styles.initials,
            { fontSize: size * 0.35 },
          ]}
        >
          {initials}
        </Text>
      )}
    </View>
  );
};

// Avatar ring colors based on index
const RING_COLORS = ['#FCD34D', '#3B82F6', '#F97316', '#10B981', '#EC4899'];

interface AvatarGroupProps {
  avatars: { uri?: string; name?: string }[];
  max?: number;
  size?: number;
  overlap?: number;
  style?: ViewStyle;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 3,
  size = 28,
  overlap = 8,
  style,
}) => {
  const displayAvatars = avatars.slice(0, max);
  const extraCount = avatars.length - max;

  return (
    <View style={[styles.groupContainer, style]}>
      {displayAvatars.map((avatar, index) => (
        <View
          key={index}
          style={[
            styles.avatarWrapper,
            { marginLeft: index > 0 ? -overlap : 0, zIndex: displayAvatars.length - index },
          ]}
        >
          <Avatar
            uri={avatar.uri}
            name={avatar.name}
            size={size}
            borderColor={RING_COLORS[index % RING_COLORS.length]}
            borderWidth={2}
          />
        </View>
      ))}
      {extraCount > 0 && (
        <View
          style={[
            styles.avatarWrapper,
            styles.extraCount,
            {
              marginLeft: -overlap,
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Text style={[styles.extraCountText, { fontSize: size * 0.35 }]}>
            +{extraCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  extraCount: {
    backgroundColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#5A5A5E',
  },
  extraCountText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default Avatar;
