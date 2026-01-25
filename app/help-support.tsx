/**
 * Help & Support Screen
 * Provides FAQs, contact options, and app information
 */

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/navigation/screen-header";
import { ChevronRightIcon } from "@/components/icons";
import { Colors } from "@/constants/colors";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}

export default function HelpSupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const handleEmailSupport = () => {
    const subject = encodeURIComponent("Flifup Support Request");
    const body = encodeURIComponent(
      "Hi Flifup Support Team,\n\nI need help with:\n\n[Please describe your issue here]\n\nApp Version: 1.0.0\n\nThank you!"
    );
    handleOpenLink(`mailto:support@flifup.com?subject=${subject}&body=${body}`);
  };

  const handleReportBug = () => {
    const subject = encodeURIComponent("Flifup Bug Report");
    const body = encodeURIComponent(
      "Hi Flifup Team,\n\nI found a bug:\n\n**What happened:**\n\n**What I expected:**\n\n**Steps to reproduce:**\n\n**App Version:** 1.0.0\n\nThank you!"
    );
    handleOpenLink(`mailto:bugs@flifup.com?subject=${subject}&body=${body}`);
  };

  const handleFeatureRequest = () => {
    const subject = encodeURIComponent("Flifup Feature Request");
    const body = encodeURIComponent(
      "Hi Flifup Team,\n\nI'd love to see this feature:\n\n**Feature description:**\n\n**Why it would be helpful:**\n\nThank you!"
    );
    handleOpenLink(`mailto:feedback@flifup.com?subject=${subject}&body=${body}`);
  };

  const faqItems: FAQItem[] = [
    {
      id: "account",
      question: "How do I create or delete my account?",
      answer:
        "To create an account, sign up using your email or Google account. To delete your account, go to Profile > Settings > Delete Account. Note that this action is irreversible and all your data will be permanently removed.",
    },
    {
      id: "sync",
      question: "Why isn't my data syncing?",
      answer:
        "Data syncing requires an active internet connection. If you're connected but still having issues, try: 1) Pull down to refresh, 2) Log out and log back in, 3) Check if the app needs an update. If problems persist, contact support.",
    },
    {
      id: "notifications",
      question: "How do I enable or disable notifications?",
      answer:
        "Go to Profile > Notifications to manage your notification preferences. You can enable/disable reminders for tasks, habits, and journal entries. Make sure notifications are also enabled in your device settings.",
    },
    {
      id: "habits",
      question: "How do habits and streaks work?",
      answer:
        "Habits are daily activities you want to track. Complete a habit each day to build a streak. Missing a day resets your streak counter. You can set reminder times and track your progress in the Habits tab.",
    },
    {
      id: "tasks",
      question: "Can I share tasks with others?",
      answer:
        "Yes! When creating or editing a task, you can add collaborators by their email. Collaborators will receive notifications and can update the task status. This is great for team projects or shared responsibilities.",
    },
    {
      id: "journal",
      question: "Is my journal private and secure?",
      answer:
        "Absolutely! Your journal entries are encrypted and only accessible to you. We take privacy seriously and never share or analyze your personal journal content.",
    },
    {
      id: "offline",
      question: "Can I use Flifup offline?",
      answer:
        "Basic features work offline, but syncing requires an internet connection. Any changes made offline will sync automatically when you're back online.",
    },
    {
      id: "export",
      question: "How can I export my data?",
      answer:
        "You can request a data export from Profile > Settings > Export Data. We'll email you a complete copy of your data in a standard format within 24 hours.",
    },
  ];

  const supportOptions: SupportOption[] = [
    {
      id: "email",
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: "📧",
      onPress: handleEmailSupport,
    },
    {
      id: "bug",
      title: "Report a Bug",
      description: "Help us improve by reporting issues",
      icon: "🐛",
      onPress: handleReportBug,
    },
    {
      id: "feature",
      title: "Request a Feature",
      description: "Share your ideas with us",
      icon: "💡",
      onPress: handleFeatureRequest,
    },
    {
      id: "rate",
      title: "Rate the App",
      description: "Love Flifup? Leave us a review!",
      icon: "⭐",
      onPress: () => {
        Alert.alert(
          "Rate Flifup",
          "Would you like to rate Flifup on the app store?",
          [
            { text: "Not now", style: "cancel" },
            {
              text: "Rate now",
              onPress: () => {
                // TODO: Replace with actual app store link
                handleOpenLink("https://play.google.com/store/apps");
              }
            },
          ]
        );
      },
    },
  ];

  const quickLinks = [
    {
      id: "website",
      title: "Visit Website",
      icon: "🌐",
      onPress: () => handleOpenLink("https://flifup.com"),
    },
    {
      id: "twitter",
      title: "Follow on Twitter",
      icon: "🐦",
      onPress: () => handleOpenLink("https://twitter.com/flifup"),
    },
    {
      id: "instagram",
      title: "Follow on Instagram",
      icon: "📸",
      onPress: () => handleOpenLink("https://instagram.com/flifup"),
    },
  ];

  return (
    <View style={[styles.container]}>
      <ScreenHeader
        title="Help & Support"
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Support Options */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Get Help</Text>

          <View style={styles.supportGrid}>
            {supportOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.supportCard}
                onPress={option.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.supportIconContainer}>
                  <Text style={styles.supportIcon}>{option.icon}</Text>
                </View>
                <Text style={styles.supportTitle}>{option.title}</Text>
                <Text style={styles.supportDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>

          {faqItems.map((item) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.faqItem}
                onPress={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.faqQuestion}>
                  <Text style={styles.faqQuestionText}>{item.question}</Text>
                  <View style={[
                    styles.chevronContainer,
                    expandedFAQ === item.id && styles.chevronExpanded
                  ]}>
                    <ChevronRightIcon size={20} color="#6B7280" />
                  </View>
                </View>
              </TouchableOpacity>

              {expandedFAQ === item.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Quick Links */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Connect With Us</Text>

          <View style={styles.quickLinksContainer}>
            {quickLinks.map((link) => (
              <TouchableOpacity
                key={link.id}
                style={styles.quickLinkItem}
                onPress={link.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.quickLinkLeft}>
                  <Text style={styles.quickLinkIcon}>{link.icon}</Text>
                  <Text style={styles.quickLinkTitle}>{link.title}</Text>
                </View>
                <ChevronRightIcon size={20} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appInfoTitle}>Flifup</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0 </Text>
          <Text style={styles.appInfoTagline}>
            Organize your life, one habit at a time
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionContainer: {
    marginTop: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.ui.white,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  supportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  supportCard: {
    width: "48%",
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  supportIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  supportIcon: {
    fontSize: 26,
  },
  supportTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.ui.text.primary,
    marginBottom: 4,
    textAlign: "center",
  },
  supportDescription: {
    fontSize: 12,
    color: Colors.ui.text.secondary,
    textAlign: "center",
    lineHeight: 16,
  },
  faqItem: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.ui.text.primary,
    flex: 1,
    paddingRight: 12,
  },
  chevronContainer: {
    marginLeft: 8,
  },
  chevronExpanded: {
    transform: [{ rotate: "90deg" }],
  },
  faqAnswer: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    marginTop: -4,
    marginBottom: 8,
  },
  faqAnswerText: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
    lineHeight: 22,
  },
  quickLinksContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    overflow: "hidden",
  },
  quickLinkItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inputBackground,
  },
  quickLinkLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quickLinkIcon: {
    fontSize: 20,
  },
  quickLinkTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.ui.text.primary,
  },
  appInfoSection: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 16,
    paddingVertical: 24,
  },
  appInfoTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
    marginBottom: 8,
  },
  appInfoTagline: {
    fontSize: 14,
    color: Colors.ui.white,
  },
});
