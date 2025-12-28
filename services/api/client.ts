/**
 * HTTP Client
 * Handles all HTTP requests with proper error handling and token management
 */

import { API_CONFIG } from './config';
import { getAccessToken } from '@/utils/storage';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Makes HTTP request with proper error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;

      const config: RequestInit = {
        ...options,
        headers: {
          ...API_CONFIG.HEADERS,
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.message || data.error || 'Something went wrong',
          data: data,
        };
      }

      return { data };
    } catch (error) {
      console.error('HTTP Client Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  /**
   * Makes authenticated request with access token
   */
  private async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return { error: 'No access token found' };
    }

    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, authenticated = false): Promise<ApiResponse<T>> {
    if (authenticated) {
      return this.authenticatedRequest<T>(endpoint, { method: 'GET' });
    }
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    authenticated = false
  ): Promise<ApiResponse<T>> {
    const options: RequestInit = {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    };

    if (authenticated) {
      return this.authenticatedRequest<T>(endpoint, options);
    }
    return this.request<T>(endpoint, options);
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    authenticated = false
  ): Promise<ApiResponse<T>> {
    const options: RequestInit = {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    };

    if (authenticated) {
      return this.authenticatedRequest<T>(endpoint, options);
    }
    return this.request<T>(endpoint, options);
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    authenticated = false
  ): Promise<ApiResponse<T>> {
    const options: RequestInit = {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    };

    if (authenticated) {
      return this.authenticatedRequest<T>(endpoint, options);
    }
    return this.request<T>(endpoint, options);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, authenticated = false): Promise<ApiResponse<T>> {
    if (authenticated) {
      return this.authenticatedRequest<T>(endpoint, { method: 'DELETE' });
    }
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const httpClient = new HttpClient(API_CONFIG.BASE_URL);
