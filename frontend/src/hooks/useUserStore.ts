import React, { useState, useEffect, useCallback, useRef } from 'react';
import { storeService } from '../services/storeService';
import type { Store } from '../types/store';
import { useAuth } from '../contexts/AuthContext';

// Global cache to prevent unnecessary re-fetches
const storeCache = new Map<string, { store: Store | null; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useUserStore = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const currentUserId = useRef<string | null>(null);
  const isInitialLoad = useRef(true);
  
  // Safely get auth context with error handling
  let user, token;
  try {
    const authContext = useAuth();
    user = authContext.user;
    token = authContext.token;
  } catch (error) {
    user = null;
    token = null;
  }

  // Check cache immediately on mount to avoid loading state
  React.useEffect(() => {
    if (user?.id && user.role === 'store_owner') {
      const cacheKey = user.id.toString();
      const cached = storeCache.get(cacheKey);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        setStore(cached.store);
        setLoading(false);
        hasFetched.current = true;
        isInitialLoad.current = false;
      }
    }
  }, [user?.id]);

  const fetchUserStore = useCallback(async () => {
    if (!user || !token || user.role !== 'store_owner') {
      setLoading(false);
      isInitialLoad.current = false;
      return;
    }

    // Check cache first
    const cacheKey = user.id.toString();
    const cached = storeCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      setStore(cached.store);
      setLoading(false);
      isInitialLoad.current = false;
      return;
    }

    // Only show loading state if this is not the initial load
    if (!isInitialLoad.current) {
      setLoading(true);
    }
    setError(null);
    
    try {
      // Get stores for the current user
      const response = await storeService.getStores({}, token);
      
      // Find the store owned by the current user
      let userStore: Store | null = null;
      if (response.data && response.data.length > 0) {
        userStore = response.data.find((s: Store) => s.owner_id === user.id) || null;
      }
      
      setStore(userStore);
      
      // Update cache
      storeCache.set(cacheKey, { store: userStore, timestamp: now });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch store');
      setStore(null);
    } finally {
      setLoading(false);
      isInitialLoad.current = false;
    }
  }, [user, token]);

  useEffect(() => {
    // Only fetch if user ID actually changed or we haven't fetched yet
    const userId = user?.id?.toString() || null;
    
    if (userId !== currentUserId.current || !hasFetched.current) {
      currentUserId.current = userId;
      fetchUserStore();
      hasFetched.current = true;
    }
  }, [user?.id, fetchUserStore]);

  return { store, loading, error, refetch: fetchUserStore };
};
