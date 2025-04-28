"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="h-1 flex-1 mx-4 bg-gray-200 rounded-full">
      <div 
        className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
} 