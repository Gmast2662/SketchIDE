// Main application component

import { useState, useRef, useCallback, useEffect } from 'react';
import { MenuBar } from './components/layout/MenuBar';
import { Toolbar } from './components/layout/Toolbar';
import { CodeEditor } from './components/CodeEditor';
import { Canvas } from './components/Canvas';
import { Console } from './components/Console';
import { ExamplesPanel } from './components/ExamplesPanel';
import { ProjectsPanel } from './components/ProjectsPanel';
import { HelpPanel } from './components/HelpPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { UpdateNotification } from './components/UpdateNotification';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { CodeInterpreter } from './lib/interpreter';
import { storage } from './lib/storage';
import { DEFAULT_CODE } from './constants/examples';
import type { ConsoleMessage, Project, Example } from './types';
import { formatCode } from './lib/formatter';

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
  const [showSettings, setShowSettings] = useState(false);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 300 });
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
    return localStorage.getItem('hasSeenWelcome') === 'true';
  });
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  // Version is injected at build time from package.json via Vite define
  // Fallback to import.meta.env.VITE_APP_VERSION if __APP_VERSION__ is not available
  const getCurrentVersion = () => {
    if (typeof __APP_VERSION__ !== 'undefined') return __APP_VERSION__;
    if (import.meta.env.VITE_APP_VERSION) return import.meta.env.VITE_APP_VERSION;
    // Fallback - should not be needed in production as Vite injects version
    // In dev mode, this ensures we have a version
    return '1.0.3'; // Fallback - update this if package.json version changes significantly
  };
  const currentVersion = getCurrentVersion() as string;
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null); // Track saved file path
  const [inputDialog, setInputDialog] = useState<{prompt: string; resolve: (value: string | null) => void} | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Auto-save - saves to localStorage and file (if path exists)
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (!code.trim()) return;
      
      // Save to localStorage
      storage.autoSave(code);
      
      // Also save to file if we have a saved path (Electron only)
      const isElectron = typeof window !== 'undefined' && (window as any).electronAPI;
      if (isElectron && currentFilePath) {
        (window as any).electronAPI.writeFile(currentFilePath, code).catch(() => {
          // Silent fail for auto-save
        });
      }
    }, 2000); // Auto-save every 2 seconds
    
    return () => clearTimeout(autoSaveTimer);
  }, [code, currentFilePath]);

  // Check for updates from GitHub Releases
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const GITHUB_REPO = 'Gmast2662/SketchIDE';
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        });
        
        if (!response.ok) {
          // If API fails, fall back to localStorage for testing
          const storedLatestVersion = localStorage.getItem('latestVersion');
          if (storedLatestVersion && storedLatestVersion !== currentVersion) {
            setLatestVersion(storedLatestVersion);
          }
          return;
        }
        
        const data = await response.json();
        // Remove 'v' prefix if present (e.g., 'v1.0.1' -> '1.0.1')
        const latestVersionFromGitHub = data.tag_name.replace(/^v/, '');
        
        // Compare versions (simple string comparison works for semantic versioning)
        if (latestVersionFromGitHub && latestVersionFromGitHub !== currentVersion) {
          setLatestVersion(latestVersionFromGitHub);
          setShowUpdateNotification(true);
        }
      } catch (error) {
        // Silent fail - don't show errors for update checks
        console.log('Update check failed (this is normal if not configured):', error);
        
        // Fall back to localStorage for testing
        const storedLatestVersion = localStorage.getItem('latestVersion');
        if (storedLatestVersion && storedLatestVersion !== currentVersion) {
          setLatestVersion(storedLatestVersion);
        }
      }
    };

    // Check on mount, then every 1 hour
    checkForUpdates();
    const interval = setInterval(checkForUpdates, 60 * 60 * 1000); // Check every hour instead of 24 hours
    return () => clearInterval(interval);
  }, [currentVersion]);

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
  const handleRun = useCallback(async () => {
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
      input: (promptText: string) => {
        // Use a custom input dialog instead of window.prompt (which is blocked)
        return new Promise<string | null>((resolve) => {
          setInputDialog({ prompt: promptText, resolve });
          setInputValue('');
        }).then((result) => {
          if (result !== null) {
            addConsoleMessage(`Input: ${result}`, 'info');
          }
          return result;
        });
      },
      requestStop: () => !isRunning,
      onResize: (width: number, height: number) => {
        setCanvasSize({ width, height });
      },
    };

    try {
      interpreterRef.current = new CodeInterpreter(context);
      await interpreterRef.current.execute(code);
      setIsRunning(true);
      addConsoleMessage('Execution started', 'success');
      // Clear error line when code runs successfully
      setErrorLine(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorLineNum = extractLineNumber(error, code);
      
      if (errorLineNum) {
        setErrorLine(errorLineNum);
        addConsoleMessage(`${errorMessage} (Line ${errorLineNum})`, 'error', errorLineNum);
      } else {
        // Clear error line if no line number found
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
      setCurrentFilePath(null);
      setErrorLine(null);
      handleStop();
      handleClearConsole();
      storage.clearAutoSave();
      // Reset canvas
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 400;
          canvas.height = 300;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, 400, 300);
          setCanvasSize({ width: 400, height: 300 });
        }
      }
    }
  }, [handleStop, handleClearConsole]);

  // Save project (Ctrl+S - saves existing or shows dialog if new)
  const handleSaveProject = useCallback(async () => {
    console.log('Save project called');
    const isElectron = typeof window !== 'undefined' && (window as any).electronAPI;
    console.log('Is Electron:', isElectron, 'electronAPI:', (window as any).electronAPI);
    
    // If we have a saved file path, save to that file
    if (currentFilePath) {
      console.log('Saving to existing file:', currentFilePath);
      if (isElectron) {
        try {
          await (window as any).electronAPI.writeFile(currentFilePath, code);
          const fileName = currentFilePath.split(/[/\\]/).pop() || 'file';
          addConsoleMessage(`Saved to ${fileName}`, 'success');
          return;
        } catch (error) {
          addConsoleMessage('Error saving file', 'error');
          return;
        }
      }
    }
    
    // Otherwise, show save dialog (or prompt in web)
    if (isElectron) {
      try {
        console.log('Getting sketchbook path...');
        const sketchbookPath = await (window as any).electronAPI.getSketchbookPath();
        console.log('Sketchbook path:', sketchbookPath);
        const defaultName = currentProject?.name || 'Untitled Project';
        // Use forward slashes for Electron paths (works on Windows too)
        const defaultPath = `${sketchbookPath}/${defaultName}.art`;
        
        console.log('Showing save dialog...');
        const result = await (window as any).electronAPI.showSaveDialog({
          title: 'Save Sketch',
          defaultPath: defaultPath,
        });
        
        console.log('Save dialog result:', result);
        if (result.canceled || !result.filePath) {
          console.log('Save dialog canceled');
          return;
        }
        
        // Processing-like structure: folderName/folderName.art
        const filePath = result.filePath;
        const folderPath = result.folderPath || filePath.substring(0, filePath.lastIndexOf('/') || filePath.lastIndexOf('\\'));
        
        await (window as any).electronAPI.writeFile(filePath, code);
        setCurrentFilePath(filePath);
        
        // Update project info - extract folder name from path
        const pathParts = folderPath ? folderPath.split(/[/\\]/) : filePath.split(/[/\\]/);
        const folderName = pathParts[pathParts.length - 1];
        const project: Project = {
          id: currentProject?.id || Date.now().toString(),
          name: folderName,
          code,
          createdAt: currentProject?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };
        
        storage.saveProject(project);
        storage.setCurrentProjectId(project.id);
        setCurrentProject(project);
        
        addConsoleMessage(`Saved to ${folderName}/`, 'success');
      } catch (error) {
        addConsoleMessage('Error saving file', 'error');
      }
    } else {
      // Web version - use prompt
      let projectName = currentProject?.name;
      if (!projectName) {
        projectName = prompt('Enter project name:', 'Untitled Project');
        if (!projectName) return;
      }
      
      const project: Project = {
        id: currentProject?.id || Date.now().toString(),
        name: projectName,
        code,
        createdAt: currentProject?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };
      
      storage.saveProject(project);
      storage.setCurrentProjectId(project.id);
      setCurrentProject(project);
      addConsoleMessage(`Project "${projectName}" saved`, 'success');
    }
  }, [code, currentProject, currentFilePath, addConsoleMessage]);

  // Save As project (Shift+Ctrl+S - always shows dialog)
  const handleSaveAsProject = useCallback(async () => {
    const isElectron = typeof window !== 'undefined' && (window as any).electronAPI;
    
    if (isElectron) {
      try {
        const sketchbookPath = await (window as any).electronAPI.getSketchbookPath();
        const defaultName = currentProject?.name || 'Untitled Project';
        const defaultPath = `${sketchbookPath}/${defaultName}.art`;
        
        const result = await (window as any).electronAPI.showSaveDialog({
          title: 'Save Sketch As',
          defaultPath: defaultPath,
        });
        
        if (result.canceled || !result.filePath) return;
        
        // Processing-like structure: folderName/folderName.art
        const filePath = result.filePath;
        const folderPath = result.folderPath || filePath.substring(0, filePath.lastIndexOf('/') || filePath.lastIndexOf('\\'));
        
        await (window as any).electronAPI.writeFile(filePath, code);
        setCurrentFilePath(filePath);
        
        // Update project info - extract folder name from path
        const pathParts = folderPath ? folderPath.split(/[/\\]/) : filePath.split(/[/\\]/);
        const folderName = pathParts[pathParts.length - 1];
        const project: Project = {
          id: Date.now().toString(), // New ID for save as
          name: folderName,
          code,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        storage.saveProject(project);
        storage.setCurrentProjectId(project.id);
        setCurrentProject(project);
        
        addConsoleMessage(`Saved as ${folderName}/`, 'success');
      } catch (error) {
        addConsoleMessage('Error saving file', 'error');
      }
    } else {
      // Web version - use prompt
      const projectName = prompt(
        'Enter project name:',
        currentProject?.name || 'Untitled Project'
      );
      if (!projectName) return;

      const project: Project = {
        id: Date.now().toString(),
        name: projectName,
        code,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      storage.saveProject(project);
      storage.setCurrentProjectId(project.id);
      setCurrentProject(project);
      addConsoleMessage(`Project "${projectName}" saved`, 'success');
    }
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
      setCurrentFilePath(null);
      storage.setCurrentProjectId(project.id);
      handleStop();
      handleClearConsole();
      // Reset canvas
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 400;
          canvas.height = 300;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, 400, 300);
          setCanvasSize({ width: 400, height: 300 });
        }
      }
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
      setCurrentFilePath(null); // Clear saved file path for examples
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

  // Format code
  const handleFormatCode = useCallback(() => {
    const formatted = formatCode(code);
    setCode(formatted);
    addConsoleMessage('Code formatted', 'success');
  }, [code, addConsoleMessage]);

  // Real-time error detection - only check on actual runtime errors
  // Don't do aggressive pre-checking as it causes false positives
  // Error highlighting is set from console messages with line numbers

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'Ctrl+R': handleRun,
    'Ctrl+S': handleSaveProject,
    'Ctrl+Shift+S': handleSaveAsProject,
    'Ctrl+N': handleNewProject,
    'Ctrl+Shift+C': handleClearConsole,
    'Ctrl+O': handleOpenProject,
    'Ctrl+Shift+F': handleFormatCode,
  });

  return (
    <div className="h-screen flex flex-col bg-ide-bg text-ide-text">
      {/* Menu Bar */}
      <MenuBar
        onNewProject={handleNewProject}
        onOpenProject={handleOpenProject}
        onSaveProject={handleSaveProject}
        onSaveAsProject={handleSaveAsProject}
        onShowHelp={() => setShowHelp(true)}
        onShowExamples={() => setShowExamples(true)}
        onShowSettings={() => setShowSettings(true)}
        onShowTerms={() => window.open('https://github.com/Gmast2662/SketchIDE', '_blank')}
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

      {/* Input Dialog */}
      {inputDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-ide-panel border border-ide-border rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-ide-text mb-4">
              {inputDialog.prompt}
            </h3>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  inputDialog.resolve(inputValue || null);
                  setInputDialog(null);
                  setInputValue('');
                } else if (e.key === 'Escape') {
                  inputDialog.resolve(null);
                  setInputDialog(null);
                  setInputValue('');
                }
              }}
              autoFocus
              className="w-full px-4 py-2 bg-ide-toolbar border border-ide-border rounded text-ide-text focus:outline-none focus:ring-2 focus:ring-ide-accent mb-4"
              placeholder="Enter value..."
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  inputDialog.resolve(null);
                  setInputDialog(null);
                  setInputValue('');
                }}
                className="px-4 py-2 bg-ide-toolbar border border-ide-border rounded text-ide-text hover:bg-ide-panel transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  inputDialog.resolve(inputValue || null);
                  setInputDialog(null);
                  setInputValue('');
                }}
                className="px-4 py-2 bg-ide-success text-white rounded hover:opacity-90 transition-opacity"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

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
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {/* Update Notification */}
      {showUpdateNotification && latestVersion && (
        <UpdateNotification
          version={currentVersion}
          latestVersion={latestVersion}
          onUpdate={() => {
            const GITHUB_REPO = 'Gmast2662/SketchIDE';
            window.open(`https://github.com/${GITHUB_REPO}/releases/latest`, '_blank');
          }}
          onDismiss={() => {
            // Store dismissed version to not show again
            localStorage.setItem('updateDismissed', latestVersion);
            setShowUpdateNotification(false);
          }}
        />
      )}

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
