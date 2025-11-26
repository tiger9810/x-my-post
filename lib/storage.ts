// Utility functions for localStorage management

const CACHE_PREFIX = 'x-my-posts-';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface CacheData<T> {
    data: T;
    timestamp: number;
}

/**
 * Save data to localStorage with timestamp
 */
export function setCache<T>(key: string, data: T): void {
    try {
        const cacheData: CacheData<T> = {
            data,
            timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

/**
 * Get data from localStorage if not expired
 */
export function getCache<T>(key: string): T | null {
    try {
        const item = localStorage.getItem(CACHE_PREFIX + key);
        if (!item) return null;

        const cacheData: CacheData<T> = JSON.parse(item);
        const isExpired = Date.now() - cacheData.timestamp > CACHE_DURATION;

        if (isExpired) {
            localStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }

        return cacheData.data;
    } catch (error) {
        console.error('Failed to read from localStorage:', error);
        return null;
    }
}

/**
 * Clear specific cache
 */
export function clearCache(key: string): void {
    try {
        localStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
        console.error('Failed to clear cache:', error);
    }
}

/**
 * Clear all app caches
 */
export function clearAllCache(): void {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
            if (key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    } catch (error) {
        console.error('Failed to clear all cache:', error);
    }
}
