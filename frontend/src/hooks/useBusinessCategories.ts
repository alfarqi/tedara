import { useState, useEffect, useCallback } from 'react';
import { businessCategoryService } from '../services/businessCategoryService';
import type { BusinessCategory } from '../types/businessCategory';
import { useAuth } from '../contexts/AuthContext';

// Simple cache to store categories across component re-renders
let cachedCategories: BusinessCategory[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 10 * 1000; // 10 seconds for testing (set to 5 minutes in production)

export const useBusinessCategories = () => {
  const [categories, setCategories] = useState<BusinessCategory[]>(cachedCategories || []);
  const [loading, setLoading] = useState(!cachedCategories);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchCategories = useCallback(async (forceRefresh = false) => {
    
    // Check cache first
    const now = Date.now();
    if (!forceRefresh && cachedCategories && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
      setCategories(cachedCategories);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await businessCategoryService.getCategories(token || undefined);
      const fetchedCategories = response.data || [];
      
      setCategories(fetchedCategories);
      
      // Update cache
      cachedCategories = fetchedCategories;
      cacheTimestamp = now;
    } catch (err) {
      console.error('Failed to fetch business categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createCategory = useCallback(async (name: string, description?: string) => {
    try {
      const response = await businessCategoryService.createCategory(name, description, token || undefined);
      // Add the new category to the list if it was created
      if (response.data) {
        const newCategories = [...categories];
        // Check if category already exists to avoid duplicates
        const exists = newCategories.some(cat => cat.id === response.data.id);
        if (!exists) {
          newCategories.push(response.data);
          setCategories(newCategories);
          // Update cache
          cachedCategories = newCategories;
          cacheTimestamp = Date.now();
        }
      }
      return response.data;
    } catch (err) {
      console.error('Failed to create business category:', err);
      throw err;
    }
  }, [token, categories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: () => fetchCategories(true), // Force refresh when explicitly called
    createCategory,
  };
};
