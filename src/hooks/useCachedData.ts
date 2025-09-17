import { useEffect, useRef, useState } from 'react';

export type CachedEntry<T> = {
  value: T;
  ts: number; // timestamp ms
};

export interface UseCachedDataOptions<T> {
  maxAgeMs?: number; // consider fresh for this duration; default 5 min
  // Optional transform before saving to cache (e.g., remove volatile fields)
  serialize?: (v: T) => T;
  // Optional transform when reading from cache
  deserialize?: (v: T) => T;
  // If true, always revalidate in background on mount when cache exists (SWR behavior). Default: true
  revalidateOnMount?: boolean;
  // Optional predicate: if returns false, ignore the freshly fetched data
  shouldAccept?: (prev: T | undefined, next: T) => boolean;
}

export interface UseCachedDataResult<T> {
  data: T | undefined;
  isLoading: boolean; // true only when no cached data is available and fetch in progress
  isRefreshing: boolean; // true when we have cache but fetching fresh in background
  hasCache: boolean; // true when a cached entry exists in localStorage (even if stale)
  error: any;
  refresh: () => Promise<void>;
}

function readFromStorage<T>(storage: Storage, key: string): CachedEntry<T> | undefined {
  try {
    const raw = storage.getItem(key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'value' in parsed && 'ts' in parsed) {
      return parsed as CachedEntry<T>;
    }
    return { value: parsed as T, ts: 0 } as CachedEntry<T>;
  } catch {
    return undefined;
  }
}

function writeToStorage<T>(storage: Storage, key: string, val: CachedEntry<T>) {
  try {
    const serialized = JSON.stringify(val);
    storage.setItem(key, serialized);
  } catch (e) {
    // ignore quota errors
  }
}

function getLocal<T>(key: string): CachedEntry<T> | undefined {
  const fromSession = typeof sessionStorage !== 'undefined' ? readFromStorage<T>(sessionStorage, key) : undefined;
  const fromLocal = typeof localStorage !== 'undefined' ? readFromStorage<T>(localStorage, key) : undefined;
  if (fromSession && fromLocal) {
    const sessionVal: any = (fromSession as any).value;
    const localVal: any = (fromLocal as any).value;
    const sessionLen = Array.isArray(sessionVal) ? sessionVal.length : (sessionVal && typeof sessionVal === 'object' ? Object.keys(sessionVal).length : (sessionVal ? 1 : 0));
    const localLen = Array.isArray(localVal) ? localVal.length : (localVal && typeof localVal === 'object' ? Object.keys(localVal).length : (localVal ? 1 : 0));
    // Prefer the one that appears to have more content
    return localLen > sessionLen ? fromLocal : fromSession;
  }
  return fromSession || fromLocal;
}

function setLocal<T>(key: string, val: CachedEntry<T>) {
  // Clear old cache keys to free up space
  if (typeof localStorage !== 'undefined') {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('brands:list') || k.startsWith('articles:') || k.startsWith('cached:'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      // ignore errors
    }
  }
  
  if (typeof sessionStorage !== 'undefined') {
    writeToStorage<T>(sessionStorage, key, val);
  }
  if (typeof localStorage !== 'undefined') {
    writeToStorage<T>(localStorage, key, val);
  }
}

/**
 * Stale-while-revalidate cached data hook using localStorage.
 * It returns cached data immediately if present, then refreshes in the background.
 */
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  opts: UseCachedDataOptions<T> = {}
): UseCachedDataResult<T> {
  const { maxAgeMs = 5 * 60 * 1000, serialize, deserialize, revalidateOnMount = true, shouldAccept } = opts;
  const [data, setData] = useState<T | undefined>(() => {
    const cached = getLocal<T>(key);
    if (!cached) return undefined;
    return deserialize ? deserialize(cached.value) : cached.value;
  });
  const [error, setError] = useState<any>(null);
  const [hasCache, setHasCache] = useState<boolean>(() => Boolean(getLocal<T>(key)));
  const [isLoading, setIsLoading] = useState<boolean>(() => !getLocal<T>(key));
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const cached = getLocal<T>(key);
    setHasCache(Boolean(cached));
    const now = Date.now();
    const isStale = !cached || now - cached.ts > maxAgeMs;

    const doFetch = async () => {
      try {
        if (!cached) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }
        const fresh = await fetcher();
        if (!mounted.current) return;
        if (!shouldAccept || shouldAccept(data, fresh)) {
          setData(fresh);
          const toSave = serialize ? serialize(fresh) : fresh;
          setLocal<T>(key, { value: toSave, ts: Date.now() });
          setHasCache(true);
          setError(null);
        }
        // If rejected, keep previous state/cache
      } catch (e) {
        if (!mounted.current) return;
        setError(e);
      } finally {
        if (!mounted.current) return;
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    // On mount:
    // - If no cache: fetch and show loading spinner
    // - If cache exists: revalidate in background when revalidateOnMount is true
    // - Otherwise: fetch only if stale
    if (!cached) {
      void doFetch();
    } else if (revalidateOnMount) {
      void doFetch();
    } else if (isStale) {
      void doFetch();
    }

    return () => {
      mounted.current = false;
    };
  // We intentionally avoid adding fetcher to deps to not re-create; caller should change key when needed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, maxAgeMs, revalidateOnMount]);

  const refresh = async () => {
    try {
      setIsRefreshing(true);
      const fresh = await fetcher();
      if (!mounted.current) return;
      if (!shouldAccept || shouldAccept(data, fresh)) {
        setData(fresh);
        const toSave = serialize ? serialize(fresh) : fresh;
        setLocal<T>(key, { value: toSave, ts: Date.now() });
        setHasCache(true);
        setError(null);
      }
    } catch (e) {
      if (!mounted.current) return;
      setError(e);
    } finally {
      if (!mounted.current) return;
      setIsRefreshing(false);
    }
  };

  return { data, isLoading, isRefreshing, hasCache, error, refresh };
}

export default useCachedData;
