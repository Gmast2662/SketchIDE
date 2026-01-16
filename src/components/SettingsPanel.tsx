// Settings panel component

import { X, Settings, Palette, Type, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SettingsPanelProps {
  onClose: () => void;
}

type Theme = 'dark' | 'light';
type FontFamily = 'monospace' | 'sans-serif' | 'serif';
type FontSize = 'small' | 'medium' | 'large';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('sketchide-theme') as Theme) || 'dark';
  });
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    return (localStorage.getItem('sketchide-font-family') as FontFamily) || 'monospace';
  });
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('sketchide-font-size') as FontSize) || 'medium';
  });
  const [canvasSize, setCanvasSize] = useState(() => {
    const saved = localStorage.getItem('sketchide-default-canvas-size');
    return saved ? JSON.parse(saved) : { width: 400, height: 300 };
  });

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sketchide-theme', theme);
  }, [theme]);

  // Apply font family
  useEffect(() => {
    const fontValue = fontFamily === 'monospace' ? 'monospace' :
      fontFamily === 'sans-serif' ? 'sans-serif' : 'serif';
    document.documentElement.style.setProperty('--editor-font-family', fontValue);
    // Apply directly to all code editor textareas (use setTimeout to ensure DOM is ready)
    setTimeout(() => {
      const editorTextareas = document.querySelectorAll('textarea.code-editor-textarea') as NodeListOf<HTMLTextAreaElement>;
      editorTextareas.forEach(textarea => {
        textarea.style.fontFamily = fontValue;
      });
    }, 0);
    localStorage.setItem('sketchide-font-family', fontFamily);
  }, [fontFamily]);

  // Apply font size
  useEffect(() => {
    const sizeMap = {
      small: '12px',
      medium: '14px',
      large: '16px',
    };
    const sizeValue = sizeMap[fontSize];
    document.documentElement.style.setProperty('--editor-font-size', sizeValue);
    // Apply directly to all code editor textareas (use setTimeout to ensure DOM is ready)
    setTimeout(() => {
      const editorTextareas = document.querySelectorAll('textarea.code-editor-textarea') as NodeListOf<HTMLTextAreaElement>;
      editorTextareas.forEach(textarea => {
        textarea.style.fontSize = sizeValue;
      });
    }, 0);
    localStorage.setItem('sketchide-font-size', fontSize);
  }, [fontSize]);

  // Save canvas size
  useEffect(() => {
    localStorage.setItem('sketchide-default-canvas-size', JSON.stringify(canvasSize));
  }, [canvasSize]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-ide-panel border border-ide-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-ide-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-ide-accent" />
            <h2 className="text-lg font-semibold text-ide-text">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ide-toolbar rounded transition-colors"
          >
            <X className="w-5 h-5 text-ide-text" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Theme Settings */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-ide-accent" />
              <h3 className="text-base font-semibold text-ide-text">Theme</h3>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-ide-toolbar rounded cursor-pointer hover:bg-ide-panel transition-colors">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={(e) => setTheme(e.target.value as Theme)}
                  className="w-4 h-4 text-ide-accent"
                />
                <span className="text-sm text-ide-text">Dark</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-ide-toolbar rounded cursor-pointer hover:bg-ide-panel transition-colors">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={(e) => setTheme(e.target.value as Theme)}
                  className="w-4 h-4 text-ide-accent"
                />
                <span className="text-sm text-ide-text">Light</span>
              </label>
            </div>
          </div>

          {/* Font Settings */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-ide-accent" />
              <h3 className="text-base font-semibold text-ide-text">Font</h3>
            </div>
            
            {/* Font Family */}
            <div className="mb-4">
              <label className="block text-sm text-ide-textDim mb-2">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as FontFamily)}
                className="w-full px-3 py-2 bg-ide-toolbar border border-ide-border rounded text-sm text-ide-text focus:outline-none focus:ring-2 focus:ring-ide-accent"
              >
                <option value="monospace">Monospace</option>
                <option value="sans-serif">Sans-serif</option>
                <option value="serif">Serif</option>
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm text-ide-textDim mb-2">Font Size</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-ide-toolbar rounded cursor-pointer hover:bg-ide-panel transition-colors">
                  <input
                    type="radio"
                    name="fontSize"
                    value="small"
                    checked={fontSize === 'small'}
                    onChange={(e) => setFontSize(e.target.value as FontSize)}
                    className="w-4 h-4 text-ide-accent"
                  />
                  <span className="text-sm text-ide-text">Small (12px)</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-ide-toolbar rounded cursor-pointer hover:bg-ide-panel transition-colors">
                  <input
                    type="radio"
                    name="fontSize"
                    value="medium"
                    checked={fontSize === 'medium'}
                    onChange={(e) => setFontSize(e.target.value as FontSize)}
                    className="w-4 h-4 text-ide-accent"
                  />
                  <span className="text-sm text-ide-text">Medium (14px)</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-ide-toolbar rounded cursor-pointer hover:bg-ide-panel transition-colors">
                  <input
                    type="radio"
                    name="fontSize"
                    value="large"
                    checked={fontSize === 'large'}
                    onChange={(e) => setFontSize(e.target.value as FontSize)}
                    className="w-4 h-4 text-ide-accent"
                  />
                  <span className="text-sm text-ide-text">Large (16px)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Canvas Settings */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Monitor className="w-4 h-4 text-ide-accent" />
              <h3 className="text-base font-semibold text-ide-text">Default Canvas Size</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-ide-textDim mb-2">Width</label>
                <input
                  type="number"
                  value={canvasSize.width}
                  onChange={(e) => setCanvasSize({ ...canvasSize, width: parseInt(e.target.value) || 400 })}
                  min="100"
                  max="2000"
                  className="w-full px-3 py-2 bg-ide-toolbar border border-ide-border rounded text-sm text-ide-text focus:outline-none focus:ring-2 focus:ring-ide-accent"
                />
              </div>
              <div>
                <label className="block text-sm text-ide-textDim mb-2">Height</label>
                <input
                  type="number"
                  value={canvasSize.height}
                  onChange={(e) => setCanvasSize({ ...canvasSize, height: parseInt(e.target.value) || 300 })}
                  min="100"
                  max="2000"
                  className="w-full px-3 py-2 bg-ide-toolbar border border-ide-border rounded text-sm text-ide-text focus:outline-none focus:ring-2 focus:ring-ide-accent"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 bg-ide-toolbar rounded">
            <p className="text-xs text-ide-textDim">
              Settings are saved automatically and will persist across sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
