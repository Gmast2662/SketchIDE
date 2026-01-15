// Preload script - runs in a context that has access to both DOM and Node.js APIs
// This is a bridge between the renderer process and the main process

// Preload script must use CommonJS
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the APIs without exposing the entire Node.js API
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    app: require('electron').app.getVersion(),
  },
  // File system operations
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  getSketchbookPath: () => ipcRenderer.invoke('get-sketchbook-path'),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
  readDir: (dirPath) => ipcRenderer.invoke('read-dir', dirPath),
  ensureDir: (dirPath) => ipcRenderer.invoke('ensure-dir', dirPath),
  exists: (filePath) => ipcRenderer.invoke('file-exists', filePath),
  // File dialogs
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
});
