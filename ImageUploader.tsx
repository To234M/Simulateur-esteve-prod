import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploaderProps {
  onImageUploaded: (imageData: any) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Veuillez sélectionner une image.');
      return;
    }

    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageData = {
          id: uuidv4(),
          dataUrl: e.target.result as string,
          name: file.name,
          timestamp: Date.now()
        };
        onImageUploaded(imageData);
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      alert('Une erreur est survenue lors de la lecture du fichier.');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileInput}
      />
      
      <div className="flex flex-col items-center">
        {isLoading ? (
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-blue-500 mb-4" />
            <div className="mb-2 font-medium text-gray-800">
              {isDragging ? 'Déposez votre image ici' : 'Glissez-déposez votre image ici'}
            </div>
            <div className="text-sm text-gray-500 mb-4">ou</div>
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Parcourir
            </button>
            <div className="mt-3 text-xs text-gray-500">
              PNG, JPG ou JPEG (max. 10 MB)
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;