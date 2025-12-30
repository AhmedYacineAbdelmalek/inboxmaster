'use client';

import { useWorkspace } from '@/lib/workspace-context';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function WorkspaceSwitcher() {
  const { currentWorkspace, workspaces, switchWorkspace } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 w-full text-left"
      >
        <span className="text-2xl">{currentWorkspace.avatar}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{currentWorkspace.name}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => {
                  switchWorkspace(workspace.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left ${
                  workspace.id === currentWorkspace.id ? 'bg-gray-50' : ''
                }`}
              >
                <span className="text-2xl">{workspace.avatar}</span>
                <div className="text-sm font-medium">{workspace.name}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
