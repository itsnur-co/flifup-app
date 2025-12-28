/**
 * Journal Card Component
 * Individual journal entry display - matches Figma design
 */

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CalendarIcon, TagIcon, MoreHorizontalIcon } from "@/components/icons/TaskIcons";
import {
  Reaction1Icon,
  Reaction2Icon,
  Reaction3Icon,
  Reaction4Icon,
  Reaction5Icon
} from "@/components/icons/JournalIcons";
import { Colors } from "@/constants/colors";
import { Journal, getMoodLabel, MoodType } from "@/types/journal";

// Helper function to get reaction icon component based on mood type
const getReactionIconByMood = (mood: MoodType) => {
  const iconMap = {
    VERY_HAPPY: Reaction1Icon,
    HAPPY: Reaction2Icon,
    NEUTRAL: Reaction3Icon,
    SAD: Reaction4Icon,
    VERY_SAD: Reaction5Icon,
  };
  return iconMap[mood];
};

interface JournalCardProps {
  journal: Journal;
  onPress?: () => void;
  onMore?: () => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({
  journal,
  onPress,
  onMore,
}) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return `Today, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Top Row: Title & More Button */}
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {journal.title}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={(e) => {
            e.stopPropagation();
            onMore?.();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MoreHorizontalIcon size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Description */}
      {journal.description && (
        <Text style={styles.description} numberOfLines={2}>
          {journal.description}
        </Text>
      )}

      {/* Meta Row */}
      <View style={styles.metaRow}>
        {/* Date */}
        <View style={styles.metaItem}>
          <CalendarIcon size={14} color="#8E8E93" />
          <Text style={styles.metaText}>{formatDate(journal.createdAt)}</Text>
        </View>

        {/* Category */}
        {journal.category && (
          <View style={styles.metaItem}>
            <TagIcon size={14} color="#8E8E93" />
            <Text style={styles.metaText}>{journal.category.name}</Text>
          </View>
        )}

        {/* Mood */}
        {journal.mood && (() => {
          const ReactionIcon = getReactionIconByMood(journal.mood);
          return (
            <View style={styles.metaItem}>
              {ReactionIcon && <ReactionIcon size={16} />}
              <Text style={styles.metaText}>{getMoodLabel(journal.mood)}</Text>
            </View>
          );
        })()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "400",
    color: "#8E8E93",
  },
  moreButton: {
    padding: 4,
  },
  description: {
    fontSize: 15,
    fontWeight: "400",
    color: "#FFFFFF",
    lineHeight: 22,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: "#8E8E93",
  },
});

export default JournalCard;
