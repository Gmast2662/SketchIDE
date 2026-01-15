// Auto-save hook for code changes

import { useEffect, useRef } from 'react';
import { storage } from '../lib/storage';

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export const useAutoSave = (code: string, enabled: boolean = true) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      storage.autoSave(code);
      console.log('Auto-saved code');
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code, enabled]);
};
