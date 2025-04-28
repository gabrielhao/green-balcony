"use client";

import { BackButton } from "@/components/layout";
import { ProgressBar } from "@/components/layout";
import { ParallaxContainer } from "@/components/shared/parallax-container";
import { LocationPermissionCard } from "@/components/shared/location-permission-card";

interface LocationScreenProps {
  onBack: () => void;
  onAllow: () => void;
  onManualSet: () => void;
  currentStep: number;
  totalSteps: number;
  backgroundImage: string;
  foregroundImage: string;
}

export function LocationScreen({ 
  onBack, 
  onAllow, 
  onManualSet,
  currentStep,
  totalSteps,
  backgroundImage,
  foregroundImage
}: LocationScreenProps) {
  return (
    <div className="h-full flex flex-col items-center p-8 bg-white">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4">
        <BackButton onClick={onBack} />
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-start w-full">
        <h2 className="text-3xl font-bold text-primary mb-3">
          Plants need care, just like pets.
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          We need your location to provide accurate sunlight & temp data.
        </p>
        
        <ParallaxContainer 
          backgroundImage={backgroundImage}
          foregroundImage={foregroundImage}
        />

        <LocationPermissionCard 
          onAllow={onAllow}
          onManualSet={onManualSet}
        />
      </div>
    </div>
  );
} 