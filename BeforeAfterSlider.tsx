import React, { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const containerWidth = rect.width;
        
        // Calculate percentage (constrain between 0 and 100)
        const percentage = Math.max(0, Math.min(100, (x / containerWidth) * 100));
        setSliderPosition(percentage);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const containerWidth = rect.width;
      
      const percentage = Math.max(0, Math.min(100, (x / containerWidth) * 100));
      setSliderPosition(percentage);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden max-w-full" 
      style={{ 
        height: '500px',
        touchAction: 'none',
        userSelect: 'none'
      }}
      onTouchMove={handleTouchMove}
    >
      {/* Before Image - Full width */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={beforeImage} 
          alt="Avant" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* After Image - Clipped */}
      <div 
        className="absolute inset-0 h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={afterImage} 
          alt="Après" 
          className="absolute top-0 left-0 w-full h-full object-contain"
        />
      </div>
      
      {/* Slider Control */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
        style={{ 
          left: `calc(${sliderPosition}% - 0.5px)`,
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={() => setIsDragging(true)}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
          <div className="text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="18 17 13 12 18 7"></polyline>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-70 px-2 py-1 rounded text-sm font-medium text-gray-800">
        Avant
      </div>
      <div className="absolute top-4 right-4 bg-white bg-opacity-70 px-2 py-1 rounded text-sm font-medium text-gray-800">
        Après
      </div>
    </div>
  );
};

export default BeforeAfterSlider;