import React, { useEffect, useState } from 'react';
// import '../app.css'; // Ensure correct import for your CSS

const CursorBubble: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Adding window.scrollY to the mouse position to account for scrolling
      setCursorPosition({
        x: e.clientX,
        y: e.clientY + window.scrollY, // Add scroll position to Y coordinate
      });
    };

    // Adding mousemove event listener for cursor tracking
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="cursor-bubble"
      style={{
        left: `${cursorPosition.x}px`,
        top: `${cursorPosition.y}px`,
      }}
    />
  );
};

export default CursorBubble;
