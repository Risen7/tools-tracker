// src/hooks/useLocalStorage.ts
import { useState, useEffect } from "react";

// Keeps React state synchronized with a value in browser local storage.
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Read the saved value once when the hook is initialized.
  const [state, setState] = useState<T>(() => {
    try {
      // Get the raw JSON string stored under the supplied key.
      const raw = localStorage.getItem(key);
      // Parse saved data or use the initial value when no data exists.
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      // Use the initial value if storage is unavailable or invalid.
      return initialValue;
    }
  });

  // Persist every state change back to local storage.
  useEffect(() => {
    try {
      // Convert the current state to JSON before saving it.
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore storage failures so the in-memory app can continue working.
    }
  }, [key, state]);

  // Return state and its setter with the same shape as useState.
  return [state, setState] as const;
}
