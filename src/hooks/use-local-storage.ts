"use client";

import { useState, useEffect } from "react";

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsed = JSON.parse(item);
      // Ensure dates are correctly parsed back into Date objects
      if (Array.isArray(parsed)) {
        return parsed.map(obj => {
          if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(k => {
              if (typeof obj[k] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(obj[k])) {
                obj[k] = new Date(obj[k]);
              }
            });
          }
          return obj;
        }) as T;
      }
      return parsed;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
         if (Array.isArray(parsed)) {
            setStoredValue(parsed.map(obj => {
                if (typeof obj === 'object' && obj !== null) {
                    Object.keys(obj).forEach(k => {
                        if (typeof obj[k] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(obj[k])) {
                            obj[k] = new Date(obj[k]);
                        }
                    });
                }
                return obj;
            }) as T);
        } else {
             setStoredValue(parsed);
        }
      }
    } catch (error) {
        console.error(error)
    }
  }, [key]);


  return [storedValue, setValue];
}

export default useLocalStorage;
