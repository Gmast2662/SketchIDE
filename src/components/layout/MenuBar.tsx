// Top menu bar component

import { FileText, Edit, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface MenuBarProps {
  onNewProject: () => void;
  onOpenProject: () => void;
  onSaveProject: () => void;
  onShowHelp: () => void;
  onShowExamples: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNewProject,
  onOpenProject,
  onSaveProject,
  onShowHelp,
  onShowExamples,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menus = [
    {
      id: 'file',
      label: 'File',
      icon: FileText,
      items: [
        { label: 'New', shortcut: 'Ctrl+N', action: onNewProject },
        { label: 'Open', shortcut: 'Ctrl+O', action: onOpenProject },
        { label: 'Save', shortcut: 'Ctrl+S', action: onSaveProject },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      items: [
        { label: 'Cut', shortcut: 'Ctrl+X', action: () => {} },
        { label: 'Copy', shortcut: 'Ctrl+C', action: () => {} },
        { label: 'Paste', shortcut: 'Ctrl+V', action: () => {} },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      icon: HelpCircle,
      items: [
        { label: 'Documentation', shortcut: '', action: onShowHelp },
        { label: 'Examples', shortcut: '', action: onShowExamples },
      ],
    },
  ];

  return (
    <div className="bg-[#323233] border-b border-ide-border px-2 py-1 flex items-center gap-1">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mr-1">
        <img 
          src="./logo.png" 
          alt="SketchIDE" 
          className="h-6 w-6 object-contain"
          onError={(e) => {
            // Fallback if logo doesn't load
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <span className="text-sm font-semibold text-ide-text">SketchIDE</span>
      </div>
      
      {menus.map((menu) => (
        <div key={menu.id} className="relative">
          <button
            className="px-3 py-1 text-sm text-ide-text hover:bg-ide-panel rounded transition-colors"
            onClick={() => setOpenMenu(openMenu === menu.id ? null : menu.id)}
          >
            {menu.label}
          </button>

          {openMenu === menu.id && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpenMenu(null)}
              />
              <div className="absolute top-full left-0 mt-1 bg-ide-panel border border-ide-border rounded shadow-lg z-20 min-w-[180px]">
                {menu.items.map((item, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 text-sm text-ide-text hover:bg-ide-toolbar text-left flex items-center justify-between group"
                    onClick={() => {
                      item.action();
                      setOpenMenu(null);
                    }}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className="text-xs text-ide-textDim ml-4">
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ))}

      <div className="flex-1" />

      <div className="text-xs text-ide-textDim px-3">
        v1.0.0
      </div>
    </div>
  );
};
