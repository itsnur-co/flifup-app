import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNavBar, { TabType } from '@/components/navigation/BottomNavBar';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { WeekCalendar } from '@/components/calendar';
import { CreateButton } from '@/components/buttons';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('add');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Text style={styles.contentText}>Home Screen</Text>;
      case 'tasks':
        return (
          <View style={styles.tasksContainer}>
            <LinearGradient
              colors={['#8B5CF6', '#6D28D9', '#5B21B6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.backgroundGradient}
            >
              <ScreenHeader
                title="Task List"
                useGlassmorphism={true}
                hideBackButton={true}
              />
              <ScrollView style={styles.scrollView}>
                <WeekCalendar
                  onDateSelect={(date) => console.log('Selected date:', date)}
                  onMonthPress={() => console.log('Month pressed')}
                  onTodayPress={() => console.log('Today pressed')}
                />
                <View style={styles.taskContent}>
                  <Text style={styles.contentText}>Your tasks will appear here</Text>

                  <View style={styles.buttonDemo}>
                    <CreateButton
                      label="New Task"
                      onPress={() => console.log('Create task pressed')}
                    />
                  </View>
                </View>
              </ScrollView>
            </LinearGradient>
          </View>
        );
      case 'add':
        return <Text style={styles.contentText}>Add Screen</Text>;
      case 'layers':
        return <Text style={styles.contentText}>Layers Screen</Text>;
      case 'profile':
        return <Text style={styles.contentText}>Profile Screen</Text>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tasksContainer: {
    flex: 1,
    width: '100%',
  },
  backgroundGradient: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  taskContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: 300,
  },
  buttonDemo: {
    marginTop: 30,
    gap: 16,
    width: '100%',
    maxWidth: 300,
  },
});
