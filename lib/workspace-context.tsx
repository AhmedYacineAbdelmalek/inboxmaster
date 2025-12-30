'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockWorkspaces, mockUsers, type Workspace } from '@/lib/mock-data';

interface WorkspaceContextType {
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  switchWorkspace: (workspaceId: string) => void;
  currentUser: typeof mockUsers[0];
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>(mockWorkspaces[0].id);
  const currentWorkspace = mockWorkspaces.find(w => w.id === currentWorkspaceId) || mockWorkspaces[0];
  const currentUser = mockUsers[0]; // Mock current user as Alice

  const switchWorkspace = (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentWorkspaceId', workspaceId);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currentWorkspaceId');
      if (saved && mockWorkspaces.find(w => w.id === saved)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentWorkspaceId(saved);
      }
    }
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces: mockWorkspaces,
        switchWorkspace,
        currentUser,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
}
