/// <reference types="vite/client" />

// Electron API types
interface ElectronAPI {
  platform: string;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
  getAppPath: () => Promise<string>;
  getSketchbookPath: () => Promise<string>;
  readFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
  writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
  readDir: (dirPath: string) => Promise<{ success: boolean; files?: string[]; directories?: string[]; error?: string }>;
  ensureDir: (dirPath: string) => Promise<{ success: boolean; error?: string }>;
  exists: (filePath: string) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
