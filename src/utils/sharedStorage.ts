import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

const readLocalValue = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved) as T;
  } catch (error) {
    console.error(error);
  }
  return fallback;
};

export const useSharedStorage = <T,>(key: string, fallback: T): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => readLocalValue(key, fallback));
  const [remoteLoaded, setRemoteLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/data?key=${encodeURIComponent(key)}`)
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (!cancelled && data?.value !== undefined) {
          setValue(data.value as T);
          localStorage.setItem(key, JSON.stringify(data.value));
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setRemoteLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }

    if (!remoteLoaded) return;

    fetch('/api/data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    }).catch(() => undefined);
  }, [key, value, remoteLoaded]);

  return [value, setValue];
};
