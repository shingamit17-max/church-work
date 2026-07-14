import { useState, useEffect } from "react";

export function useDraft<T>(key: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setData(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load draft from localStorage", e);
    }
    setIsLoaded(true);
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
