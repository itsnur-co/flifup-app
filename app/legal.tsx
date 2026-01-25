/**
 * Legal and Policies Screen
 * Displays privacy policy, terms of service, and other legal documents
 */

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/navigation/screen-header";
import { ChevronRightIcon } from "@/components/icons";
import { Colors } from "@/constants/colors";

interface LegalItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}

export default function LegalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const legalItems: LegalItem[] = [
    {
      id: "privacy",
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal data",
      icon: "🔒",
      onPress: () => setExpandedSection(expandedSection === "privacy" ? null : "privacy"),
    },
    {
      id: "terms",
      title: "Terms of Service",
      description: "Rules and guidelines for using Flifup",
      icon: "📜",
      onPress: () => setExpandedSection(expandedSection === "terms" ? null : "terms"),
    },
    {
      id: "data",
      title: "Data Usage",
      description: "How your data is stored and processed",
      icon: "💾",
      onPress: () => setExpandedSection(expandedSection === "data" ? null : "data"),
    },
    {
      id: "cookies",
      title: "Cookie Policy",
      description: "Information about cookies and tracking",
      icon: "🍪",
      onPress: () => setExpandedSection(expandedSection === "cookies" ? null : "cookies"),
    },
    {
      id: "licenses",
      title: "Open Source Licenses",
      description: "Third-party libraries and attributions",
      icon: "📄",
      onPress: () => setExpandedSection(expandedSection === "licenses" ? null : "licenses"),
    },
  ];

  const renderLegalContent = (id: string) => {
    switch (id) {
      case "privacy":
        return (
          <View style={styles.contentSection}>
            <Text style={styles.contentTitle}>Privacy Policy</Text>
            <Text style={styles.contentDate}>Last updated: January 25, 2026</Text>

            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.contentText}>
              We collect information you provide directly to us, including:{"\n"}
              • Account information (name, email, profile picture){"\n"}
              • Task and habit data you create{"\n"}
              • Journal entries and personal notes{"\n"}
              • Usage data and app preferences
            </Text>

            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.contentText}>
              We use the information we collect to:{"\n"}
              • Provide, maintain, and improve our services{"\n"}
              • Send you notifications and reminders{"\n"}
              • Personalize your experience{"\n"}
              • Analyze usage patterns to improve the app
            </Text>

            <Text style={styles.sectionTitle}>3. Data Security</Text>
            <Text style={styles.contentText}>
              We implement industry-standard security measures to protect your data.
              All data is encrypted in transit and at rest. We regularly audit our
              security practices to ensure your information remains safe.
            </Text>

            <Text style={styles.sectionTitle}>4. Your Rights</Text>
            <Text style={styles.contentText}>
              You have the right to:{"\n"}
              • Access your personal data{"\n"}
              • Request data deletion{"\n"}
              • Export your data{"\n"}
              • Opt-out of marketing communications
            </Text>
          </View>
        );
      case "terms":
        return (
          <View style={styles.contentSection}>
            <Text style={styles.contentTitle}>Terms of Service</Text>
            <Text style={styles.contentDate}>Last updated: January 25, 2026</Text>

            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.contentText}>
              By accessing or using Flifup, you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our service.
            </Text>

            <Text style={styles.sectionTitle}>2. User Accounts</Text>
            <Text style={styles.contentText}>
              • You must provide accurate information when creating an account{"\n"}
              • You are responsible for maintaining the security of your account{"\n"}
              • You must be at least 13 years old to use this service{"\n"}
              • One person may not maintain more than one account
            </Text>

            <Text style={styles.sectionTitle}>3. Acceptable Use</Text>
            <Text style={styles.contentText}>
              You agree not to:{"\n"}
              • Violate any applicable laws or regulations{"\n"}
              • Infringe on the rights of others{"\n"}
              • Attempt to gain unauthorized access to our systems{"\n"}
              • Use the service for any illegal or harmful purpose
            </Text>

            <Text style={styles.sectionTitle}>4. Intellectual Property</Text>
            <Text style={styles.contentText}>
              All content and materials available on Flifup are protected by
              intellectual property rights. You retain ownership of any content
              you create within the app.
            </Text>
          </View>
        );
      case "data":
        return (
          <View style={styles.contentSection}>
            <Text style={styles.contentTitle}>Data Usage Policy</Text>
            <Text style={styles.contentDate}>Last updated: January 25, 2026</Text>

            <Text style={styles.sectionTitle}>Data Storage</Text>
            <Text style={styles.contentText}>
              Your data is securely stored on encrypted servers. We use
              industry-leading cloud infrastructure to ensure reliability and security.
            </Text>

            <Text style={styles.sectionTitle}>Data Retention</Text>
            <Text style={styles.contentText}>
              We retain your data for as long as your account is active. You can
              request data deletion at any time through the app settings or by
              contacting our support team.
            </Text>

            <Text style={styles.sectionTitle}>Data Sharing</Text>
            <Text style={styles.contentText}>
              We do not sell your personal data. We may share anonymized,
              aggregated data for analytics purposes. Your personal information
              is only shared with your explicit consent or when required by law.
            </Text>
          </View>
        );
      case "cookies":
        return (
          <View style={styles.contentSection}>
            <Text style={styles.contentTitle}>Cookie Policy</Text>
            <Text style={styles.contentDate}>Last updated: January 25, 2026</Text>

            <Text style={styles.sectionTitle}>What Are Cookies?</Text>
            <Text style={styles.contentText}>
              Cookies are small text files stored on your device. We use them to
              remember your preferences and provide a better user experience.
            </Text>

            <Text style={styles.sectionTitle}>How We Use Cookies</Text>
            <Text style={styles.contentText}>
              • Authentication: To keep you logged in{"\n"}
              • Preferences: To remember your settings{"\n"}
              • Analytics: To understand how you use our app{"\n"}
              • Performance: To improve app speed and reliability
            </Text>

            <Text style={styles.sectionTitle}>Managing Cookies</Text>
            <Text style={styles.contentText}>
              You can manage cookie preferences through your device settings.
              Note that disabling certain cookies may affect app functionality.
            </Text>
          </View>
        );
      case "licenses":
        return (
          <View style={styles.contentSection}>
            <Text style={styles.contentTitle}>Open Source Licenses</Text>
            <Text style={styles.contentDate}>Last updated: January 25, 2026</Text>

            <Text style={styles.sectionTitle}>Acknowledgments</Text>
            <Text style={styles.contentText}>
              Flifup is built using various open-source libraries and frameworks.
              We are grateful to the open-source community for their contributions.
            </Text>

            <Text style={styles.sectionTitle}>Key Dependencies</Text>
            <Text style={styles.contentText}>
              • React Native - MIT License{"\n"}
              • Expo - MIT License{"\n"}
              • NestJS - MIT License{"\n"}
              • Prisma - Apache 2.0 License{"\n"}
              • And many other amazing libraries
            </Text>

            <Text style={styles.sectionTitle}>Full License Information</Text>
            <Text style={styles.contentText}>
              Complete license information for all dependencies can be found
              in our GitHub repository.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container]}>
      <ScreenHeader
        title="Legal and Policies"
        onBack={() => router.back()}

      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info Section */}
        <View style={styles.appInfoCard}>
          <View style={styles.appLogoContainer}>
            <Image
              source={require("@/assets/logo/white-logo.png")}
              style={styles.appLogo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>Flifup</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appCopyright}>© 2026 Flifup. All rights reserved.</Text>
        </View>

        {/* Legal Items */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Legal Documents</Text>

          {legalItems.map((item) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.legalItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.legalItemLeft}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>{item.icon}</Text>
                  </View>
                  <View style={styles.legalItemContent}>
                    <Text style={styles.legalItemTitle}>{item.title}</Text>
                    <Text style={styles.legalItemDescription}>{item.description}</Text>
                  </View>
                </View>
                <View style={[
                  styles.chevronContainer,
                  expandedSection === item.id && styles.chevronExpanded
                ]}>
                  <ChevronRightIcon size={20} color="#6B7280" />
                </View>
              </TouchableOpacity>

              {expandedSection === item.id && renderLegalContent(item.id)}
            </View>
          ))}
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Questions?</Text>
          <Text style={styles.contactText}>
            If you have any questions about our legal policies, please contact us at:
          </Text>
          <TouchableOpacity
            onPress={() => handleOpenLink("mailto:legal@flifup.com")}
          >
            <Text style={styles.contactEmail}>contact.flifup@gmail.com</Text>
          </TouchableOpacity>
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
  appInfoCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  appLogoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  appLogo: {
    width: 36,
    height: 36,
  },
  appName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.ui.text.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: Colors.ui.white,
  },
  sectionContainer: {
    marginBottom: 24,
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
  legalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  legalItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.inputBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  legalItemContent: {
    flex: 1,
  },
  legalItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.ui.text.primary,
    marginBottom: 2,
  },
  legalItemDescription: {
    fontSize: 13,
    color: Colors.ui.text.secondary,
  },
  chevronContainer: {
    marginLeft: 8,
  },
  chevronExpanded: {
    transform: [{ rotate: "90deg" }],
  },
  contentSection: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    marginTop: -4,
    marginBottom: 8,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.ui.text.primary,
    marginBottom: 4,
  },
  contentDate: {
    fontSize: 12,
    color: Colors.ui.white,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
    lineHeight: 22,
  },
  contactSection: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.ui.text.primary,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: Colors.ui.text.secondary,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 20,
  },
  contactEmail: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
});
