// Type definitions for the IDE

export interface Project {
  id: string;
  name: string;
  code: string;
  createdAt: number;
  updatedAt: number;
}

export interface ConsoleMessage {
  id: string;
  type: 'info' | 'error' | 'warning' | 'success';
  message: string;
  timestamp: number;
  line?: number;
}

export interface Example {
  id: string;
  name: string;
  category: string;
  code: string;
}

export interface CanvasState {
  width: number;
  height: number;
  context: CanvasRenderingContext2D | null;
  isRunning: boolean;
}
