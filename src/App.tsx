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
      let match = errorMessage.match(/[Ll]ine[:\s]+(\d+)/);
      if (match) {
        const lineNum = parseInt(match[1], 10);
        if (lineNum > 0 && lineNum <= codeLines.length) {
          return lineNum;
        }
      }
      
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
      
      // Pattern 3: Look for "Unexpected token" errors - try to find the problematic line
      if (errorMessage.includes('Unexpected token')) {
        // Look for common syntax errors and try to find the line
        if (errorMessage.includes("'='") || errorMessage.includes("'=>'")) {
          // This is likely a function transformation issue
          // Search for function definitions that might have issues
          for (let i = 0; i < codeLines.length; i++) {
            const line = codeLines[i];
            if (line.includes('function') && (line.includes('=>') || line.match(/\)\s*\{/))) {
              return i + 1;
            }
          }
        }
      }
      
      match = stack.match(/<anonymous>:\d+:(\d+)/);
      if (match) {
        const lineNum = parseInt(match[1], 10);
        // Account for wrapper code (2 lines: if setup, return loop)
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
      
      // Pattern 5: Look for specific error patterns
      if (errorMessage.includes('is not defined') || errorMessage.includes('Cannot read')) {
        const identifierMatch = errorMessage.match(/'?(\w+)'? (is not defined|Cannot read)/);
        if (identifierMatch) {
          const identifier = identifierMatch[1];
          for (let i = 0; i < codeLines.length; i++) {
            if (codeLines[i].includes(identifier) && !codeLines[i].trim().startsWith('//')) {
              return i + 1;
            }
          }
        }
      }
      
      // Pattern 6: For syntax errors, try to find lines with common issues
      if (errorMessage.includes('SyntaxError') || errorMessage.includes('Unexpected')) {
        // Look for "Unexpected identifier" or "Unexpected token" - try to find the problematic character
        const unexpectedMatch = errorMessage.match(/Unexpected (?:token|identifier) ['"]([^'"]+)['"]/);
        if (unexpectedMatch) {
          const unexpectedChar = unexpectedMatch[1];
          // Search for this character in the code, starting from the end (most recent errors)
          for (let i = codeLines.length - 1; i >= 0; i--) {
            const line = codeLines[i];
            // Check if the character appears in this line (not in comments)
            const commentIndex = line.indexOf('//');
            const lineToCheck = commentIndex >= 0 ? line.substring(0, commentIndex) : line;
            if (lineToCheck.includes(unexpectedChar)) {
              return i + 1;
            }
          }
        }
        
        // Look for specific patterns like }g, {x, etc.
        for (let i = codeLines.length - 1; i >= 0; i--) {
          const line = codeLines[i];
          const commentIndex = line.indexOf('//');
          const lineToCheck = commentIndex >= 0 ? line.substring(0, commentIndex) : line;
          
          // Check for } followed by a letter (like }g)
          if (lineToCheck.match(/\}[a-zA-Z]/)) {
            return i + 1;
          }
          // Check for { followed by unexpected characters
          if (lineToCheck.match(/\{[^}\s]/) && !lineToCheck.match(/\{[a-zA-Z_]/)) {
            return i + 1;
          }
        }
        
        // Look for lines with unmatched brackets or common syntax issues
        for (let i = codeLines.length - 1; i >= 0; i--) {
          const line = codeLines[i].trim();
          const commentIndex = line.indexOf('//');
          const lineToCheck = commentIndex >= 0 ? line.substring(0, commentIndex) : line;
          
          // Check for common syntax errors
          if (lineToCheck.includes('function') && !lineToCheck.includes('{') && !lineToCheck.endsWith(')')) {
            return i + 1;
          }
          // Check for unmatched parentheses on this line
          const openParens = (lineToCheck.match(/\(/g) || []).length;
          const closeParens = (lineToCheck.match(/\)/g) || []).length;
          if (openParens !== closeParens) {
            return i + 1;
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
        addConsoleMessage(errorMessage, 'error', errorLineNum);
      } else {
        setErrorLine(null);
        addConsoleMessage(errorMessage, 'error');
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
    <div className="h-screen flex flex-col bg-ide-bg text-ide-text">
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
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Code Editor */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-ide-border">
          <div className="flex-1 overflow-hidden">
            <CodeEditor value={code} onChange={setCode} errorLine={errorLine} />
          </div>
        </div>

        {/* Right: Canvas + Console */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Canvas */}
          <div className="flex-1 overflow-hidden">
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
        <div className="fixed bottom-4 right-4 bg-ide-toolbar border border-ide-accent rounded-lg p-4 shadow-2xl max-w-sm z-50">
          <div className="text-sm text-ide-text mb-3">
            <strong className="text-ide-accent">New to coding?</strong>
            <br />
            Start with our built-in examples to learn the basics!
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowExamples(true);
                handleDismissWelcome();
              }}
              className="px-4 py-2 bg-ide-accent text-white rounded hover:opacity-90 transition-opacity text-sm font-medium"
            >
              View Examples
            </button>
            <button
              onClick={handleDismissWelcome}
              className="px-4 py-2 bg-ide-panel text-ide-text rounded hover:bg-ide-border transition-colors text-sm"
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
