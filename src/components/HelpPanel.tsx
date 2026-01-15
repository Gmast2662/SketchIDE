// Help documentation panel

import { X, BookOpen } from 'lucide-react';

interface HelpPanelProps {
  onClose: () => void;
}

export const HelpPanel: React.FC<HelpPanelProps> = ({ onClose }) => {
  const commands = [
    {
      category: 'Drawing',
      items: [
        {
          name: 'size(w, h)',
          description: 'Set canvas size (use in setup)',
        },
        {
          name: 'background(r, g, b)',
          description: 'Fill the canvas with a color',
        },
        { name: 'fill(r, g, b)', description: 'Set fill color for shapes' },
        { name: 'stroke(r, g, b)', description: 'Set outline color' },
        {
          name: 'ellipse(x, y, w, h)',
          description: 'Draw a circle or ellipse',
        },
        { name: 'rect(x, y, w, h)', description: 'Draw a rectangle' },
        { name: 'line(x1, y1, x2, y2)', description: 'Draw a line' },
        { name: 'triangle(x1, y1, x2, y2, x3, y3)', description: 'Draw a triangle' },
        { name: 'quad(x1, y1, x2, y2, x3, y3, x4, y4)', description: 'Draw a quadrilateral' },
        { name: 'arc(x, y, w, h, start, stop)', description: 'Draw an arc' },
        { name: 'point(x, y)', description: 'Draw a single point' },
        {
          name: 'text(str, x, y, size)',
          description: 'Draw text on canvas',
        },
      ],
    },
    {
      category: 'Variables & Logic',
      items: [
        { name: 'var name = value', description: 'Declare a variable' },
        { name: 'if (condition) { }', description: 'Conditional statement' },
        { name: 'while (condition) { }', description: 'Loop while true' },
        { name: 'and, or, not', description: 'Logical operators' },
      ],
    },
    {
      category: 'Functions',
      items: [
        {
          name: 'function setup() { }',
          description: 'Runs once at the start',
        },
        {
          name: 'function loop() { }',
          description: 'Runs repeatedly for animation',
        },
        { name: 'print(message)', description: 'Output to console' },
        { name: 'input(prompt)', description: 'Get user input' },
        { name: 'random(min, max)', description: 'Random number' },
        { name: 'map(value, start1, stop1, start2, stop2)', description: 'Re-map a number from one range to another' },
        { name: 'constrain(value, min, max)', description: 'Constrain a value between min and max' },
        { name: 'dist(x1, y1, x2, y2)', description: 'Calculate distance between two points' },
        { name: 'abs(n), sqrt(n), pow(n, e)', description: 'Math functions' },
        { name: 'sin(a), cos(a), tan(a)', description: 'Trigonometric functions' },
        { name: 'floor(n), ceil(n), round(n)', description: 'Rounding functions' },
        { name: 'min(a, b), max(a, b)', description: 'Get minimum or maximum value' },
      ],
    },
  ];

  const shortcuts = [
    { keys: 'Ctrl + R', action: 'Run code' },
    { keys: 'Ctrl + S', action: 'Save project' },
    { keys: 'Ctrl + N', action: 'New project' },
    { keys: 'Ctrl + O', action: 'Open project' },
    { keys: 'Ctrl + Shift + C', action: 'Clear console' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-ide-panel border border-ide-border rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-ide-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-ide-accent" />
            <h2 className="text-lg font-semibold text-ide-text">
              Documentation
            </h2>
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
          {/* Commands */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-ide-text mb-4">
              Available Commands
            </h3>
            {commands.map((section) => (
              <div key={section.category} className="mb-6">
                <h4 className="text-sm font-semibold text-ide-accent uppercase tracking-wide mb-3">
                  {section.category}
                </h4>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div
                      key={item.name}
                      className="p-3 bg-ide-toolbar rounded flex items-start gap-4"
                    >
                      <code className="text-ide-accent font-mono text-sm flex-shrink-0">
                        {item.name}
                      </code>
                      <span className="text-sm text-ide-text">
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-lg font-semibold text-ide-text mb-4">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2">
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.keys}
                  className="p-3 bg-ide-toolbar rounded flex items-center justify-between"
                >
                  <span className="text-sm text-ide-text">
                    {shortcut.action}
                  </span>
                  <kbd className="px-3 py-1 bg-ide-panel border border-ide-border rounded text-xs text-ide-accent font-mono">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
