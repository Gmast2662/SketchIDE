// Keyboard shortcuts hook

import { useEffect } from 'react';

interface Shortcuts {
  'Ctrl+R'?: () => void;
  'Ctrl+S'?: () => void;
  'Ctrl+N'?: () => void;
  'Ctrl+Shift+C'?: () => void;
  'Ctrl+O'?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: Shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && e.key === 'r') {
        e.preventDefault();
        shortcuts['Ctrl+R']?.();
      } else if (isCtrl && e.key === 's') {
        e.preventDefault();
        shortcuts['Ctrl+S']?.();
      } else if (isCtrl && e.key === 'n') {
        e.preventDefault();
        shortcuts['Ctrl+N']?.();
      } else if (isCtrl && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        shortcuts['Ctrl+Shift+C']?.();
      } else if (isCtrl && e.key === 'o') {
        e.preventDefault();
        shortcuts['Ctrl+O']?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
