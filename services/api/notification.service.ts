/**
 * Notification API Service
 * Handles all notification-related API calls
 */

import { httpClient, ApiResponse } from './client';

export interface Notification {
  id: string;
  userId: string;
  type: 'TASK_ASSIGNED' | 'TASK_REMINDER' | 'HABIT_REMINDER' | 'SYSTEM';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

class NotificationApiService {
  /**
   * Register Expo push token with backend
   */
  async registerPushToken(
    expoPushToken: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return httpClient.post('/notifications/push-token', { expoPushToken }, true);
  }

  /**
   * Remove push token (on logout)
   */
  async removePushToken(): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return httpClient.delete('/notifications/push-token', true);
  }

  /**
   * Get all notifications
   */
  async getNotifications(
    limit = 50,
    offset = 0
  ): Promise<ApiResponse<GetNotificationsResponse>> {
    return httpClient.get(
      `/notifications?limit=${limit}&offset=${offset}`,
      true
    );
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<ApiResponse<UnreadCountResponse>> {
    return httpClient.get('/notifications/unread-count', true);
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(
    notificationId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return httpClient.patch(`/notifications/${notificationId}/read`, {}, true);
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<ApiResponse<{ success: boolean }>> {
    return httpClient.patch('/notifications/read-all', {}, true);
  }

  /**
   * Delete a notification
   */
  async deleteNotification(
    notificationId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return httpClient.delete(`/notifications/${notificationId}`, true);
  }

  /**
   * Delete all notifications
   */
  async deleteAllNotifications(): Promise<ApiResponse<{ success: boolean }>> {
    return httpClient.delete('/notifications', true);
  }
}

export const notificationApiService = new NotificationApiService();
