import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Move, RotateCw, Trash2 } from 'lucide-react';

interface CanvasEditorProps {
  image: {
    id: string;
    dataUrl: string;
    name: string;
  };
  setCanvasRef: (canvas: fabric.Canvas | null) => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ image, setCanvasRef }) => {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize canvas
  useEffect(() => {
    if (canvasElRef.current && !canvasRef.current) {
      const canvas = new fabric.Canvas(canvasElRef.current, {
        preserveObjectStacking: true,
        selection: true,
        backgroundColor: '#f9f9f9'
      });
      
      canvas.on('selection:created', (e) => {
        setSelectedObject(e.selected?.[0] || null);
      });
      
      canvas.on('selection:updated', (e) => {
        setSelectedObject(e.selected?.[0] || null);
      });
      
      canvas.on('selection:cleared', () => {
        setSelectedObject(null);
      });
      
      canvasRef.current = canvas;
      setCanvasRef(canvas);
      
      return () => {
        canvas.dispose();
        canvasRef.current = null;
        setCanvasRef(null);
      };
    }
  }, [setCanvasRef]);

  // Load background image
  useEffect(() => {
    if (canvasRef.current && image) {
      setIsLoading(true);
      
      fabric.Image.fromURL(image.dataUrl, (img) => {
        const canvas = canvasRef.current!;
        canvas.clear();
        
        // Calculate dimensions
        const containerWidth = containerRef.current?.clientWidth || 800;
        const containerHeight = containerRef.current?.clientHeight || 600;
        
        const imgRatio = img.width! / img.height!;
        let canvasWidth = containerWidth;
        let canvasHeight = containerWidth / imgRatio;
        
        // If image is too tall, adjust dimensions
        if (canvasHeight > containerHeight) {
          canvasHeight = containerHeight;
          canvasWidth = containerHeight * imgRatio;
        }
        
        // Set canvas dimensions
        canvas.setWidth(canvasWidth);
        canvas.setHeight(canvasHeight);
        
        // Scale image to fit canvas
        img.scaleToWidth(canvasWidth);
        
        // Add background image (not selectable)
        img.set({
          selectable: false,
          evented: false,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true
        });
        
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        setIsLoading(false);
      }, { crossOrigin: 'anonymous' });
    }
  }, [image]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current && image) {
        const canvas = canvasRef.current;
        const containerWidth = containerRef.current.clientWidth;
        const bgImage = canvas.backgroundImage;
        
        if (bgImage) {
          const imgRatio = bgImage.width! / bgImage.height!;
          const canvasWidth = containerWidth;
          const canvasHeight = containerWidth / imgRatio;
          
          canvas.setWidth(canvasWidth);
          canvas.setHeight(canvasHeight);
          
          // Scale background image
          bgImage.scaleToWidth(canvasWidth);
          canvas.renderAll();
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [image]);

  // Actions for selected object
  const handleRotate = (angle: number) => {
    if (selectedObject && canvasRef.current) {
      selectedObject.rotate((selectedObject.angle || 0) + angle);
      canvasRef.current.renderAll();
    }
  };
  
  const handleDelete = () => {
    if (selectedObject && canvasRef.current) {
      canvasRef.current.remove(selectedObject);
      setSelectedObject(null);
    }
  };

  const handleBringForward = () => {
    if (selectedObject && canvasRef.current) {
      canvasRef.current.bringForward(selectedObject);
    }
  };

  return (
    <div>
      <div 
        ref={containerRef} 
        className="w-full relative rounded overflow-hidden"
        style={{ minHeight: '400px', maxHeight: '70vh' }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <canvas ref={canvasElRef} />
      </div>
      
      {selectedObject && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md flex flex-wrap items-center gap-2">
          <div className="text-sm text-gray-600 mr-2">Sélection:</div>
          <button
            onClick={() => handleRotate(-15)}
            className="p-2 bg-white rounded-md hover:bg-gray-200 transition-colors"
            title="Rotation -15°"
          >
            <RotateCw className="w-5 h-5 transform -scale-x-100" />
          </button>
          <button
            onClick={() => handleRotate(15)}
            className="p-2 bg-white rounded-md hover:bg-gray-200 transition-colors"
            title="Rotation +15°"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleBringForward}
            className="p-2 bg-white rounded-md hover:bg-gray-200 transition-colors"
            title="Avancer"
          >
            <Move className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-white rounded-md hover:bg-gray-200 transition-colors text-red-500"
            title="Supprimer"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CanvasEditor;
