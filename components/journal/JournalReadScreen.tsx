/**
 * Journal Read Screen
 * Full-screen view for reading journal entries
 * Displays journal content with rich text formatting and reading progress
 */

import React, { useState, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Journal } from "@/types/journal";
import { Colors } from "@/constants/colors";

interface JournalReadScreenProps {
  journal: Journal;
  onBack?: () => void;
}

/**
 * Parse rich text markers and render formatted text segments
 * Supports: **bold**, *italic*, __underline__, ~~strikethrough~~, [color:HEX]text[/color]
 */
const parseRichText = (text: string): React.ReactNode[] => {
  const segments: React.ReactNode[] = [];
  let currentIndex = 0;
  let segmentKey = 0;

  // Regular expressions for different formats
  const patterns = {
    bold: /\*\*(.*?)\*\*/g,
    italic: /\*(.*?)\*/g,
    underline: /__(.*?)__/g,
    strikethrough: /~~(.*?)~~/g,
    color: /\[color:([A-Fa-f0-9]{6})\](.*?)\[\/color\]/g,
  };

  // Split text into lines to preserve line breaks
  const lines = text.split('\n');

  lines.forEach((line, lineIndex) => {
    let lineText = line;
    const lineSegments: React.ReactNode[] = [];
    let lastIndex = 0;

    // Create a combined pattern to find all formatting markers
    const combinedPattern = /(\*\*.*?\*\*|\*.*?\*|__.*?__|~~.*?~~|\[color:[A-Fa-f0-9]{6}\].*?\[\/color\])/g;
    let match;

    while ((match = combinedPattern.exec(lineText)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        lineSegments.push(
          <Text key={`text-${segmentKey++}`} style={styles.contentText}>
            {lineText.substring(lastIndex, match.index)}
          </Text>
        );
      }

      const matchedText = match[0];
      let content = '';
      let style: any = {};

      // Determine which pattern matched and extract content
      if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
        // Bold
        content = matchedText.slice(2, -2);
        style = { fontWeight: '700' };
      } else if (matchedText.startsWith('*') && matchedText.endsWith('*') && !matchedText.startsWith('**')) {
        // Italic
        content = matchedText.slice(1, -1);
        style = { fontStyle: 'italic' };
      } else if (matchedText.startsWith('__') && matchedText.endsWith('__')) {
        // Underline
        content = matchedText.slice(2, -2);
        style = { textDecorationLine: 'underline' };
      } else if (matchedText.startsWith('~~') && matchedText.endsWith('~~')) {
        // Strikethrough
        content = matchedText.slice(2, -2);
        style = { textDecorationLine: 'line-through' };
      } else if (matchedText.startsWith('[color:') && matchedText.includes('[/color]')) {
        // Color
        const colorMatch = matchedText.match(/\[color:([A-Fa-f0-9]{6})\](.*?)\[\/color\]/);
        if (colorMatch) {
          content = colorMatch[2];
          style = { color: `#${colorMatch[1]}` };
        }
      }

      lineSegments.push(
        <Text key={`formatted-${segmentKey++}`} style={[styles.contentText, style]}>
          {content}
        </Text>
      );

      lastIndex = match.index + matchedText.length;
    }

    // Add remaining text after last match
    if (lastIndex < lineText.length) {
      lineSegments.push(
        <Text key={`text-${segmentKey++}`} style={styles.contentText}>
          {lineText.substring(lastIndex)}
        </Text>
      );
    }

    // Add the line with all its segments
    segments.push(
      <Text key={`line-${lineIndex}`} style={styles.contentText}>
        {lineSegments}
        {lineIndex < lines.length - 1 ? '\n' : ''}
      </Text>
    );
  });

  return segments;
};

export const JournalReadScreen: React.FC<JournalReadScreenProps> = ({
  journal,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  // Calculate reading progress based on scroll position
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollPosition = contentOffset.y;
    const scrollHeight = contentSize.height - layoutMeasurement.height;

    if (scrollHeight > 0) {
      const progress = Math.min(Math.max((scrollPosition / scrollHeight) * 100, 0), 100);
      setReadingProgress(Math.round(progress));
    } else {
      setReadingProgress(100); // Content fits in one screen
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title={journal.title}
        hideBackButton={!onBack}
        onBack={onBack}
        rightIcon="none"
      />

      {/* Fixed Progress Bar with Blur Background */}
      <BlurView intensity={80} tint="dark" style={styles.progressBarFixed}>
        <View style={styles.progressBarContainer}>
          <ProgressBar
            progress={readingProgress}
            label="Overall Progress"
            showPercentage={true}
            height={6}
            labelStyle={styles.progressLabel}
            percentageStyle={styles.progressPercentage}
          />
        </View>
      </BlurView>

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Journal Content */}
        {journal.description && (
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>
              {parseRichText(journal.description)}
            </Text>
          </View>
        )}

        {/* Empty state if no description */}
        {!journal.description && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No content available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  progressBarFixed: {
    position: "absolute",
    top: 100, // Below the header
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 10,
  },
  progressBarContainer: {
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    marginTop: 70, // Space for fixed progress bar
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  contentContainer: {
    marginBottom: 20,
  },
  contentText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#FFFFFF",
    lineHeight: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default JournalReadScreen;
