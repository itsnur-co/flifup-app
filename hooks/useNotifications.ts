import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { notificationService } from '@/services/notifications';
import type { ReminderUnit, TaskReminder } from '@/types/task';

interface UseNotificationsReturn {
  requestPermissions: () => Promise<boolean>;
  scheduleTaskReminder: (
    taskId: string,
    taskTitle: string,
    dueDate: Date,
    dueTime: string | null,
    reminder: { value: number; unit: ReminderUnit }
  ) => Promise<string | null>;
  scheduleAllTaskReminders: (
    taskId: string,
    taskTitle: string,
    dueDate: Date,
    dueTime: string | null,
    reminders: { value: number; unit: ReminderUnit }[]
  ) => Promise<void>;
  cancelTaskReminders: (taskId: string) => Promise<void>;
  scheduleHabitTimeReminder: (
    habitId: string,
    habitTitle: string,
    hour: number,
    minute: number
  ) => Promise<string | null>;
  scheduleHabitOffsetReminder: (
    habitId: string,
    habitTitle: string,
    habitTime: Date,
    offsetMinutes: number
  ) => Promise<string | null>;
  cancelHabitReminders: (habitId: string) => Promise<void>;
  getExpoPushToken: () => Promise<string | null>;
}

/**
 * Convert reminder offset to minutes
 */
function reminderToMinutes(value: number, unit: ReminderUnit): number {
  switch (unit) {
    case 'MINUTES':
      return value;
    case 'HOURS':
      return value * 60;
    case 'DAYS':
      return value * 60 * 24;
    default:
      return value;
  }
}

/**
 * Format reminder label for notification
 */
function formatReminderLabel(value: number, unit: ReminderUnit): string {
  const unitLabels: Record<ReminderUnit, { singular: string; plural: string }> = {
    MINUTES: { singular: 'minute', plural: 'minutes' },
    HOURS: { singular: 'hour', plural: 'hours' },
    DAYS: { singular: 'day', plural: 'days' },
  };

  const label = unitLabels[unit];
  return `${value} ${value === 1 ? label.singular : label.plural}`;
}

/**
 * Hook for managing task and habit notifications
 */
export function useNotifications(): UseNotificationsReturn {
  const router = useRouter();
  const notificationResponseListener = useRef<Notifications.Subscription>();
  const notificationReceivedListener = useRef<Notifications.Subscription>();

  // Set up notification listeners
  useEffect(() => {
    // Listen for notification responses (when user taps)
    notificationResponseListener.current = notificationService.addNotificationResponseListener(
      (response) => {
        const data = response.notification.request.content.data;

        // Navigate based on notification type
        if (data?.type === 'task' && data?.taskId) {
          router.push(`/task-details?id=${data.taskId}`);
        } else if (data?.type === 'habit' && data?.habitId) {
          router.push(`/habit-details?id=${data.habitId}`);
        }
      }
    );

    // Listen for notifications received while app is in foreground
    notificationReceivedListener.current = notificationService.addNotificationReceivedListener(
      (notification) => {
        // You can handle foreground notifications here if needed
        console.log('Notification received:', notification.request.content);
      }
    );

    return () => {
      if (notificationResponseListener.current) {
        Notifications.removeNotificationSubscription(notificationResponseListener.current);
      }
      if (notificationReceivedListener.current) {
        Notifications.removeNotificationSubscription(notificationReceivedListener.current);
      }
    };
  }, [router]);

  /**
   * Request notification permissions
   */
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    return notificationService.requestPermissions();
  }, []);

  /**
   * Schedule a single task reminder
   */
  const scheduleTaskReminder = useCallback(
    async (
      taskId: string,
      taskTitle: string,
      dueDate: Date,
      dueTime: string | null,
      reminder: { value: number; unit: ReminderUnit }
    ): Promise<string | null> => {
      try {
        // Calculate the actual due datetime
        const dueDatetime = new Date(dueDate);
        if (dueTime) {
          const [hours, minutes] = dueTime.split(':').map(Number);
          dueDatetime.setHours(hours, minutes, 0, 0);
        } else {
          // Default to end of day if no time specified
          dueDatetime.setHours(23, 59, 0, 0);
        }

        const offsetMinutes = reminderToMinutes(reminder.value, reminder.unit);
        const notificationId = `task-${taskId}-${reminder.value}-${reminder.unit}`;
        const reminderLabel = formatReminderLabel(reminder.value, reminder.unit);

        return await notificationService.scheduleOffsetNotification(
          notificationId,
          `Task Reminder: ${taskTitle}`,
          `Due in ${reminderLabel}`,
          dueDatetime,
          offsetMinutes,
          {
            type: 'task',
            taskId,
            reminderId: notificationId,
          }
        );
      } catch (error) {
        console.error('Error scheduling task reminder:', error);
        return null;
      }
    },
    []
  );

  /**
   * Schedule all reminders for a task
   */
  const scheduleAllTaskReminders = useCallback(
    async (
      taskId: string,
      taskTitle: string,
      dueDate: Date,
      dueTime: string | null,
      reminders: { value: number; unit: ReminderUnit }[]
    ): Promise<void> => {
      // Cancel existing reminders first
      await notificationService.cancelNotificationsWithPrefix(`task-${taskId}-`);

      // Schedule new reminders
      await Promise.all(
        reminders.map((reminder) =>
          scheduleTaskReminder(taskId, taskTitle, dueDate, dueTime, reminder)
        )
      );
    },
    [scheduleTaskReminder]
  );

  /**
   * Cancel all reminders for a task
   */
  const cancelTaskReminders = useCallback(async (taskId: string): Promise<void> => {
    await notificationService.cancelNotificationsWithPrefix(`task-${taskId}-`);
  }, []);

  /**
   * Schedule a time-based habit reminder (e.g., "9:00 AM daily")
   */
  const scheduleHabitTimeReminder = useCallback(
    async (
      habitId: string,
      habitTitle: string,
      hour: number,
      minute: number
    ): Promise<string | null> => {
      try {
        const notificationId = `habit-time-${habitId}`;

        return await notificationService.scheduleDailyNotification({
          id: notificationId,
          title: `Habit Reminder: ${habitTitle}`,
          body: "Time to complete your habit!",
          hour,
          minute,
          data: {
            type: 'habit',
            habitId,
            reminderType: 'time-based',
          },
        });
      } catch (error) {
        console.error('Error scheduling habit time reminder:', error);
        return null;
      }
    },
    []
  );

  /**
   * Schedule an offset-based habit reminder (e.g., "30 minutes before")
   */
  const scheduleHabitOffsetReminder = useCallback(
    async (
      habitId: string,
      habitTitle: string,
      habitTime: Date,
      offsetMinutes: number
    ): Promise<string | null> => {
      try {
        const notificationId = `habit-offset-${habitId}-${offsetMinutes}`;

        return await notificationService.scheduleOffsetNotification(
          notificationId,
          `Habit Reminder: ${habitTitle}`,
          `Starting in ${offsetMinutes} minutes`,
          habitTime,
          offsetMinutes,
          {
            type: 'habit',
            habitId,
            reminderType: 'offset-based',
          }
        );
      } catch (error) {
        console.error('Error scheduling habit offset reminder:', error);
        return null;
      }
    },
    []
  );

  /**
   * Cancel all reminders for a habit
   */
  const cancelHabitReminders = useCallback(async (habitId: string): Promise<void> => {
    await notificationService.cancelNotificationsWithPrefix(`habit-time-${habitId}`);
    await notificationService.cancelNotificationsWithPrefix(`habit-offset-${habitId}-`);
  }, []);

  /**
   * Get the Expo push token for push notifications
   */
  const getExpoPushToken = useCallback(async (): Promise<string | null> => {
    return notificationService.getExpoPushToken();
  }, []);

  return {
    requestPermissions,
    scheduleTaskReminder,
    scheduleAllTaskReminders,
    cancelTaskReminders,
    scheduleHabitTimeReminder,
    scheduleHabitOffsetReminder,
    cancelHabitReminders,
    getExpoPushToken,
  };
}

export default useNotifications;
