/**
 * Journal API Service
 * Handles all journal-related API calls
 */

import {
  CreateCategoryRequest,
  CreateJournalRequest,
  Journal,
  JournalCategory,
  JournalListResponse,
  JournalQueryParams,
  JournalStatisticsResponse,
  MoodInsightsResponse,
  UpdateCategoryRequest,
  UpdateJournalRequest,
} from "@/types/journal";
import { ApiResponse, httpClient } from "./client";

// Build query string from params
const buildQueryString = (params: Record<string, any>): string => {
  const query = Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  return query ? `?${query}` : "";
};

export const journalService = {
  // ============================================
  // Journal CRUD Operations
  // ============================================

  /**
   * Create a new journal entry
   */
  async createJournal(
    data: CreateJournalRequest
  ): Promise<ApiResponse<Journal>> {
    return httpClient.post<Journal>("/journals", data, true);
  },

  /**
   * Get all journals with pagination and filtering
   */
  async getJournals(
    params?: JournalQueryParams
  ): Promise<ApiResponse<JournalListResponse>> {
    const queryString = params ? buildQueryString(params) : "";
    return httpClient.get<JournalListResponse>(`/journals${queryString}`, true);
  },

  /**
   * Get a single journal by ID
   */
  async getJournal(id: string): Promise<ApiResponse<Journal>> {
    return httpClient.get<Journal>(`/journals/${id}`, true);
  },

  /**
   * Update a journal entry
   */
  async updateJournal(
    id: string,
    data: UpdateJournalRequest
  ): Promise<ApiResponse<Journal>> {
    return httpClient.patch<Journal>(`/journals/${id}`, data, true);
  },

  /**
   * Delete a journal entry
   */
  async deleteJournal(id: string): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(`/journals/${id}`, true);
  },

  // ============================================
  // Category Operations
  // ============================================

  /**
   * Get all journal categories
   */
  async getCategories(): Promise<ApiResponse<JournalCategory[]>> {
    return httpClient.get<JournalCategory[]>("/journals/categories/list", true);
  },

  /**
   * Create a new category
   */
  async createCategory(
    data: CreateCategoryRequest
  ): Promise<ApiResponse<JournalCategory>> {
    return httpClient.post<JournalCategory>("/journals/categories", data, true);
  },

  /**
   * Update a category
   */
  async updateCategory(
    id: string,
    data: UpdateCategoryRequest
  ): Promise<ApiResponse<JournalCategory>> {
    return httpClient.patch<JournalCategory>(
      `/journals/categories/${id}`,
      data,
      true
    );
  },

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(
      `/journals/categories/${id}`,
      true
    );
  },

  // ============================================
  // Insights & Statistics
  // ============================================

  /**
   * Get mood insights for a period
   */
  async getMoodInsights(params?: {
    days?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<MoodInsightsResponse>> {
    const queryString = params ? buildQueryString(params) : "";
    return httpClient.get<MoodInsightsResponse>(
      `/journals/insights/mood${queryString}`,
      true
    );
  },

  /**
   * Get journal statistics
   */
  async getStatistics(): Promise<ApiResponse<JournalStatisticsResponse>> {
    return httpClient.get<JournalStatisticsResponse>(
      "/journals/statistics",
      true
    );
  },
};

export default journalService;
