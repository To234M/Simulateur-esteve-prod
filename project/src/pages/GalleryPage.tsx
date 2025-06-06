import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const GalleryPage: React.FC = () => {
  const { savedProjects, removeProject } = useProject();
  const navigate = useNavigate();
  
  const handleExport = (dataUrl: string, name: string) => {
    const link = document.createElement('a');
    link.download = `${name}-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image exportée avec succès');
  };
  
  const handleDelete = (id: string) => {
    removeProject(id);
    toast.success('Projet supprimé');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Galerie de projets</h1>
        
        {savedProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucun projet sauvegardé</h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore sauvegardé de projets. Importez une photo et créez votre première simulation !
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Commencer un projet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProjects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px]">
                <div className="aspect-w-4 aspect-h-3 bg-gray-100">
                  <img 
                    src={project.dataUrl} 
                    alt={project.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(project.timestamp).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleExport(project.dataUrl, project.name)}
                      className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      <span className="text-sm">Exporter</span>
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      <span className="text-sm">Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
