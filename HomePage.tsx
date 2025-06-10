import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Home, ArrowRight } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import { useProject } from '../context/ProjectContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentImage } = useProject();
  
  const handleImageUploaded = (imageData: any) => {
    setCurrentImage(imageData);
    navigate('/editor');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Visualisez votre maison de rêve
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Importez une photo de votre maison et visualisez instantanément comment de nouveaux portails ou volets transformeraient son apparence.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-16">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-blue-50 p-8 flex items-center justify-center">
              <div className="text-center">
                <Home className="w-24 h-24 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Transformez votre extérieur
                </h2>
                <p className="text-gray-600">
                  Testez différents styles et designs avant de prendre votre décision
                </p>
              </div>
            </div>
            
            <div className="md:w-1/2 p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Commencez votre projet
              </h3>
              <ImageUploader onImageUploaded={handleImageUploaded} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard 
            icon={<Upload className="w-10 h-10 text-blue-500" />}
            title="Importez votre photo"
            description="Téléchargez simplement une photo de votre maison pour commencer."
          />
          <FeatureCard 
            icon={<svg className="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M3 8h18" stroke="currentColor" strokeWidth="2" />
              <path d="M8 8v13" stroke="currentColor" strokeWidth="2" />
            </svg>}
            title="Choisissez des modèles"
            description="Parcourez notre bibliothèque de portails et volets pour trouver votre style."
          />
          <FeatureCard 
            icon={<ArrowRight className="w-10 h-10 text-blue-500" />}
            title="Visualisez le résultat"
            description="Voyez instantanément à quoi ressemblerait votre maison avec ces changements."
          />
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-5px]">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HomePage;