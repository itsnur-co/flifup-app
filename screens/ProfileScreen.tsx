/**
 * Profile Screen
 * User profile settings and preferences
 * Matches Figma design exactly
 */

import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { authService, User } from "@/services/api/auth.service";
import { profileService } from "@/services/api/profile.service";
import { getRefreshToken, getUserData } from "@/utils/storage";
import { Colors } from "@/constants/colors";
// Icons
import {
  GlobeIcon,
  HelpIcon,
  LockIcon,
  LogoutIcon,
  NotificationFilledIcon,
  NotificationOutlineIcon,
  ReferIcon,
  ShieldIcon,
  ThreeDotsIcon,
  UpgradeIcon,
} from "@/components/icons/ProfileIcons";

// Constants
import { ChevronRightIcon } from "@/components/icons";
import {
  BottomTabBar,
  ScreenHeader,
  type TabName,
} from "@/components/navigation";

// Types
interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress: () => void;
  isLogout?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState("English");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile on mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);

      // Get user data from local storage
      const localUser = await getUserData();
      if (localUser) {
        setUser(localUser);
      }

      // TODO: Uncomment when backend profile endpoint is ready
      // Then fetch fresh data from API
      // const response = await profileService.getProfile();
      // if (response.data && !response.error) {
      //   setUser(response.data);
      // } else if (response.error) {
      //   console.error("Failed to fetch profile:", response.error);
      // }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab navigation
  const handleTabPress = (tab: TabName) => {
    if (tab === "home") {
      router.push("/");
    } else if (tab === "tasks") {
      router.push("/tasks");
    } else if (tab === "habits") {
      router.push("/habit");
    } else if (tab === "profile") {
      // Already on profile
      return;
    }
  };

  const handleAddPress = () => {
    console.log("Add button pressed from profile");
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);
          try {
            const refreshToken = await getRefreshToken();

            if (!refreshToken) {
              // No refresh token, just clear storage and navigate
              await authService.logout("");
              router.replace("/auth/login");
              return;
            }

            // Call logout API
            const response = await authService.logout(refreshToken);

            if (response.error) {
              Alert.alert("Error", response.error);
              setIsLoggingOut(false);
              return;
            }

            // Navigate to login screen
            router.replace("/auth/login");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  // General menu items
  const generalItems: MenuItem[] = [
    {
      id: "password",
      icon: <LockIcon size={24} color="#FFFFFF" />,
      label: "Change Password",
      onPress: () => console.log("Change Password"),
    },
    {
      id: "notifications",
      icon: <NotificationOutlineIcon size={24} color="#FFFFFF" />,
      label: "Notifications",
      onPress: () => console.log("Notifications"),
    },
  ];

  // Language item (full width)
  const languageItem: MenuItem = {
    id: "language",
    icon: <GlobeIcon size={24} color="#FFFFFF" />,
    label: "Language",
    value: language,
    onPress: () => console.log("Language"),
  };

  // Preferences menu items
  const preferencesItems: MenuItem[] = [
    {
      id: "refer",
      icon: <ReferIcon size={24} color="#FFFFFF" />,
      label: "Refer to friends",
      onPress: () => console.log("Refer to friends"),
    },
    {
      id: "upgrade",
      icon: <UpgradeIcon size={24} color="#FFFFFF" />,
      label: "Upgrade Plan",
      onPress: () => console.log("Upgrade Plan"),
    },
    {
      id: "legal",
      icon: <ShieldIcon size={24} color="#FFFFFF" />,
      label: "Legal and Policies",
      onPress: () => console.log("Legal and Policies"),
    },
    {
      id: "help",
      icon: <HelpIcon size={24} color="#FFFFFF" />,
      label: "Help & Support",
      onPress: () => console.log("Help & Support"),
    },
  ];

  // Render grid menu item (half width)
  const renderGridItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.gridItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.gridItemIcon}>{item.icon}</View>
      <Text style={styles.gridItemLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  // Render full width menu item
  const renderFullWidthItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.fullWidthItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.fullWidthItemLeft}>
        {item.icon}
        <Text style={styles.fullWidthItemLabel}>{item.label}</Text>
      </View>
      <View style={styles.fullWidthItemRight}>
        {item.value && (
          <Text style={styles.fullWidthItemValue}>{item.value}</Text>
        )}
        <ChevronRightIcon size={20} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Loading Overlay */}
      {isLoggingOut && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Logging out...</Text>
        </View>
      )}

      {/* Header */}
      <ScreenHeader
        title="Profile"
        hideBackButton
        rightIcon={
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
              <NotificationFilledIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
              <ThreeDotsIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        {isLoading ? (
          <View style={styles.profileCard}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingProfileText}>Loading profile...</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.profileCard}
            activeOpacity={0.7}
            onPress={() => console.log("Edit Profile")}
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarPlaceholderText}>
                  {user?.fullName?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
            )}
            <Text style={styles.userName}>{user?.fullName || "User"}</Text>
            <ChevronRightIcon size={24} color="#6B7280" />
          </TouchableOpacity>
        )}

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>

          {/* Grid Items (2 columns) */}
          <View style={styles.gridContainer}>
            {generalItems.map(renderGridItem)}
          </View>

          {/* Language (Full width) */}
          {renderFullWidthItem(languageItem)}
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencess</Text>

          {/* Grid Items (2 columns) */}
          <View style={styles.gridContainer}>
            {preferencesItems.map(renderGridItem)}
          </View>

          {/* Logout (Full width) */}
          <TouchableOpacity
            style={styles.logoutItem}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <LogoutIcon size={24} color="#E50000" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar
        activeTab="profile"
        onTabPress={handleTabPress}
        onAddPress={handleAddPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginRight: 24,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loadingProfileText: {
    fontSize: 15,
    color: "#8E8E93",
    marginLeft: 12,
  },
  userName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 16,
  },
  gridItemIcon: {
    marginBottom: 12,
  },
  gridItemLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  fullWidthItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 16,
  },
  fullWidthItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fullWidthItemLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  fullWidthItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fullWidthItemValue: {
    fontSize: 15,
    color: "#8E8E93",
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginTop: 12,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#E50000",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});
