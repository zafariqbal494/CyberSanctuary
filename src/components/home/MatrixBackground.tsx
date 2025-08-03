
import { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Clear any existing characters
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const columns = Math.floor(window.innerWidth / 20); // Approx character width
    
    // Create matrix characters
    for (let i = 0; i < columns; i++) {
      const character = document.createElement('div');
      character.className = 'matrix-character';
      character.style.left = `${i * 20 + Math.random() * 10}px`;
      character.style.animationDelay = `${Math.random() * 5}s`;
      character.style.opacity = `${Math.random() * 0.5 + 0.3}`;
      character.textContent = chars[Math.floor(Math.random() * chars.length)];
      
      container.appendChild(character);
    }
    
    // Create more characters at random intervals
    const interval = setInterval(() => {
      if (!container) {
        clearInterval(interval);
        return;
      }
      
      const character = document.createElement('div');
      character.className = 'matrix-character';
      character.style.left = `${Math.random() * window.innerWidth}px`;
      character.style.animationDuration = `${Math.random() * 4 + 6}s`;
      character.style.opacity = `${Math.random() * 0.5 + 0.3}`;
      character.textContent = chars[Math.floor(Math.random() * chars.length)];
      
      container.appendChild(character);
      
      // Remove old characters to prevent too many DOM elements
      if (container.children.length > 300) {
        container.removeChild(container.firstChild!);
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default MatrixBackground;
