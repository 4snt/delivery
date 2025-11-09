"use client";

import { useState, useEffect } from 'react';
import { fetchApi } from '@/utils';
import { ApiResponse } from '@/types';

/**
 * Custom hook for data fetching with loading and error states
 */
export function useFetch<T>(endpoint: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      const result = await fetchApi<T>(endpoint, options);
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setData(result.data);
      }
      
      setLoading(false);
    }

    loadData();
  }, [endpoint]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    const result = await fetchApi<T>(endpoint, options);
    
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setData(result.data);
    }
    
    setLoading(false);
  };

  return { data, loading, error, refetch };
}
