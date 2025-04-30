"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceFrame } from '@/components/layout';
import { 
  SlidingPanel, 
  PlantCard, 
  ActionButtonGroup 
} from '@/components/shared';
import { useAppContext, STEPS } from '@/context/app-context';

interface Plant {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const { results, goToStep, photos, preferences, location, gardenImageUrl } = useAppContext();
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null);
  const [recommendedPlants, setRecommendedPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 如果没有结果，重定向到偏好页面
  useEffect(() => {
    if (results.length === 0) {
      router.push('/preferences');
    } else {
      setRecommendedPlants(results);
      setIsLoading(false);
    }
  }, [results, router]);
  
  // 处理植物详情查看
  const handlePlantDetail = (plantName: string) => {
    router.push(`/plant-detail?name=${encodeURIComponent(plantName)}`);
  };
  
  // 处理全尺寸图片查看
  const showFullImage = (imageUrl: string) => {
    setFullImageUrl(imageUrl);
  };
  
  // 关闭全尺寸图片查看
  const closeFullImage = () => {
    setFullImageUrl(null);
  };
  
  // 处理"更改植物"操作
  const handleChangePlants = () => {
    goToStep(STEPS.PREFERENCES);
    router.push('/preferences');
  };
  
  // 处理"保存计划"操作
  const handleSavePlan = () => {
    // 在实际应用中，这会保存园艺计划
    alert('园艺计划保存成功！');
  };
  
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
        <DeviceFrame>
          <div className="h-full flex items-center justify-center">
            <p>Generating your garden plan...</p>
          </div>
        </DeviceFrame>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
        <DeviceFrame>
          <div className="h-full flex items-center justify-center">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </DeviceFrame>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <DeviceFrame>
        <div className="h-full flex flex-col bg-white overflow-hidden relative">
          {/* Preview image (fixed) */}
          <div className="relative h-[60%] bg-black">
            <img 
              src={`${gardenImageUrl}${process.env.NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN}`} 
              alt="AI generated garden preview"
              className="w-full h-full object-cover"
              onClick={() => showFullImage(`${gardenImageUrl}${process.env.NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN}`)}
            />
          </div>
          
          {/* Sliding content panel */}
          <SlidingPanel 
            initialHeight={45} 
            maxHeight={90}
            title="This is your future balcony"
          >
            <div className="px-8 pb-32 pt-6">
              {/* Plant list */}
              {recommendedPlants.map(plant => (
                <PlantCard 
                  key={plant.id}
                  plant={plant}
                  onMoreInfoClick={handlePlantDetail}
                />
              ))}
            </div>
            
            {/* Bottom action buttons */}
            <ActionButtonGroup
              primaryAction={{
                icon: 'ri-refresh-line',
                label: 'Change Plants',
                onClick: handleChangePlants
              }}
              secondaryAction={{
                icon: 'ri-download-line',
                label: 'Save Plan',
                onClick: handleSavePlan
              }}
            />
          </SlidingPanel>
          
          {/* Full image overlay */}
          {fullImageUrl && (
            <div 
              className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center"
              onClick={closeFullImage}
            >
              <img 
                src={fullImageUrl} 
                alt="Full size preview" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>
      </DeviceFrame>
    </main>
  );
} 