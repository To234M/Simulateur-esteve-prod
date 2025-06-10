import React, { createContext, useState, useContext } from 'react';

interface ProjectImage {
  id: string;
  dataUrl: string;
  name: string;
  timestamp: number;
}

interface ProjectState {
  currentImage: ProjectImage | null;
  savedProjects: ProjectImage[];
  setCurrentImage: (image: ProjectImage | null) => void;
  addProject: (project: ProjectImage) => void;
  removeProject: (id: string) => void;
}

const ProjectContext = createContext<ProjectState | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentImage, setCurrentImage] = useState<ProjectImage | null>(null);
  const [savedProjects, setSavedProjects] = useState<ProjectImage[]>([]);

  const addProject = (project: ProjectImage) => {
    setSavedProjects(prev => [project, ...prev]);
  };

  const removeProject = (id: string) => {
    setSavedProjects(prev => prev.filter(project => project.id !== id));
  };

  return (
    <ProjectContext.Provider value={{
      currentImage,
      savedProjects,
      setCurrentImage,
      addProject,
      removeProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectState => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};