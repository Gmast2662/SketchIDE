// Update notification component
import { useState, useEffect } from 'react';
import { X, Download, RefreshCw } from 'lucide-react';

interface UpdateNotificationProps {
  version: string;
  latestVersion: string;
  onUpdate: () => void;
  onDismiss: () => void;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  version,
  latestVersion,
  onUpdate,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if there's a newer version
    if (latestVersion && latestVersion !== version) {
      setIsVisible(true);
    }
  }, [version, latestVersion]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-ide-panel border border-ide-border rounded-lg shadow-lg z-50 max-w-md">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-ide-success" />
            <h3 className="font-semibold text-ide-text">Update Available</h3>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className="text-ide-textDim hover:text-ide-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-ide-textDim mb-4">
          A new version of SketchIDE is available (v{latestVersion}). 
          You're currently running v{version}.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onUpdate();
              setIsVisible(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-ide-success text-white rounded hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            <span>Download Update</span>
          </button>
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className="px-4 py-2 bg-ide-panel border border-ide-border text-ide-text rounded hover:bg-ide-toolbar transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};
