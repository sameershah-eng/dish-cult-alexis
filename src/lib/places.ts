import { useEffect, useState, useRef } from 'react';
import { Restaurant } from '../types';
import { RESTAURANTS_DATA } from '../data/restaurants';

// In-memory cache for places requests
const placesCache = new Map<string, Restaurant[]>();
const placeDetailCache = new Map<string, Restaurant>();
const inflightRequests = new Map<string, Promise<any>>();

/**
 * Returns secure serverless proxy URL for Google Places photos.
 * Clamps width between 200 and 1600.
 */
export function placePhotoUrl(photoName: string, width: number = 800): string {
  if (!photoName) return '';
  // If already full URL, return directly
  if (photoName.startsWith('http')) return photoName;
  const clampedWidth = Math.min(Math.max(200, width), 1600);
  return `/api/photo?name=${encodeURIComponent(photoName)}&w=${clampedWidth}`;
}

export interface UsePlacesOptions {
  query?: string;
  city?: string;
  limit?: number;
  type?: string;
}

export interface UsePlacesResult {
  places: Restaurant[];
  loading: boolean;
  error: string | null;
  isMockFallback: boolean;
  refetch: () => void;
}

export function usePlaces(options: UsePlacesOptions = {}): UsePlacesResult {
  const { query = 'best restaurants', city = 'Glasgow', limit = 12, type } = options;
  const cacheKey = `${query}__${city}__${limit}__${type || ''}`;

  const [places, setPlaces] = useState<Restaurant[]>(() => {
    return placesCache.get(cacheKey) || [];
  });
  const [loading, setLoading] = useState<boolean>(!placesCache.has(cacheKey));
  const [error, setError] = useState<string | null>(null);
  const [isMockFallback, setIsMockFallback] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let isMounted = true;

    // Check cache first
    if (placesCache.has(cacheKey) && reloadKey === 0) {
      setPlaces(placesCache.get(cacheKey)!);
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchData = async () => {
      // Filter mock data as baseline fallback
      const getFilteredMock = () => {
        let list = [...RESTAURANTS_DATA];
        if (city && city.toLowerCase() !== 'all') {
          const matchCity = list.filter(
            (r) => r.city.toLowerCase() === city.toLowerCase()
          );
          if (matchCity.length > 0) list = matchCity;
        }
        if (query && query !== 'best restaurants' && query.trim() !== '') {
          const q = query.toLowerCase();
          const matchQuery = list.filter(
            (r) =>
              r.name.toLowerCase().includes(q) ||
              r.cuisine.toLowerCase().includes(q) ||
              r.neighbourhood.toLowerCase().includes(q)
          );
          if (matchQuery.length > 0) list = matchQuery;
        }
        return list.slice(0, limit);
      };

      try {
        const queryParams = new URLSearchParams({
          query,
          city,
          limit: limit.toString(),
        });
        if (type) queryParams.set('type', type);

        const url = `/api/places?${queryParams.toString()}`;

        // De-duplicate inflight network requests
        let fetchPromise = inflightRequests.get(url);
        if (!fetchPromise) {
          fetchPromise = fetch(url).then(async (res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          });
          inflightRequests.set(url, fetchPromise);
        }

        const data = await fetchPromise;
        inflightRequests.delete(url);

        if (isMounted) {
          if (data && Array.isArray(data.places) && data.places.length > 0) {
            placesCache.set(cacheKey, data.places);
            setPlaces(data.places);
            setIsMockFallback(false);
          } else {
            // Fallback to mock
            const fallback = getFilteredMock();
            setPlaces(fallback);
            setIsMockFallback(true);
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          // Graceful fallback to rich mock data
          const fallback = getFilteredMock();
          setPlaces(fallback);
          setIsMockFallback(true);
          setError(null); // Silent fallback as requested by spec
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [cacheKey, reloadKey]);

  return { places, loading, error, isMockFallback, refetch };
}

export interface UsePlaceResult {
  restaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
  isMockFallback: boolean;
}

export function usePlace(idOrSlug: string): UsePlaceResult {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(() => {
    return placeDetailCache.get(idOrSlug) || null;
  });
  const [loading, setLoading] = useState<boolean>(!restaurant);
  const [error, setError] = useState<string | null>(null);
  const [isMockFallback, setIsMockFallback] = useState<boolean>(false);

  useEffect(() => {
    if (!idOrSlug) return;
    let isMounted = true;

    if (placeDetailCache.has(idOrSlug)) {
      setRestaurant(placeDetailCache.get(idOrSlug)!);
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchPlace = async () => {
      // Find in local mock dataset first as guaranteed fallback
      const findMock = () => {
        return (
          RESTAURANTS_DATA.find(
            (r) => r.slug === idOrSlug || r.id === idOrSlug
          ) || RESTAURANTS_DATA[0]
        );
      };

      try {
        const url = `/api/place?id=${encodeURIComponent(idOrSlug)}`;
        let fetchPromise = inflightRequests.get(url);
        if (!fetchPromise) {
          fetchPromise = fetch(url).then(async (res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          });
          inflightRequests.set(url, fetchPromise);
        }

        const data = await fetchPromise;
        inflightRequests.delete(url);

        if (isMounted) {
          if (data && data.restaurant) {
            placeDetailCache.set(idOrSlug, data.restaurant);
            setRestaurant(data.restaurant);
            setIsMockFallback(false);
          } else {
            const fallback = findMock();
            setRestaurant(fallback);
            setIsMockFallback(true);
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          const fallback = findMock();
          setRestaurant(fallback);
          setIsMockFallback(true);
          setError(null);
          setLoading(false);
        }
      }
    };

    fetchPlace();

    return () => {
      isMounted = false;
    };
  }, [idOrSlug]);

  return { restaurant, loading, error, isMockFallback };
}
