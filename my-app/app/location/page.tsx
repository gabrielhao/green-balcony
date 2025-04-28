"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceFrame, ProgressBar, BackButton } from '@/components/layout';
import { ParallaxContainer } from '@/components/shared';
import { useLocation } from '@/hooks/useLocation';
import { useAppContext, STEPS } from '@/context/app-context';

export default function LocationPage() {
  const router = useRouter();
  const { setLocation, goToStep } = useAppContext();
  const locationService = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle back button click
  const handleBack = () => {
    router.push('/');
  };
  
  // Handle location permission granted
  const handleAllowLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const locationData = await locationService.getCurrentLocation();
      setLocation(locationData);
      goToStep(STEPS.PHOTOS);
      router.push('/photos');
    } catch (err) {
      setError('Unable to get your location. Please try manual setting.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle manual location setting
  const handleManualSet = () => {
    router.push('/location/manual');
  };
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <DeviceFrame>
        <div className="h-full flex flex-col items-center p-8 bg-white">
          <div className="w-full flex justify-between items-center mb-4">
            <BackButton onClick={handleBack} />
            <ProgressBar currentStep={1} totalSteps={4} />
          </div>
          
          <div className="flex-1 flex flex-col items-start w-full">
            <h2 className="text-3xl font-bold text-primary mb-3">Plants need care, just like pets.</h2>
            <p className="text-gray-600 text-lg mb-6">We need your location to provide accurate sunlight & temp data.</p>
            
            <ParallaxContainer 
              backgroundImage="/bg_clean_simple_vector_illustration_empty_outdoor_balco_6909461a-7416-4373-8d07-aa06cffe6b3a.png"
              foregroundImage="/man.png"
            />
            
            <div className="w-full mt-8">
              <button 
                onClick={handleAllowLocation}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-full transition duration-300 ease-in-out"
              >
                {isLoading ? 'Getting location...' : 'OK'}
              </button>
              
              {error && (
                <p className="text-red-500 text-sm mt-4 text-center">
                  {error}
                </p>
              )}
              
              {/* Optional manual location setting link */}
              <p className="text-center mt-4">
                <button 
                  onClick={handleManualSet}
                  className="text-primary underline text-sm"
                  disabled={isLoading}
                >
                  Set location manually
                </button>
              </p>
            </div>
          </div>
        </div>
      </DeviceFrame>
    </main>
  );
} 