"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceFrame, ProgressBar, BackButton } from '@/components/layout';
import { useAppContext, STEPS } from '@/context/app-context';
import { useLocation } from '@/hooks/useLocation';

export default function ManualLocationPage() {
  const router = useRouter();
  const { setLocation, goToStep } = useAppContext();
  const locationService = useLocation();
  
  const [address, setAddress] = useState('');
  const [sunExposure, setSunExposure] = useState<'full' | 'partial' | 'shade' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 处理返回按钮点击
  const handleBack = () => {
    router.push('/location');
  };
  
  // 处理地址输入变化
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };
  
  // 处理阳光照射选择
  const handleExposureSelect = (exposure: 'full' | 'partial' | 'shade') => {
    setSunExposure(exposure);
  };
  
  // 检查是否可以提交
  const canSubmit = address.trim().length > 0 && sunExposure !== null;
  
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 设置手动位置
      let locationData = await locationService.setManualLocation(address);
      
      // 添加阳光照射信息
      if (sunExposure) {
        locationData = locationService.setSunExposure(sunExposure);
      }
      
      // 更新全局状态
      setLocation(locationData);
      
      // 更新步骤
      goToStep(STEPS.PHOTOS);
      
      // 导航到下一页
      router.push('/photos');
    } catch (err) {
      setError('Error setting location. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
            <h2 className="text-3xl font-bold text-primary mb-3">Set your location</h2>
            <p className="text-gray-600 text-lg mb-6">Tell us where you are and how much sunlight your balcony gets</p>
            
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {/* 位置输入 */}
              <div className="space-y-2">
                <label htmlFor="address" className="block text-lg font-medium text-gray-700">
                  Your address or city
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., London, UK"
                />
              </div>
              
              {/* 阳光照射选择 */}
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">
                  How much sunlight does your balcony get?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className={`p-4 rounded-xl border ${
                      sunExposure === 'full' 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleExposureSelect('full')}
                  >
                    <i className="ri-sun-line text-3xl block mb-2"></i>
                    <span>Full Sun</span>
                    <p className="text-xs mt-1 text-current opacity-80">6+ hours</p>
                  </button>
                  
                  <button
                    type="button"
                    className={`p-4 rounded-xl border ${
                      sunExposure === 'partial' 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleExposureSelect('partial')}
                  >
                    <i className="ri-sun-cloudy-line text-3xl block mb-2"></i>
                    <span>Partial Shade</span>
                    <p className="text-xs mt-1 text-current opacity-80">3-6 hours</p>
                  </button>
                  
                  <button
                    type="button"
                    className={`p-4 rounded-xl border ${
                      sunExposure === 'shade' 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleExposureSelect('shade')}
                  >
                    <i className="ri-moon-clear-line text-3xl block mb-2"></i>
                    <span>Shade</span>
                    <p className="text-xs mt-1 text-current opacity-80">Less than 3 hours</p>
                  </button>
                </div>
              </div>
              
              {/* 错误消息 */}
              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}
              
              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={!canSubmit || isLoading}
                className={`w-full py-4 rounded-full font-semibold mt-8 transition-all ${
                  canSubmit && !isLoading
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Processing...' : 'Continue'}
              </button>
            </form>
          </div>
        </div>
      </DeviceFrame>
    </main>
  );
} 