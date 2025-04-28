"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceFrame } from '@/components/layout';
import { LoadingAnimation } from '@/components/shared';
import { useAppContext, STEPS } from '@/context/app-context';

// 模拟API调用 - 在实际应用中，这将是对后端的请求
const generateGardenPlan = async () => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // 返回模拟结果
  return [
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
};

export default function LoadingPage() {
  const router = useRouter();
  const { setResults, goToStep } = useAppContext();
  
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
    const fetchResults = async () => {
      try {
        const results = await generateGardenPlan();
        
        // 更新全局状态
        setResults(results);
        
        // 更新步骤
        goToStep(STEPS.RESULTS);
        
        // 导航到结果页面
        router.push('/results');
      } catch (err) {
        console.error('生成计划时出错:', err);
        // 导航回偏好页面
        router.push('/preferences');
      }
    };
    
    fetchResults();
  }, [router, setResults, goToStep]);
  
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