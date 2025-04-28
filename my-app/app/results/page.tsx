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

// 示例植物数据
const recommendedPlants = [
  {
    id: 'plant1',
    name: 'Parsley',
    location: 'Right side of planter',
    description: 'Tolerates partial shade well, aromatic and versatile in cooking',
    image: '/assets/plants/parsley.jpg'
  },
  {
    id: 'plant2',
    name: 'Cilantro/Coriander',
    location: 'Left side of planter',
    description: 'Tolerates partial shade well, aromatic and versatile in cooking',
    image: '/assets/plants/cilantro.jpg'
  },
  {
    id: 'plant3',
    name: 'Mint',
    location: 'Center back of planter',
    description: 'Thrives in most conditions, fragrant, great for teas and cocktails',
    image: '/assets/plants/mint.jpg'
  },
  {
    id: 'plant4',
    name: 'Basil',
    location: 'Center front of planter',
    description: 'Loves sunshine, perfect companion for tomatoes in cooking',
    image: '/assets/plants/basil.jpg'
  }
];

export default function ResultsPage() {
  const router = useRouter();
  const { results, goToStep } = useAppContext();
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null);
  
  // 如果没有结果，重定向到偏好页面
  useEffect(() => {
    if (results.length === 0) {
      router.push('/preferences');
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
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <DeviceFrame>
        <div className="h-full flex flex-col bg-white overflow-hidden relative">
          {/* Preview image (fixed) */}
          <div className="relative h-[60%] bg-black">
            <img 
              src="/assets/balcony_preview.png" 
              alt="AI generated garden preview"
              className="w-full h-full object-cover"
              onClick={() => showFullImage('/assets/balcony_preview.png')}
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
              {results.map(plant => (
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