// LocalStorage utilities for project persistence

import type { Project } from '../types';

const STORAGE_KEY = 'processing-ide-projects';
const CURRENT_PROJECT_KEY = 'processing-ide-current';
const AUTO_SAVE_KEY = 'processing-ide-autosave';

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
};
