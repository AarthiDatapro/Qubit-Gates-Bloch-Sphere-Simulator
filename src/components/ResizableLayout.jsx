import React, { useState, useRef, useEffect } from 'react';

const ResizableLayout = ({ children }) => {
  const [widths, setWidths] = useState([40, 30, 30]); // Percentage widths for the three blocks
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const containerRef = useRef(null);

  const handleMouseDown = (index) => (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragIndex(index);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || dragIndex === null) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const containerWidth = rect.width;
    
    // Calculate new widths based on mouse position
    const newWidths = [...widths];
    const leftBlockWidth = (x / containerWidth) * 100;
    const rightBlockWidth = 100 - leftBlockWidth - widths[dragIndex + 1];
    
    // Ensure minimum widths (10% each)
    if (leftBlockWidth >= 10 && rightBlockWidth >= 10) {
      newWidths[dragIndex] = leftBlockWidth;
      newWidths[dragIndex + 1] = rightBlockWidth;
      setWidths(newWidths);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragIndex(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragIndex, widths]);

  useEffect(() => {
    const handleMouseLeave = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragIndex(null);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="resizable-layout"
      style={{ cursor: isDragging ? 'col-resize' : 'default' }}
    >
      {React.Children.map(children, (child, index) => (
        <div key={index} className="resizable-block" style={{ width: `${widths[index]}%` }}>
          {child}
          {index < children.length - 1 && (
            <div
              className="resize-handle"
              onMouseDown={handleMouseDown(index)}
              style={{ cursor: 'col-resize' }}
            >
              <div className="resize-handle-line"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResizableLayout;
