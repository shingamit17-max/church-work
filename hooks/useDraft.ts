import { useState, useEffect } from "react";

export function useDraft<T>(key: string, initialValue: T) {
  const [data, setData] = useState<T>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error("Failed to load draft from localStorage", e);
      }
    }
    return initialValue;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 0);
    return () => clearTimeout(t);
  }, [key]);

  const setDraftData = (newData: Partial<T> | ((prev: T) => T)) => {
    setData((prev) => {
      const updated = typeof newData === "function" ? newData(prev) : { ...prev, ...newData };
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  };

  const clearDraft = () => {
    localStorage.removeItem(key);
    setData(initialValue);
  };

  return { data, setDraftData, clearDraft, isLoaded };
}
