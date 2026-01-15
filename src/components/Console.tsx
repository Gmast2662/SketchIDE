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
        return <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-[#0066CC] flex-shrink-0" />;
    }
  };

  const getTextColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-[#333]';
    }
  };

  return (
    <div className="h-full bg-white border-t border-[#D3D3D3] flex flex-col">
      {/* Console header */}
      <div className="px-4 py-2 border-b border-[#D3D3D3] flex items-center justify-between bg-[#F5F5F5]">
        <div className="text-sm font-medium text-[#333]">Console</div>
        <button
          onClick={onClear}
          className="text-xs text-[#666] hover:text-[#333] transition-colors"
        >
          Clear (Ctrl+Shift+C)
        </button>
      </div>

      {/* Console messages */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {messages.length === 0 ? (
          <div className="text-[#999] italic">
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
                <div className="text-xs text-[#999]">
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
