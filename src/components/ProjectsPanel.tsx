// Projects panel for opening saved projects

import { X, FileText, Trash2, Clock } from 'lucide-react';
import type { Project } from '../types';

interface ProjectsPanelProps {
  projects: Project[];
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectsPanel: React.FC<ProjectsPanelProps> = ({
  projects,
  onClose,
  onSelectProject,
  onDeleteProject,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-ide-panel border border-ide-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-ide-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-ide-accent" />
            <h2 className="text-lg font-semibold text-ide-text">
              Your Projects
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ide-toolbar rounded transition-colors"
          >
            <X className="w-5 h-5 text-ide-text" />
          </button>
        </div>

        {/* Projects list */}
        <div className="flex-1 overflow-auto p-6">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-ide-textDim mx-auto mb-4" />
              <p className="text-ide-textDim">No saved projects yet</p>
              <p className="text-sm text-ide-textDim mt-2">
                Create and save your first project to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 bg-ide-toolbar border border-ide-border rounded-lg flex items-center gap-4 group hover:border-ide-accent transition-colors"
                >
                  <button
                    onClick={() => {
                      onSelectProject(project);
                      onClose();
                    }}
                    className="flex-1 text-left"
                  >
                    <div className="text-ide-text font-medium mb-1 group-hover:text-ide-accent transition-colors">
                      {project.name}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-ide-textDim">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>{project.code.split('\n').length} lines</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete "${project.name}"?`)) {
                        onDeleteProject(project.id);
                      }
                    }}
                    className="p-2 text-ide-textDim hover:text-ide-error hover:bg-ide-panel rounded transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
