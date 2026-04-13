import { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axios";

const CACHE_KEY = "cachedShortlets";
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const PAGE_LIMIT = 12;

export const useShortlets = () => {
  const [shortlets, setShortlets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);

  // Get cached data
  const getCachedShortlets = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);

      // Check if cache is expired
      if (Date.now() - timestamp > CACHE_EXPIRY_MS) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn("Failed to parse cachedShortlets", e);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, []);

  // Cache shortlets
  const cacheShortlets = useCallback((data) => {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (e) {
      console.warn("Failed to cache shortlets", e);
    }
  }, []);

  // Fetch initial page
  const fetchInitial = useCallback(async () => {
    // Check cache first
    const cached = getCachedShortlets();
    if (cached && cached.length > 0) {
      setShortlets(cached);
    }

    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/properties/public", {
        params: { page: 1, limit: PAGE_LIMIT },
      });

      const list = Array.isArray(data.properties)
        ? data.properties
        : Array.isArray(data)
        ? data
        : [];

      setShortlets(list);
      setPage(1);
      setHasMore(list.length >= PAGE_LIMIT);

      // Cache only the first page
      cacheShortlets(list);
    } catch (err) {
      console.error("❌ Failed to fetch shortlets:", err);
      setError("Failed to load shortlets. Please refresh the page.");
      // Don't clear existing data on error
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [getCachedShortlets, cacheShortlets]);

  // Fetch next page
  const fetchMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;

    try {
      setLoadingMore(true);
      setError("");

      const nextPage = page + 1;

      const { data } = await api.get("/properties/public", {
        params: { page: nextPage, limit: PAGE_LIMIT },
      });

      const list = Array.isArray(data.properties)
        ? data.properties
        : Array.isArray(data)
        ? data
        : [];

      // Append new data without duplicating by id
      setShortlets((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = list.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });

      setPage(nextPage);
      setHasMore(list.length >= PAGE_LIMIT);
    } catch (err) {
      console.error("❌ Failed to fetch more shortlets:", err);
      // Don't show error for loading more, silently fail
      // User can scroll again to retry
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [page, hasMore]);

  // Initial fetch
  useEffect(() => {
    fetchInitial();
  }, []);

  return {
    shortlets,
    loading,
    loadingMore,
    error,
    hasMore,
    fetchMore,
    refetch: fetchInitial,
  };
};
