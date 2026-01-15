// Keyboard shortcuts hook

import { useEffect } from 'react';

interface Shortcuts {
  'Ctrl+R'?: () => void;
  'Ctrl+S'?: () => void;
  'Ctrl+Shift+S'?: () => void;
  'Ctrl+N'?: () => void;
  'Ctrl+Shift+C'?: () => void;
  'Ctrl+O'?: () => void;
  'Ctrl+Shift+F'?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: Shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && e.key === 'r') {
        e.preventDefault();
        shortcuts['Ctrl+R']?.();
      } else if (isCtrl && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        shortcuts['Ctrl+Shift+S']?.();
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
      } else if (isCtrl && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        shortcuts['Ctrl+Shift+F']?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
