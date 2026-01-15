// Console output component

import { useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import type { ConsoleMessage } from '../types';

interface ConsoleProps {
  messages: ConsoleMessage[];
  onClear: () => void;
}

export const Console: React.FC<ConsoleProps> = ({ messages, onClear }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-ide-error flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-ide-warning flex-shrink-0" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-ide-success flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-ide-accent flex-shrink-0" />;
    }
  };

  const getTextColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return 'text-ide-error';
      case 'warning':
        return 'text-ide-warning';
      case 'success':
        return 'text-ide-success';
      default:
        return 'text-ide-text';
    }
  };

  return (
    <div className="h-full bg-ide-panel border-t border-ide-border flex flex-col">
      {/* Console header */}
      <div className="px-4 py-2 border-b border-ide-border flex items-center justify-between">
        <div className="text-sm font-medium text-ide-text">Console</div>
        <button
          onClick={onClear}
          className="text-xs text-ide-textDim hover:text-ide-text transition-colors"
        >
          Clear (Ctrl+Shift+C)
        </button>
      </div>

      {/* Console messages */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {messages.length === 0 ? (
          <div className="text-ide-textDim italic">
            Console output will appear here...
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, index) => (
              <div key={`${msg.id}-${index}`} className="flex items-start gap-2">
                {getIcon(msg.type)}
                <div className={`flex-1 ${getTextColor(msg.type)}`}>
                  {msg.line !== undefined ? (
                    <span className="font-semibold">Line {msg.line}: </span>
                  ) : null}
                  {msg.message}
                </div>
                <div className="text-xs text-ide-textDim">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>
    </div>
  );
};
