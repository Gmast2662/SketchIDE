// Main application component

import { useState, useRef, useCallback } from 'react';
import { MenuBar } from './components/layout/MenuBar';
import { Toolbar } from './components/layout/Toolbar';
import { CodeEditor } from './components/CodeEditor';
import { Canvas } from './components/Canvas';
import { Console } from './components/Console';
import { ExamplesPanel } from './components/ExamplesPanel';
import { ProjectsPanel } from './components/ProjectsPanel';
import { HelpPanel } from './components/HelpPanel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutoSave } from './hooks/useAutoSave';
import { CodeInterpreter } from './lib/interpreter';
import { storage } from './lib/storage';
import { DEFAULT_CODE } from './constants/examples';
import type { ConsoleMessage, Project, Example } from './types';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const interpreterRef = useRef<CodeInterpreter | null>(null);

  const [code, setCode] = useState(() => {
    // Try to load auto-saved code or use default
    return storage.getAutoSaved() || DEFAULT_CODE;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 300 });
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
    return localStorage.getItem('hasSeenWelcome') === 'true';
  });
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });

  // Auto-save
  useAutoSave(code);

  // Add console message
  const addConsoleMessage = useCallback(
    (message: string, type: ConsoleMessage['type'] = 'info', line?: number) => {
      setConsoleMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type,
          message,
          timestamp: Date.now(),
          line,
        },
      ]);
    },
    []
  );

  // Run code
  const handleRun = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear console and error highlighting
    setConsoleMessages([]);
    setErrorLine(null);
    
    // Reset canvas size to default
    setCanvasSize({ width: 400, height: 300 });
    
    addConsoleMessage('Running code...', 'info');

    // Stop any existing execution
    if (interpreterRef.current) {
      interpreterRef.current.stop();
    }

    // Helper function to extract line number from error
    const extractLineNumber = (error: unknown, code: string): number | null => {
      if (!(error instanceof Error)) return null;
      
      const errorMessage = error.message;
      const stack = error.stack || '';
      const codeLines = code.split('\n');
      
      // Try multiple patterns to extract line number
      // Pattern 1: "line X" or "Line X" in error message
      let match = errorMessage.match(/[Ll]ine[:\s]+(\d+)/);
      if (match) {
        const lineNum = parseInt(match[1], 10);
        if (lineNum > 0 && lineNum <= codeLines.length) {
          return lineNum;
        }
      }
      
      // Pattern 2: Syntax errors often have position information
      // Look for "Unexpected token" or similar with position
      match = errorMessage.match(/position[:\s]+(\d+)/i);
      if (match) {
        const position = parseInt(match[1], 10);
        if (position >= 0 && position < code.length) {
          const lineNum = code.substring(0, position).split('\n').length;
          if (lineNum > 0 && lineNum <= codeLines.length) {
            return lineNum;
          }
        }
      }
      
      // Pattern 3: Look for "at <anonymous>:X:Y" in stack trace
      // The line number after the colon is relative to the function body
      match = stack.match(/<anonymous>:\d+:(\d+)/);
      if (match) {
        const lineNum = parseInt(match[1], 10);
        // Account for the wrapper code we add (2 lines: if setup, return loop)
        const adjustedLine = lineNum - 2;
        if (adjustedLine > 0 && adjustedLine <= codeLines.length) {
          return adjustedLine;
        }
        // If adjustment doesn't work, try the raw line number
        if (lineNum > 0 && lineNum <= codeLines.length) {
          return lineNum;
        }
      }
      
      // Pattern 4: Look for ":X:Y" pattern in stack (line:column)
      const stackLines = stack.split('\n');
      for (const stackLine of stackLines) {
        match = stackLine.match(/:(\d+):(\d+)/);
        if (match) {
          const lineNum = parseInt(match[1], 10);
          // Try to map to user code (accounting for wrapper)
          const adjustedLine = lineNum - 2;
          if (adjustedLine > 0 && adjustedLine <= codeLines.length) {
            return adjustedLine;
          }
        }
      }
      
      // Pattern 5: Look for specific error patterns that might indicate line
      // Some errors mention the problematic code, try to find it
      if (errorMessage.includes('is not defined') || errorMessage.includes('Cannot read')) {
        // Try to find the variable/identifier in the code and get its line
        const identifierMatch = errorMessage.match(/'?(\w+)'? (is not defined|Cannot read)/);
        if (identifierMatch) {
          const identifier = identifierMatch[1];
          // Search for the identifier in code (simple heuristic)
          for (let i = 0; i < codeLines.length; i++) {
            if (codeLines[i].includes(identifier) && !codeLines[i].trim().startsWith('//')) {
              return i + 1;
            }
          }
        }
      }
      
      return null;
    };

    // Create interpreter context
    const context = {
      canvas,
      ctx,
      print: (msg: string) => addConsoleMessage(msg, 'info'),
      input: (prompt: string) => {
        const result = window.prompt(prompt);
        if (result !== null) {
          addConsoleMessage(`Input: ${result}`, 'info');
        }
        return result;
      },
      requestStop: () => !isRunning,
      onResize: (width: number, height: number) => {
        setCanvasSize({ width, height });
      },
    };

    try {
      interpreterRef.current = new CodeInterpreter(context);
      interpreterRef.current.execute(code);
      setIsRunning(true);
      addConsoleMessage('Execution started', 'success');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorLineNum = extractLineNumber(error, code);
      
      if (errorLineNum) {
        setErrorLine(errorLineNum);
        addConsoleMessage(`Error on line ${errorLineNum}: ${errorMessage}`, 'error', errorLineNum);
      } else {
        addConsoleMessage(`Error: ${errorMessage}`, 'error');
      }
      
      setIsRunning(false);
    }
  }, [code, addConsoleMessage, isRunning]);

  // Stop execution
  const handleStop = useCallback(() => {
    if (interpreterRef.current) {
      interpreterRef.current.stop();
      interpreterRef.current = null;
    }
    setIsRunning(false);
    setErrorLine(null);
    addConsoleMessage('Execution stopped', 'warning');
  }, [addConsoleMessage]);

  // Clear console
  const handleClearConsole = useCallback(() => {
    setConsoleMessages([]);
  }, []);

  // New project
  const handleNewProject = useCallback(() => {
    if (confirm('Start a new project? Any unsaved changes will be lost.')) {
      setCode(DEFAULT_CODE);
      setCurrentProject(null);
      setErrorLine(null);
      handleStop();
      handleClearConsole();
      storage.clearAutoSave();
    }
  }, [handleStop, handleClearConsole]);

  // Save project
  const handleSaveProject = useCallback(() => {
    const name = prompt(
      'Enter project name:',
      currentProject?.name || 'Untitled Project'
    );
    if (!name) return;

    const project: Project = {
      id: currentProject?.id || Date.now().toString(),
      name,
      code,
      createdAt: currentProject?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    storage.saveProject(project);
    storage.setCurrentProjectId(project.id);
    setCurrentProject(project);
    addConsoleMessage(`Project "${name}" saved successfully`, 'success');
  }, [code, currentProject, addConsoleMessage]);

  // Open project
  const handleOpenProject = useCallback(() => {
    setShowProjects(true);
  }, []);

  // Select project
  const handleSelectProject = useCallback(
    (project: Project) => {
      setCode(project.code);
      setCurrentProject(project);
      storage.setCurrentProjectId(project.id);
      handleStop();
      handleClearConsole();
      addConsoleMessage(`Opened project "${project.name}"`, 'success');
    },
    [handleStop, handleClearConsole, addConsoleMessage]
  );

  // Delete project
  const handleDeleteProject = useCallback(
    (id: string) => {
      storage.deleteProject(id);
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
    },
    [currentProject]
  );

  // Select example
  const handleSelectExample = useCallback(
    (example: Example) => {
      setCode(example.code);
      setCurrentProject(null);
      setErrorLine(null);
      handleStop();
      handleClearConsole();
      addConsoleMessage(`Loaded example: ${example.name}`, 'success');
      setShowExamples(false);
    },
    [handleStop, handleClearConsole, addConsoleMessage]
  );
  
  // Handle dismiss welcome
  const handleDismissWelcome = useCallback(() => {
    storage.autoSave(code);
    setHasSeenWelcome(true);
    localStorage.setItem('hasSeenWelcome', 'true');
  }, [code]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'Ctrl+R': handleRun,
    'Ctrl+S': handleSaveProject,
    'Ctrl+N': handleNewProject,
    'Ctrl+Shift+C': handleClearConsole,
    'Ctrl+O': handleOpenProject,
  });

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F5] text-[#333]">
      {/* Menu Bar */}
      <MenuBar
        onNewProject={handleNewProject}
        onOpenProject={handleOpenProject}
        onSaveProject={handleSaveProject}
        onShowHelp={() => setShowHelp(true)}
        onShowExamples={() => setShowExamples(true)}
      />

      {/* Toolbar */}
      <Toolbar
        isRunning={isRunning}
        onRun={handleRun}
        onStop={handleStop}
        onClear={handleClearConsole}
        onNew={handleNewProject}
        onOpen={handleOpenProject}
        onSave={handleSaveProject}
        projectName={currentProject?.name || 'Untitled Project'}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#F5F5F5]">
        {/* Left: Code Editor */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-[#D3D3D3]">
          <div className="flex-1 overflow-hidden">
            <CodeEditor 
              value={code} 
              onChange={setCode} 
              errorLine={errorLine}
              onCursorChange={setCursorPosition}
            />
          </div>
        </div>

        {/* Right: Canvas + Console */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Canvas */}
          <div className="flex-1 overflow-hidden bg-[#E8E8E8]">
            <Canvas canvasRef={canvasRef} width={canvasSize.width} height={canvasSize.height} />
          </div>

          {/* Console */}
          <div className="h-48 overflow-hidden">
            <Console
              messages={consoleMessages}
              onClear={handleClearConsole}
            />
          </div>
        </div>
      </div>

      {/* Status Bar - Processing style */}
      <div className="bg-[#F5F5F5] border-t border-[#D3D3D3] px-3 py-1 flex items-center gap-2 text-xs text-[#666] h-6">
        <span className={isRunning ? 'text-[#0066CC] font-medium' : ''}>
          {isRunning ? 'Running' : 'Ready'}
        </span>
        <span className="text-[#D3D3D3]">|</span>
        <span>
          Line {cursorPosition.line}, Col {cursorPosition.col}
        </span>
      </div>

      {/* Modals */}
      {showExamples && (
        <ExamplesPanel
          onClose={() => setShowExamples(false)}
          onSelectExample={handleSelectExample}
        />
      )}

      {showProjects && (
        <ProjectsPanel
          projects={storage.getProjects()}
          onClose={() => setShowProjects(false)}
          onSelectProject={handleSelectProject}
          onDeleteProject={handleDeleteProject}
        />
      )}

      {showHelp && <HelpPanel onClose={() => setShowHelp(false)} />}

      {/* Initial Examples Prompt */}
      {!hasSeenWelcome && (
        <div className="fixed bottom-16 right-4 bg-white border border-[#D3D3D3] rounded-lg p-4 shadow-xl max-w-sm z-50">
          <div className="text-sm text-[#333] mb-3">
            <strong className="text-[#0066CC]">New to coding?</strong>
            <br />
            Start with our built-in examples to learn the basics!
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowExamples(true);
                handleDismissWelcome();
              }}
              className="px-4 py-2 bg-[#0066CC] text-white rounded hover:bg-[#0052A3] transition-colors text-sm font-medium"
            >
              View Examples
            </button>
            <button
              onClick={handleDismissWelcome}
              className="px-4 py-2 bg-[#F5F5F5] text-[#333] rounded hover:bg-[#E0E0E0] transition-colors text-sm border border-[#D3D3D3]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
