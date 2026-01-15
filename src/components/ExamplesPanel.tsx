// Examples panel component

import { X, BookOpen } from 'lucide-react';
import { EXAMPLES } from '../constants/examples';
import type { Example } from '../types';

interface ExamplesPanelProps {
  onClose: () => void;
  onSelectExample: (example: Example) => void;
}

export const ExamplesPanel: React.FC<ExamplesPanelProps> = ({
  onClose,
  onSelectExample,
}) => {
  // Group examples by category
  const groupedExamples = EXAMPLES.reduce((acc, example) => {
    if (!acc[example.category]) {
      acc[example.category] = [];
    }
    acc[example.category].push(example);
    return acc;
  }, {} as Record<string, Example[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-ide-panel border border-ide-border rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-ide-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-ide-accent" />
            <h2 className="text-lg font-semibold text-ide-text">
              Example Projects
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ide-toolbar rounded transition-colors"
          >
            <X className="w-5 h-5 text-ide-text" />
          </button>
        </div>

        {/* Examples list */}
        <div className="flex-1 overflow-auto p-6">
          {Object.entries(groupedExamples).map(([category, examples]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-semibold text-ide-accent uppercase tracking-wide mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {examples.map((example) => (
                  <button
                    key={example.id}
                    onClick={() => {
                      onSelectExample(example);
                      onClose();
                    }}
                    className="p-4 bg-ide-toolbar hover:bg-ide-border border border-ide-border rounded-lg text-left transition-all group"
                  >
                    <div className="text-ide-text font-medium mb-1 group-hover:text-ide-accent transition-colors">
                      {example.name}
                    </div>
                    <div className="text-xs text-ide-textDim line-clamp-2">
                      {example.code.split('\n')[0].replace('//', '').trim()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
