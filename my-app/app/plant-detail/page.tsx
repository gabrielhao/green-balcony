"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { DeviceFrame } from '@/components/layout';
import { IconButton } from '@/components/shared';
import { useAppContext } from '@/context/app-context';

export default function PlantDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { results } = useAppContext();
  const plantName = searchParams.get('name');
  
  // Find the plant in results
  const plant = results.find(p => p.name === plantName);
  
  if (!plant) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
        <DeviceFrame>
          <div className="h-full flex flex-col bg-white p-6">
            <p className="text-gray-600">Plant not found</p>
          </div>
        </DeviceFrame>
      </main>
    );
  }
  
  const handleBackClick = () => {
    router.back();
  };
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <DeviceFrame>
        <div className="h-full flex flex-col bg-white">
          {/* Header */}
          <div className="relative h-[40%] bg-primary-bg transition-all duration-300">
            <div className="absolute top-6 left-6">
              <IconButton 
                icon="ri-arrow-left-line" 
                onClick={handleBackClick}
                variant="light"
                ariaLabel="Go back"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white -mt-6 rounded-t-3xl overflow-y-auto transition-all duration-300">
            <div className="px-6 py-8">
              {/* Plant Identity */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-[32px] font-bold text-gray-900 mb-2">{plant.name}</h1>
                </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-6">Description</h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  {plant.description}
                </p>
              </div>

              {/* Growing Conditions */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-6">Growing Conditions</h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  {plant.growingConditions}
                </p>
              </div>

              {/* Planting Tips */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-6">Planting Tips</h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  {plant.plantingTips}
                </p>
              </div>

              {/* Care Tips */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-6">Care Tips</h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  {plant.care_tips}
                </p>
              </div>

              {/* Harvesting Tips */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-6">Harvesting Tips</h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  {plant.harvestingTips}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DeviceFrame>
    </main>
  );
} 