/**
 * Auth Service
 * Handles all authentication-related API calls
 */

import {
  removeTokens,
  removeUserData,
  setTokens,
  setUserData,
} from "@/utils/storage";
import { ApiResponse, httpClient } from "./client";
import { API_ENDPOINTS } from "./config";

export interface User {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  isActive?: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface InitiateSignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface VerifySignupOtpRequest {
  email: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

class AuthService {
  /**
   * Initiate Signup - Step 1
   * Sends OTP to user's email
   */
  async initiateSignup(
    data: InitiateSignupRequest
  ): Promise<ApiResponse<{ message: string; expiresIn: number }>> {
    return httpClient.post(API_ENDPOINTS.AUTH.INITIATE_SIGNUP, data);
  }

  /**
   * Verify Signup OTP - Step 2
   * Verifies OTP and creates user account
   */
  async verifySignupOtp(
    data: VerifySignupOtpRequest
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.VERIFY_SIGNUP_OTP,
      data
    );

    // Store tokens and user data on successful signup
    if (response.data && !response.error) {
      await setTokens(response.data.accessToken, response.data.refreshToken);
      await setUserData(response.data.user);
    }

    return response;
  }

  /**
   * Login
   * Authenticates user and returns tokens
   */
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );

    // Store tokens and user data on successful login
    if (response.data && !response.error) {
      await setTokens(response.data.accessToken, response.data.refreshToken);
      await setUserData(response.data.user);
    }

    return response;
  }

  /**
   * Refresh Token
   * Gets new access token using refresh token
   */
  async refreshToken(
    data: RefreshTokenRequest
  ): Promise<
    ApiResponse<{
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }>
  > {
    const response = await httpClient.post<{
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }>(API_ENDPOINTS.AUTH.REFRESH, data);

    // Update tokens on successful refresh
    if (response.data && !response.error) {
      await setTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response;
  }

  /**
   * Logout
   * Invalidates refresh token
   */
  async logout(
    refreshToken: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await httpClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.LOGOUT,
      { refreshToken }
    );

    // Clear local storage
    await removeTokens();
    await removeUserData();

    return response;
  }

  /**
   * Logout All Devices
   * Invalidates all refresh tokens for the user
   */
  async logoutAll(): Promise<ApiResponse<{ message: string }>> {
    const response = await httpClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.LOGOUT_ALL,
      {},
      true // authenticated
    );

    // Clear local storage
    await removeTokens();
    await removeUserData();

    return response;
  }

  /**
   * Forgot Password
   * Sends OTP to user's email for password reset
   */
  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<{ message: string; expiresIn: number }>> {
    return httpClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  }

  /**
   * Verify OTP (Password Reset)
   * Verifies OTP and returns reset token
   */
  async verifyOtp(
    data: VerifyOtpRequest
  ): Promise<
    ApiResponse<{ message: string; resetToken: string; expiresIn: number }>
  > {
    return httpClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
  }

  /**
   * Reset Password
   * Resets password using reset token
   */
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ApiResponse<{ message: string }>> {
    return httpClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }

  /**
   * Google Login
   * Authenticates user with Google ID token
   */
  async googleLogin(
    data: GoogleLoginRequest
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.GOOGLE,
      data
    );

    // Store tokens and user data on successful Google login
    if (response.data && !response.error) {
      await setTokens(response.data.accessToken, response.data.refreshToken);
      await setUserData(response.data.user);
    }

    return response;
  }
}

export const authService = new AuthService();
