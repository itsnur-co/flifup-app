/**
 * Profile Service
 * Handles all user profile-related API calls
 */

import { httpClient, ApiResponse } from './client';
import { API_CONFIG } from './config';
import { User } from './auth.service';
import { setUserData, getAccessToken } from '@/utils/storage';

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class ProfileService {
  /**
   * Get Current User Profile
   * Fetches the authenticated user's profile data
   */
  async getProfile(): Promise<ApiResponse<{ success: boolean; data: User }>> {
    return httpClient.get<{ success: boolean; data: User }>('/profile', true);
  }

  /**
   * Update User Profile
   * Updates the authenticated user's profile information (name/email)
   */
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<{ success: boolean; message: string; data: User }>> {
    const response = await httpClient.patch<{ success: boolean; message: string; data: User }>('/profile', data, true);

    // Update local storage with new user data
    if (response.data?.data && !response.error) {
      await setUserData(response.data.data);
    }

    return response;
  }

  /**
   * Change Password
   * Updates the authenticated user's password
   */
  async changePassword(
    data: ChangePasswordRequest
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return httpClient.patch('/profile/password', data, true);
  }

  /**
   * Upload Profile Image
   * Uploads user profile picture using multipart/form-data
   */
  async uploadProfileImage(imageUri: string): Promise<ApiResponse<{ success: boolean; message: string; data: User }>> {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        return { error: 'No access token found' };
      }

      // Create FormData for image upload
      const formData = new FormData();

      // Extract filename from URI
      const filename = imageUri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      // @ts-ignore - React Native FormData supports this
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type: type,
      });

      const url = `${API_CONFIG.BASE_URL}/profile/image`;

      const fetchResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const responseData = await fetchResponse.json();

      if (!fetchResponse.ok) {
        return {
          error: responseData.message || responseData.error || 'Failed to upload image',
          data: responseData,
        };
      }

      // Update local storage with new user data
      if (responseData.data) {
        await setUserData(responseData.data);
      }

      return { data: responseData };
    } catch (error) {
      console.error('Upload image error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to upload image',
      };
    }
  }
}

export const profileService = new ProfileService();
