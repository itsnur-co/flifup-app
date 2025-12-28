/**
 * Profile Service
 * Handles all user profile-related API calls
 */

import { httpClient, ApiResponse } from './client';
import { User } from './auth.service';
import { setUserData } from '@/utils/storage';

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class ProfileService {
  /**
   * Get Current User Profile
   * Fetches the authenticated user's profile data
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return httpClient.get<User>('/users/me', true);
  }

  /**
   * Update User Profile
   * Updates the authenticated user's profile information
   */
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    const response = await httpClient.patch<User>('/users/me', data, true);

    // Update local storage with new user data
    if (response.data && !response.error) {
      await setUserData(response.data);
    }

    return response;
  }

  /**
   * Change Password
   * Updates the authenticated user's password
   */
  async changePassword(
    data: ChangePasswordRequest
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.patch('/users/me/password', data, true);
  }

  /**
   * Upload Avatar
   * Uploads user avatar/profile picture
   * Note: This would typically use multipart/form-data
   */
  async uploadAvatar(imageUri: string): Promise<ApiResponse<{ avatarUrl: string }>> {
    // This is a placeholder - actual implementation would depend on your backend
    // You might need to use FormData for file uploads
    return httpClient.patch('/users/me/avatar', { avatar: imageUri }, true);
  }
}

export const profileService = new ProfileService();
