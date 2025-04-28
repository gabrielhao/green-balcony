"use client";

import { useEffect, useRef, useState } from 'react';

interface ParallaxContainerProps {
  backgroundImage: string;
  foregroundImage: string;
}

export function ParallaxContainer({ backgroundImage, foregroundImage }: ParallaxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const moveX = (mousePosition.x - 0.5) * 10;
  const moveY = (mousePosition.y - 0.5) * 5;

  return (
    <div 
      ref={containerRef}
      className="relative w-[calc(100%+4rem)] h-[350px] overflow-hidden -mx-8 bg-white"
    >
      {/* Sun element */}
      <div className="absolute w-[60px] h-[60px] top-10 right-10 rounded-full bg-yellow-300 opacity-80 blur-sm sun-glow" />
      
      {/* Background image - balcony background */}
      <div 
        className="absolute w-full h-full top-0 left-0 bg-cover bg-center transition-transform duration-300 ease-out"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: `translate(${moveX * -1}px, ${moveY * -1}px)`
        }}
      />
      
      {/* Foreground image - man */}
      <div 
        className="absolute w-full h-full bottom-0 left-0 bg-contain bg-bottom bg-no-repeat transition-transform duration-300 ease-out"
        style={{
          backgroundImage: `url(${foregroundImage})`,
          transform: `translate(${moveX * 0.3}px, ${moveY * 0.2}px)`
        }}
      />
    </div>
  );
} 