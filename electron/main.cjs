// Electron main process
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const isDev = process.env.NODE_ENV === 'development';

// Read version from package.json (auto-synced)
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(require('fs').readFileSync(packageJsonPath, 'utf-8'));
const appVersion = packageJson.version;

let mainWindow = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/logo.png'), // App icon
    title: 'SketchIDE',
    titleBarStyle: 'default',
    show: false, // Don't show until ready
  });

  // Load the app
  if (isDev) {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:8080');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Focus on window
    if (isDev) {
      mainWindow.focus();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  // Ensure sketchbook folder exists on startup (in app installation directory)
  try {
    let appPath;
    if (app.isPackaged) {
      // In production, use the directory where the executable is
      appPath = path.dirname(process.execPath);
    } else {
      // In development, use the project root
      appPath = path.join(__dirname, '..');
    }
    const sketchbookPath = path.join(appPath, 'sketchbook');
    await fs.mkdir(sketchbookPath, { recursive: true });
    console.log('Sketchbook folder ready:', sketchbookPath);
  } catch (error) {
    console.error('Error creating sketchbook folder:', error);
  }

  createWindow();

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});

// File system IPC handlers
ipcMain.handle('get-app-path', () => {
  return app.getPath('userData');
});

ipcMain.handle('get-sketchbook-path', async () => {
  // Use app installation directory (where the .exe is) instead of AppData
  let appPath;
  if (app.isPackaged) {
    // In production, use the directory where the executable is
    appPath = path.dirname(process.execPath);
  } else {
    // In development, use the project root
    appPath = path.join(__dirname, '..');
  }
  
  const sketchbookPath = path.join(appPath, 'sketchbook');
  
  // Ensure sketchbook directory exists
  try {
    await fs.mkdir(sketchbookPath, { recursive: true });
  } catch (error) {
    console.error('Error creating sketchbook directory:', error);
  }
  
  return sketchbookPath;
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-file', async (event, filePath, content) => {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('read-dir', async (event, dirPath) => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return {
      success: true,
      files: entries
        .filter(entry => entry.isFile())
        .map(entry => entry.name),
      directories: entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('ensure-dir', async (event, dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('file-exists', async (event, filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
});

// Show save dialog (for Processing-like folder structure)
ipcMain.handle('show-save-dialog', async (event, options) => {
  const { BrowserWindow } = require('electron');
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return { canceled: true };
  
  try {
    // Get sketchbook path
    const sketchbookPath = await new Promise((resolve) => {
      const appPath = app.isPackaged ? path.dirname(process.execPath) : path.join(__dirname, '..');
      resolve(path.join(appPath, 'sketchbook'));
    });
    
    // Extract default name from defaultPath if provided
    let defaultName = 'sketch_' + new Date().toISOString().slice(0, 10).replace(/-/g, '');
    if (options.defaultPath) {
      const pathParts = options.defaultPath.split(/[/\\]/);
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart && !lastPart.includes('.')) {
        defaultName = lastPart;
      } else if (lastPart) {
        defaultName = path.basename(lastPart, '.art');
      }
    }
    
    // Use showSaveDialog to let user enter sketch name
    const result = await dialog.showSaveDialog(win, {
      title: options.title || 'Save Sketch',
      defaultPath: path.join(sketchbookPath, defaultName + '.art'),
      filters: [
        { name: 'Sketch Files', extensions: ['art'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      buttonLabel: 'Save',
    });
    
    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }
    
    // Extract folder path and name from file path
    let filePath = result.filePath;
    // If user didn't add .art extension, add it
    if (!filePath.endsWith('.art')) {
      filePath = filePath + '.art';
    }
    
    const folderPath = path.dirname(filePath);
    const fileName = path.basename(filePath, '.art');
    
    // Create Processing-like structure: folderName/folderName.art and folderName/data/
    // Create a folder with the sketch name
    const sketchFolderPath = path.join(folderPath, fileName);
    const sketchFilePath = path.join(sketchFolderPath, `${fileName}.art`);
    const dataFolderPath = path.join(sketchFolderPath, 'data');
    
    // Ensure folders exist
    try {
      await fs.mkdir(sketchFolderPath, { recursive: true });
      await fs.mkdir(dataFolderPath, { recursive: true });
    } catch (error) {
      console.error('Error creating sketch folder structure:', error);
      return { canceled: true, error: error.message };
    }
    
    return {
      canceled: false,
      filePath: sketchFilePath, // Return path to .art file
      folderPath: sketchFolderPath, // Also return folder path
      fileName: fileName, // Return the file name without extension
      success: true,
    };
  } catch (error) {
    console.error('Error in show-save-dialog:', error);
    return { canceled: true, error: error.message };
  }
});

// Show open dialog (for Processing-like folder structure)
ipcMain.handle('show-open-dialog', async (event, options) => {
  const { BrowserWindow } = require('electron');
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return { canceled: true };
  
  // For Processing-like structure, open the .art file inside the folder
  const result = await dialog.showOpenDialog(win, {
    title: options.title || 'Open Sketch',
    defaultPath: options.defaultPath,
    filters: [
      { name: 'Sketch Files', extensions: ['art'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  });
  
  if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
    return { canceled: true };
  }
  
  // Return the file path (should be folderName/folderName.art)
  return {
    canceled: false,
    filePath: result.filePaths[0],
    folderPath: path.dirname(result.filePaths[0]), // Also return folder path
  };
});
