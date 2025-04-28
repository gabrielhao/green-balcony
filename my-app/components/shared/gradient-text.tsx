"use client";

import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  gradient?: string;
  className?: string;
}

export function GradientText({
  children,
  gradient = 'from-primary to-primary-light',
  className = '',
}: GradientTextProps) {
  return (
    <span 
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
} 