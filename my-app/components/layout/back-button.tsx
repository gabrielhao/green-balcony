"use client";

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
      aria-label="Go back"
    >
      <i className="ri-arrow-left-line text-2xl" />
    </button>
  );
} 