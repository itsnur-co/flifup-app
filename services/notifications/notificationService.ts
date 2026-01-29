import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface ScheduleNotificationOptions {
  id?: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  trigger: Date | Notifications.NotificationTriggerInput;
}

export interface DailyNotificationOptions {
  id?: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  hour: number;
  minute: number;
}

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn('Notifications require a physical device');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permissions not granted');
      return false;
    }

    // Set up notification channel for Android
    if (Platform.OS === 'android') {
      await this.setupAndroidChannel();
    }

    return true;
  }

  /**
   * Setup Android notification channel
   */
  private async setupAndroidChannel(): Promise<void> {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E6F4FE',
      sound: 'notification_sound.mp3',
    });

    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Reminders',
      description: 'Task and habit reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E6F4FE',
      sound: 'notification_sound.mp3',
    });

    await Notifications.setNotificationChannelAsync('assignments', {
      name: 'Task Assignments',
      description: 'Notifications when someone assigns you a task',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E6F4FE',
      sound: 'notification_sound.mp3',
    });
  }

  /**
   * Schedule a one-time notification
   */
  async scheduleNotification(options: ScheduleNotificationOptions): Promise<string> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Notification permissions not granted');
    }

    let trigger: Notifications.NotificationTriggerInput;
    if (options.trigger instanceof Date) {
      trigger = {
        type: SchedulableTriggerInputTypes.DATE,
        date: options.trigger
      };
    } else {
      trigger = options.trigger;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      identifier: options.id,
      content: {
        title: options.title,
        body: options.body,
        data: options.data || {},
        sound: 'notification_sound.mp3',
      },
      trigger,
    });

    return notificationId;
  }

  /**
   * Schedule a daily recurring notification
   */
  async scheduleDailyNotification(options: DailyNotificationOptions): Promise<string> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Notification permissions not granted');
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      identifier: options.id,
      content: {
        title: options.title,
        body: options.body,
        data: options.data || {},
        sound: 'notification_sound.mp3',
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
        hour: options.hour,
        minute: options.minute,
      },
    });

    return notificationId;
  }

  /**
   * Schedule a notification relative to a target time (offset-based)
   * @param targetTime The time the task/habit is due
   * @param offsetMinutes Minutes before the target time to send notification
   */
  async scheduleOffsetNotification(
    id: string,
    title: string,
    body: string,
    targetTime: Date,
    offsetMinutes: number,
    data?: Record<string, unknown>
  ): Promise<string | null> {
    const notificationTime = new Date(targetTime.getTime() - offsetMinutes * 60 * 1000);

    // Don't schedule if notification time is in the past
    if (notificationTime <= new Date()) {
      console.warn('Notification time is in the past, skipping');
      return null;
    }

    return this.scheduleNotification({
      id,
      title,
      body,
      data,
      trigger: notificationTime,
    });
  }

  /**
   * Cancel a specific notification by ID
   */
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancel all notifications with a specific prefix
   */
  async cancelNotificationsWithPrefix(prefix: string): Promise<void> {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

    const notificationsToCancel = scheduledNotifications.filter(
      (notification) => notification.identifier.startsWith(prefix)
    );

    await Promise.all(
      notificationsToCancel.map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier)
      )
    );
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get all scheduled notifications
   */
  async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return Notifications.getAllScheduledNotificationsAsync();
  }

  /**
   * Get the Expo push token for push notifications
   */
  async getExpoPushToken(): Promise<string | null> {
    if (!Device.isDevice) {
      console.warn('Push notifications require a physical device');
      return null;
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      return null;
    }

    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.error('Project ID not found in app config');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  /**
   * Add a notification received listener
   */
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Add a notification response listener (when user taps notification)
   */
  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * Get the badge count
   */
  async getBadgeCount(): Promise<number> {
    return Notifications.getBadgeCountAsync();
  }

  /**
   * Set the badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }
}

export const notificationService = NotificationService.getInstance();
export default notificationService;
