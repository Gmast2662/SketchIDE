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
    <div className="bg-[#2D2D30] border-b border-ide-border px-4 py-2 flex items-center gap-2">
      {/* Run/Stop buttons */}
      <button
        onClick={onRun}
        disabled={isRunning}
        className="flex items-center gap-2 px-4 py-2 bg-ide-success text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        title="Run Code (Ctrl+R)"
      >
        <Play className="w-4 h-4" />
        <span className="font-medium">Run</span>
      </button>

      <button
        onClick={onStop}
        disabled={!isRunning}
        className="flex items-center gap-2 px-4 py-2 bg-ide-error text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        title="Stop Execution"
      >
        <Square className="w-4 h-4" />
        <span className="font-medium">Stop</span>
      </button>

      <div className="w-px h-6 bg-ide-border mx-1" />

      {/* File operations */}
      <button
        onClick={onNew}
        className="p-2 text-ide-text hover:bg-ide-panel rounded transition-colors"
        title="New Project (Ctrl+N)"
      >
        <FilePlus className="w-4 h-4" />
      </button>

      <button
        onClick={onOpen}
        className="p-2 text-ide-text hover:bg-ide-panel rounded transition-colors"
        title="Open Project (Ctrl+O)"
      >
        <FolderOpen className="w-4 h-4" />
      </button>

      <button
        onClick={onSave}
        className="p-2 text-ide-text hover:bg-ide-panel rounded transition-colors"
        title="Save Project (Ctrl+S)"
      >
        <Save className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-ide-border mx-1" />

      <button
        onClick={onClear}
        className="p-2 text-ide-text hover:bg-ide-panel rounded transition-colors"
        title="Clear Console (Ctrl+Shift+C)"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Project name */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-sm text-ide-text font-medium">
          {projectName}
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isRunning ? 'bg-ide-success animate-pulse' : 'bg-ide-textDim'
          }`}
        />
        <span className="text-xs text-ide-textDim">
          {isRunning ? 'Running' : 'Ready'}
        </span>
      </div>
    </div>
  );
};
