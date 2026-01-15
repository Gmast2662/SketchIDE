// Storage utilities for project persistence
// Uses file system in Electron, localStorage in web

import type { Project } from '../types';

const STORAGE_KEY = 'processing-ide-projects';
const CURRENT_PROJECT_KEY = 'processing-ide-current';
const AUTO_SAVE_KEY = 'processing-ide-autosave';

// Check if we're in Electron
const isElectron = typeof window !== 'undefined' && (window as any).electronAPI;

// Helper to get sketchbook path
async function getSketchbookPath(): Promise<string | null> {
  if (!isElectron) return null;
  try {
    return await (window as any).electronAPI.getSketchbookPath();
  } catch {
    return null;
  }
}

// Helper to save file to sketchbook
async function saveToSketchbook(filename: string, content: string): Promise<boolean> {
  if (!isElectron) return false;
  try {
    const sketchbookPath = await getSketchbookPath();
    if (!sketchbookPath) return false;
    
    const filePath = `${sketchbookPath}/${filename}.art`;
    const result = await (window as any).electronAPI.writeFile(filePath, content);
    return result.success;
  } catch {
    return false;
  }
}

// Helper to load file from sketchbook
async function loadFromSketchbook(filename: string): Promise<string | null> {
  if (!isElectron) return null;
  try {
    const sketchbookPath = await getSketchbookPath();
    if (!sketchbookPath) return null;
    
    const filePath = `${sketchbookPath}/${filename}.art`;
    const result = await (window as any).electronAPI.readFile(filePath);
    return result.success ? result.content : null;
  } catch {
    return null;
  }
}

// Helper to list sketchbook files
async function listSketchbookFiles(): Promise<string[]> {
  if (!isElectron) return [];
  try {
    const sketchbookPath = await getSketchbookPath();
    if (!sketchbookPath) return [];
    
    const result = await (window as any).electronAPI.readDir(sketchbookPath);
    if (result.success) {
      return result.files.filter((f: string) => f.endsWith('.art')).map((f: string) => f.replace('.art', ''));
    }
    return [];
  } catch {
    return [];
  }
}

export const storage = {
  // Get all saved projects
  getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Save a project
  saveProject(project: Project): void {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);

    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  },

  // Delete a project
  deleteProject(id: string): void {
    const projects = this.getProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  },

  // Get current project ID
  getCurrentProjectId(): string | null {
    return localStorage.getItem(CURRENT_PROJECT_KEY);
  },

  // Set current project ID
  setCurrentProjectId(id: string): void {
    localStorage.setItem(CURRENT_PROJECT_KEY, id);
  },

  // Auto-save current code
  autoSave(code: string): void {
    localStorage.setItem(AUTO_SAVE_KEY, code);
  },

  // Get auto-saved code
  getAutoSaved(): string | null {
    return localStorage.getItem(AUTO_SAVE_KEY);
  },

  // Clear auto-save
  clearAutoSave(): void {
    localStorage.removeItem(AUTO_SAVE_KEY);
  },

  // Save sketch to sketchbook folder (Electron only)
  async saveSketch(name: string, code: string): Promise<boolean> {
    return await saveToSketchbook(name, code);
  },

  // Load sketch from sketchbook folder (Electron only)
  async loadSketch(name: string): Promise<string | null> {
    return await loadFromSketchbook(name);
  },

  // List all sketches in sketchbook folder (Electron only)
  async listSketches(): Promise<string[]> {
    return await listSketchbookFiles();
  },

  // Get sketchbook path (Electron only)
  async getSketchbookPath(): Promise<string | null> {
    if (!isElectron) return null;
    try {
      return await (window as any).electronAPI.getSketchbookPath();
    } catch {
      return null;
    }
  },
};
