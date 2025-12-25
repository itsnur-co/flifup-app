import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { Gradients } from '@/constants/theme';
import { useRouter } from 'expo-router';

// Icon Components
const HomeIcon = ({ color = '#FFFFFF', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 22V12H15V22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TaskIcon = ({ color = '#FFFFFF', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 6H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 12H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 18H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 6H3.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 12H3.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 18H3.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PlusIcon = ({ color = '#FFFFFF', size = 28 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 12H19"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LayersIcon = ({ color = '#FFFFFF', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 17L12 22L22 17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 12L12 17L22 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const UserIcon = ({ color = '#FFFFFF', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx="12"
      cy="7"
      r="4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export type TabType = 'home' | 'tasks' | 'add' | 'layers' | 'profile';

interface NavItemProps {
  icon: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
  isCenter?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, isActive, onPress, isCenter = false }) => {
  if (isCenter) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={styles.centerButton}
      >
        <LinearGradient
          colors={[Gradients.primary.start, Gradients.primary.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.centerGradient}
        >
          {icon}
        </LinearGradient>
        {isActive && (
          <View style={styles.activeIndicatorCenter}>
            <LinearGradient
              colors={[Gradients.primary.start, Gradients.primary.end]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.activeIndicatorGradient}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.navItem}
    >
      {isActive ? (
        <LinearGradient
          colors={[Gradients.primary.start, Gradients.primary.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.activeIconContainer}
        >
          {icon}
        </LinearGradient>
      ) : (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      {isActive && (
        <View style={styles.activeIndicator}>
          <LinearGradient
            colors={[Gradients.primary.start, Gradients.primary.end]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activeIndicatorGradient}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

interface BottomNavBarProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab: controlledActiveTab,
  onTabChange
}) => {
  const router = useRouter();
  const [internalActiveTab, setInternalActiveTab] = useState<TabType>('add');
  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabPress = (tab: TabType) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tab);
    }

    // Navigate to specific screens for tasks and habit
    if (tab === 'tasks') {
      router.push('/tasks');
      return;
    }
    if (tab === 'layers') {
      router.push('/habit');
      return;
    }

    onTabChange?.(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <NavItem
          icon={<HomeIcon color="#FFFFFF" size={24} />}
          isActive={activeTab === 'home'}
          onPress={() => handleTabPress('home')}
        />

        <NavItem
          icon={<TaskIcon color="#FFFFFF" size={24} />}
          isActive={activeTab === 'tasks'}
          onPress={() => handleTabPress('tasks')}
        />

        <NavItem
          icon={<PlusIcon color="#FFFFFF" size={28} />}
          isActive={activeTab === 'add'}
          onPress={() => handleTabPress('add')}
          isCenter
        />

        <NavItem
          icon={<LayersIcon color="#FFFFFF" size={24} />}
          isActive={activeTab === 'layers'}
          onPress={() => handleTabPress('layers')}
        />

        <NavItem
          icon={<UserIcon color="#FFFFFF" size={24} />}
          isActive={activeTab === 'profile'}
          onPress={() => handleTabPress('profile')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#000000',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: -8,
  },
  centerGradient: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Gradients.primary.start,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 3,
    overflow: 'hidden',
    borderRadius: 2,
  },
  activeIndicatorCenter: {
    position: 'absolute',
    bottom: -12,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 3,
    overflow: 'hidden',
    borderRadius: 2,
  },
  activeIndicatorGradient: {
    flex: 1,
    width: '100%',
  },
});

export default BottomNavBar;
