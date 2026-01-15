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
        { name: 'var name = value', description: 'Declare a variable (automatically converted to let)' },
        { name: 'let name = value', description: 'Declare a variable (modern way, recommended)' },
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
    {
      category: 'Lists (Arrays)',
      items: [
        { name: 'let list = []', description: 'Create an empty list (array)' },
        { name: 'let list = [1, 2, 3]', description: 'Create a list with items' },
        { name: 'list[0]', description: 'Access item at index (first item is 0)' },
        { name: 'createList(...items)', description: 'Create a new list with items' },
        { name: 'append(list, item)', description: 'Add an item to the end of a list' },
        { name: 'getLength(list)', description: 'Get the number of items in a list' },
        { name: 'getItem(list, index)', description: 'Get an item at a specific index (with bounds checking)' },
        { name: 'setItem(list, index, value)', description: 'Set an item at a specific index (with bounds checking)' },
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

          {/* Key Concepts */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-ide-text mb-4">
              Key Concepts
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-ide-toolbar rounded">
                <h4 className="text-sm font-semibold text-ide-accent mb-2">
                  var vs let
                </h4>
                <p className="text-sm text-ide-text mb-2">
                  Both <code className="text-ide-accent">var</code> and <code className="text-ide-accent">let</code> declare variables. In this IDE, <code className="text-ide-accent">var</code> is automatically converted to <code className="text-ide-accent">let</code>, so they work the same way.
                </p>
                <p className="text-sm text-ide-text">
                  <strong>Example:</strong> <code className="text-ide-accent">var x = 10</code> and <code className="text-ide-accent">let x = 10</code> both work the same.
                </p>
              </div>
              <div className="p-3 bg-ide-toolbar rounded">
                <h4 className="text-sm font-semibold text-ide-accent mb-2">
                  Arrays [] vs Objects {}
                </h4>
                <p className="text-sm text-ide-text mb-2">
                  <strong>Arrays <code className="text-ide-accent">[]</code>:</strong> Store lists of items. Access items by number: <code className="text-ide-accent">list[0]</code>
                </p>
                <p className="text-sm text-ide-text mb-2">
                  <strong>Objects <code className="text-ide-accent">{}</code>:</strong> Store key-value pairs. Access items by name: <code className="text-ide-accent">obj.name</code>
                </p>
                <p className="text-sm text-ide-text">
                  <strong>Examples:</strong><br />
                  <code className="text-ide-accent">let list = [1, 2, 3]</code> - Array with numbers<br />
                  <code className="text-ide-accent">let obj = {"{"}name: "John", age: 20{"}"}</code> - Object with properties
                </p>
              </div>
              <div className="p-3 bg-ide-toolbar rounded">
                <h4 className="text-sm font-semibold text-ide-accent mb-2">
                  Important Syntax
                </h4>
                <p className="text-sm text-ide-text">
                  Always use <code className="text-ide-accent">=</code> when assigning values:<br />
                  ✓ <code className="text-ide-accent">let list = []</code> (correct)<br />
                  ✗ <code className="text-ide-accent">let list []</code> (missing = sign)
                </p>
              </div>
            </div>
          </div>

          {/* Editor Features */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-ide-text mb-4">
              Editor Features
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-ide-toolbar rounded">
                <h4 className="text-sm font-semibold text-ide-accent mb-2">
                  Word Highlighting
                </h4>
                <p className="text-sm text-ide-text">
                  Click on any word to highlight all occurrences in your code. This helps you find where variables and functions are used.
                </p>
              </div>
              <div className="p-3 bg-ide-toolbar rounded">
                <h4 className="text-sm font-semibold text-ide-accent mb-2">
                  Bracket Matching
                </h4>
                <p className="text-sm text-ide-text">
                  Click on any bracket ( ), [ ], or { } to see its matching pair highlighted. This helps you find missing or extra brackets.
                </p>
              </div>
              <div className="p-3 bg-ide-toolbar rounded">
                <h4 className="text-sm font-semibold text-ide-accent mb-2">
                  Error Highlighting
                </h4>
                <p className="text-sm text-ide-text">
                  When an error occurs, the console shows which line has the error, and that line is highlighted in red in the code editor.
                </p>
              </div>
            </div>
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
