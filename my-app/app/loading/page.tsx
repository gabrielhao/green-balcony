"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceFrame } from '@/components/layout';
import { LoadingAnimation } from '@/components/shared';
import { useAppContext, STEPS } from '@/context/app-context';

// 模拟API调用 - 在实际应用中，这将是对后端的请求
// const generateGardenPlan = async () => {
//   // 模拟API延迟
//   await new Promise(resolve => setTimeout(resolve, 5000));
  
//   // 返回模拟结果
//   return [
//     {
//       id: 'plant1',
//       name: 'Parsley',
//       location: 'Right side of planter',
//       description: 'Tolerates partial shade well, aromatic and versatile in cooking',
//       image: '/assets/plants/parsley.jpg'
//     },
//     {
//       id: 'plant2',
//       name: 'Cilantro/Coriander',
//       location: 'Left side of planter',
//       description: 'Tolerates partial shade well, aromatic and versatile in cooking',
//       image: '/assets/plants/cilantro.jpg'
//     },
//     {
//       id: 'plant3',
//       name: 'Mint',
//       location: 'Center back of planter',
//       description: 'Thrives in most conditions, fragrant, great for teas and cocktails',
//       image: '/assets/plants/mint.jpg'
//     },
//     {
//       id: 'plant4',
//       name: 'Basil',
//       location: 'Center front of planter',
//       description: 'Loves sunshine, perfect companion for tomatoes in cooking',
//       image: '/assets/plants/basil.jpg'
//     }
//   ];
// };

export default function LoadingPage() {
  const router = useRouter();
  const { photos, preferences, location, setResults, setGardenImageUrl, setPlantImages } = useAppContext();
  const apiCalledRef = useRef(false);
  
  // Gardening tips
  const gardeningTips = [
    "Water deeply but less frequently to encourage deep root growth",
    "Place plants according to their sunlight needs",
    "Use well-draining soil to prevent root rot",
    "Group plants with similar water needs together",
    "Prune regularly to promote healthy growth",
    "Monitor for early signs of plant problems",
    "Add organic matter to soil for better nutrients",
    "Consider companion planting for natural pest control"
  ];
  
  // 生成结果并重定向到结果页面
  useEffect(() => {
    if (apiCalledRef.current) return;
    apiCalledRef.current = true;

    const generateGardenPlan = async () => {
      try {
        const requestBody = {
          image_urls: photos.map((photo: { url: string }) => photo.url),
          user_preferences: preferences,
          location: location,
        };
        
        console.log('Request body:', JSON.stringify(requestBody, null, 2));

        const endpoint = process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT; 

        if (!endpoint) {
          throw new Error('Backend API endpoint is not defined');
        }
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Invalid response type:', contentType, text);
          throw new Error('Invalid response type from server');
        }

        const data = await response.json();

        //verify data is not empty
        const plant_recommendations = data.plant_recommendations
        const garden_image_url = data.garden_image_url
        const plant_images = data.plant_images

        console.log('Plant recommendations:', plant_recommendations);
        console.log('Garden image URL:', garden_image_url);
        console.log('Plant images:', plant_images);
        if (!plant_recommendations || plant_recommendations.length === 0) {
          throw new Error('No plant recommendations received');
        }

        if (!garden_image_url) {
          throw new Error('No garden image URL received'); 
        }

        if (!plant_images || plant_images.length === 0) {
          throw new Error('No plant images received');
        }

        setResults(plant_recommendations);
        setGardenImageUrl(garden_image_url);
        setPlantImages(plant_images);
        router.push('/results');
      } catch (err) {
        console.error('生成计划时出错:', err);
        // 导航回偏好页面
        router.push('/preferences');
        
      }
    };

    generateGardenPlan();
  }, [photos, preferences, location, setResults, setGardenImageUrl, setPlantImages, router]);
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <DeviceFrame>
        <div className="h-full flex flex-col items-center justify-center p-8 bg-white">
          <LoadingAnimation tips={gardeningTips} />
        </div>
      </DeviceFrame>
    </main>
  );
} 