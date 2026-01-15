// Toolbar with action buttons

import { Play, Square, Trash2, FilePlus, FolderOpen, Save } from 'lucide-react';

interface ToolbarProps {
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  onClear: () => void;
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  projectName: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isRunning,
  onRun,
  onStop,
  onClear,
  onNew,
  onOpen,
  onSave,
  projectName,
}) => {
  return (
    <div className="bg-[#F5F5F5] border-b border-[#D3D3D3] px-0 py-0 flex items-center h-8 shadow-sm">
      {/* Left side - File operations */}
      <div className="flex items-center h-full">
        <button
          onClick={onNew}
          className="px-4 py-1 h-full text-sm text-[#333] hover:bg-[#E0E0E0] transition-colors"
          title="New Project (Ctrl+N)"
        >
          New
        </button>
        <button
          onClick={onOpen}
          className="px-4 py-1 h-full text-sm text-[#333] hover:bg-[#E0E0E0] transition-colors"
          title="Open Project (Ctrl+O)"
        >
          Open
        </button>
        <button
          onClick={onSave}
          className="px-4 py-1 h-full text-sm text-[#333] hover:bg-[#E0E0E0] transition-colors"
          title="Save Project (Ctrl+S)"
        >
          Save
        </button>
        <div className="w-px h-5 bg-[#D3D3D3] mx-1" />
        {/* Prominent Run button - Processing style */}
        <button
          onClick={onRun}
          disabled={isRunning}
          className="px-4 py-1 h-full text-sm font-medium text-white bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-1 flex items-center gap-1"
          title="Run Code (Ctrl+R)"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Run</span>
        </button>
        <button
          onClick={onStop}
          disabled={!isRunning}
          className="px-4 py-1 h-full text-sm text-[#333] hover:bg-[#E0E0E0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Stop Execution"
        >
          Stop
        </button>
      </div>

      {/* Right side - Help and settings */}
      <div className="flex-1" />
      <div className="flex items-center h-full">
        <button
          onClick={onClear}
          className="px-4 py-1 h-full text-sm text-[#333] hover:bg-[#E0E0E0] transition-colors"
          title="Clear Console (Ctrl+Shift+C)"
        >
          Clear
        </button>
        <div className="w-px h-5 bg-[#D3D3D3] mx-1" />
        <div className="px-3 text-xs text-[#666]">
          {projectName}
        </div>
      </div>
    </div>
  );
};
