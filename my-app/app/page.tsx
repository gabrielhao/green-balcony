"use client";

import { useRouter } from "next/navigation";
import { DeviceFrame } from "@/components/layout";
import { WelcomeScreen } from "@/components/screens";
import { useAppContext, STEPS } from '@/context/app-context';

export default function Home() {
  const router = useRouter();
  const { goToStep } = useAppContext();

  const handleGetStarted = () => {
    // 重置到第一步
    goToStep(STEPS.LOCATION);
    
    // 导航到位置页面
    router.push('/location');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <DeviceFrame>
        <WelcomeScreen onGetStarted={handleGetStarted} />
      </DeviceFrame>
    </main>
  );
}
