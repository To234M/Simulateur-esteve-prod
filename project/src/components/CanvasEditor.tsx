import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { Move, RotateCw, Trash2, Undo2, Redo2 } from 'lucide-react';

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
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const isRestoring = useRef(false);

  const saveState = useCallback(() => {
    if (!canvasRef.current || isRestoring.current) return;
    undoStack.current.push(JSON.stringify(canvasRef.current));
    if (undoStack.current.length > 50) {
      undoStack.current.shift();
    }
    redoStack.current = [];
  }, []);

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

      const stateEvents = ['object:added', 'object:modified', 'object:removed'];
      stateEvents.forEach(evt => canvas.on(evt, saveState));

      canvasRef.current = canvas;
      setCanvasRef(canvas);
      
      return () => {
        canvas.dispose();
        canvasRef.current = null;
        setCanvasRef(null);
        stateEvents.forEach(evt => canvas.off(evt, saveState));
      };
    }
  }, [setCanvasRef, saveState]);

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
        
        canvas.setBackgroundImage(img, () => {
          canvas.renderAll();
          saveState();
        });
        setIsLoading(false);
      }, { crossOrigin: 'anonymous' });
    }
  }, [image, saveState]);

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
      saveState();
    }
  };
  
  const handleDelete = () => {
    if (selectedObject && canvasRef.current) {
      canvasRef.current.remove(selectedObject);
      setSelectedObject(null);
      saveState();
    }
  };

  const handleBringForward = () => {
    if (selectedObject && canvasRef.current) {
      canvasRef.current.bringForward(selectedObject);
      saveState();
    }
  };

  const handleUndo = () => {
    if (!canvasRef.current || undoStack.current.length <= 1) return;
    const currentState = undoStack.current.pop();
    if (!currentState) return;
    redoStack.current.push(currentState);
    const prevState = undoStack.current[undoStack.current.length - 1];
    if (prevState) {
      isRestoring.current = true;
      canvasRef.current.loadFromJSON(prevState, () => {
        canvasRef.current!.renderAll();
        isRestoring.current = false;
      });
    }
  };

  const handleRedo = () => {
    if (!canvasRef.current || redoStack.current.length === 0) return;
    const nextState = redoStack.current.pop()!;
    undoStack.current.push(nextState);
    isRestoring.current = true;
    canvasRef.current.loadFromJSON(nextState, () => {
      canvasRef.current!.renderAll();
      isRestoring.current = false;
    });
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        )}
        <canvas ref={canvasElRef} />
      </div>

      <div className="mt-4 p-3 bg-gray-100 rounded-md flex flex-wrap items-center gap-2">
        <button
          onClick={handleUndo}
          className="p-2 bg-white rounded-md hover:bg-gray-200 transition-colors"
          title="Annuler"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={handleRedo}
          className="p-2 bg-white rounded-md hover:bg-gray-200 transition-colors"
          title="Rétablir"
        >
          <Redo2 className="w-5 h-5" />
        </button>
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
