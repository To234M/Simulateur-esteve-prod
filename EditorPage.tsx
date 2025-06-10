import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Download, RotateCcw, ZoomIn, ZoomOut, ArrowLeft } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import CanvasEditor from '../components/CanvasEditor';
import ProductLibrary from '../components/ProductLibrary';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import toast from 'react-hot-toast';

const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentImage, addProject } = useProject();
  const [canvasRef, setCanvasRef] = useState<any>(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (!currentImage) {
      navigate('/');
    }
  }, [currentImage, navigate]);

  const handleExport = () => {
    if (canvasRef) {
      try {
        const dataUrl = canvasRef.toDataURL({
          format: 'png',
          quality: 1
        });
        
        const link = document.createElement('a');
        link.download = `visionmaison-${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Image exportée avec succès');
      } catch (error) {
        toast.error('Erreur lors de l\'export de l\'image');
        console.error('Export error:', error);
      }
    }
  };

  const handleSave = () => {
    if (canvasRef && currentImage) {
      try {
        const dataUrl = canvasRef.toDataURL({
          format: 'png',
          quality: 1
        });
        
        const savedProject = {
          id: `project-${Date.now()}`,
          dataUrl,
          name: `${currentImage.name.split('.')[0]}-edited`,
          timestamp: Date.now()
        };
        
        addProject(savedProject);
        toast.success('Projet sauvegardé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la sauvegarde du projet');
        console.error('Save error:', error);
      }
    }
  };

  const handleToggleBeforeAfter = () => {
    if (canvasRef && !showBeforeAfter) {
      const dataUrl = canvasRef.toDataURL({
        format: 'png',
        quality: 1
      });
      setEditedImageUrl(dataUrl);
    }
    setShowBeforeAfter(!showBeforeAfter);
  };

  if (!currentImage) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar for products */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Éléments
            </h2>
            <ProductLibrary canvasRef={canvasRef} />
          </div>
        </div>
        
        {/* Main editor area */}
        <div className="flex-grow">
          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow-md p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-md flex items-center text-gray-600"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Retour</span>
              </button>
              
              <button
                onClick={handleToggleBeforeAfter}
                className={`p-2 rounded-md flex items-center transition-colors ${
                  showBeforeAfter ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <RotateCcw className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Avant/Après</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="p-2 hover:bg-gray-100 rounded-md text-gray-600 flex items-center"
              >
                <Save className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Sauvegarder</span>
              </button>
              
              <button
                onClick={handleExport}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center transition-colors"
              >
                <Download className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Exporter</span>
              </button>
            </div>
          </div>
          
          {/* Editor canvas */}
          {showBeforeAfter && editedImageUrl ? (
            <div className="bg-white rounded-lg shadow-md p-4">
              <BeforeAfterSlider
                beforeImage={currentImage.dataUrl}
                afterImage={editedImageUrl}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4">
              <CanvasEditor
                image={currentImage}
                setCanvasRef={setCanvasRef}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;