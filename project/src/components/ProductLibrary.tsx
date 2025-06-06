import React, { useState } from 'react';
import { fabric } from 'fabric';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProductLibraryProps {
  canvasRef: fabric.Canvas | null;
}

// Sample product data
const PRODUCTS = {
  gates: [
    {
      id: 'gate-1',
      name: 'Portail Moderne',
      imageUrl: 'https://images.pexels.com/photos/4681540/pexels-photo-4681540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      thumbnail: 'https://images.pexels.com/photos/4681540/pexels-photo-4681540.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 'gate-2',
      name: 'Portail Classique',
      imageUrl: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      thumbnail: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 'gate-3',
      name: 'Portail Fer Forgé',
      imageUrl: 'https://images.pexels.com/photos/277516/pexels-photo-277516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      thumbnail: 'https://images.pexels.com/photos/277516/pexels-photo-277516.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ],
  shutters: [
    {
      id: 'shutter-1',
      name: 'Volet Persienné',
      imageUrl: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      thumbnail: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 'shutter-2',
      name: 'Volet Roulant',
      imageUrl: 'https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      thumbnail: 'https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 'shutter-3',
      name: 'Volet Battant',
      imageUrl: 'https://images.pexels.com/photos/2098624/pexels-photo-2098624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      thumbnail: 'https://images.pexels.com/photos/2098624/pexels-photo-2098624.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ]
};

interface CategoryProps {
  title: string;
  items: Array<{
    id: string;
    name: string;
    imageUrl: string;
    thumbnail: string;
  }>;
  canvasRef: fabric.Canvas | null;
}

interface ProductItem {
  id: string;
  name: string;
  imageUrl: string;
  thumbnail: string;
}

const ProductCategory: React.FC<CategoryProps> = ({ title, items, canvasRef }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const addItemToCanvas = (item: ProductItem) => {
    if (!canvasRef) return;
    
    fabric.Image.fromURL(item.imageUrl, (img) => {
      // Make the image background transparent
      img.set({
        cornerSize: 12,
        cornerColor: '#0096FF',
        cornerStrokeColor: '#0066FF',
        transparentCorners: false,
        name: item.name
      });
      
      // Scale down the image
      const canvasWidth = canvasRef.getWidth();
      if (img.width && img.width > canvasWidth / 3) {
        img.scaleToWidth(canvasWidth / 3);
      }
      
      // Center the image
      canvasRef.add(img);
      img.center();
      canvasRef.setActiveObject(img);
      canvasRef.renderAll();
    }, { crossOrigin: 'anonymous' });
  };
  
  return (
    <div className="mb-4">
      <button
        className="w-full flex items-center justify-between p-2 bg-gray-100 rounded-md mb-2 hover:bg-gray-200 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-800">{title}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      
      {isOpen && (
        <div className="grid grid-cols-2 gap-2">
          {items.map(item => (
            <div
              key={item.id}
              className="border rounded-md p-1 cursor-pointer hover:border-blue-400 transition-colors hover:shadow-sm"
              onClick={() => addItemToCanvas(item)}
            >
              <div className="aspect-w-1 aspect-h-1 mb-1 bg-gray-100 rounded overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs text-center truncate">{item.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductLibrary: React.FC<ProductLibraryProps> = ({ canvasRef }) => {
  return (
    <div>
      <ProductCategory 
        title="Portails" 
        items={PRODUCTS.gates} 
        canvasRef={canvasRef} 
      />
      <ProductCategory 
        title="Volets" 
        items={PRODUCTS.shutters} 
        canvasRef={canvasRef} 
      />
    </div>
  );
};

export default ProductLibrary;
