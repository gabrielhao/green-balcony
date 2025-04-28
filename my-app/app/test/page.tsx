"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceFrame } from '@/components/layout';
import { useAppContext, STEPS } from '@/context/app-context';

export default function TestPage() {
  const router = useRouter();
  const appContext = useAppContext();
  const [activeTab, setActiveTab] = useState<'info' | 'navigate' | 'debug'>('info');
  
  // 创建状态的可读描述
  const stepNames = {
    [STEPS.WELCOME]: 'Welcome Page',
    [STEPS.LOCATION]: 'Location Page',
    [STEPS.PHOTOS]: 'Photos Page',
    [STEPS.PREFERENCES]: 'Preferences Page',
    [STEPS.RESULTS]: 'Results Page'
  };

  // 导航到不同页面
  const navigateTo = (path: string) => {
    router.push(path);
  };

  // 重置应用状态
  const resetAppState = () => {
    appContext.goToStep(STEPS.WELCOME);
    appContext.setLocation({});
    appContext.clearPhotos();
    appContext.setPreferences({
      growType: null,
      subType: null,
      cycleType: null,
      winterType: null
    });
    appContext.setResults([]);
    alert('App state has been reset');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-primary text-white p-6">
          <h1 className="text-2xl font-bold">GreenBalcony Test Panel</h1>
          <p className="opacity-80">View and test application state</p>
        </div>
        
        {/* 选项卡导航 */}
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('info')}
            className={`py-4 px-6 font-medium ${activeTab === 'info' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          >
            App State
          </button>
          <button 
            onClick={() => setActiveTab('navigate')}
            className={`py-4 px-6 font-medium ${activeTab === 'navigate' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          >
            Navigation
          </button>
          <button 
            onClick={() => setActiveTab('debug')}
            className={`py-4 px-6 font-medium ${activeTab === 'debug' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          >
            Debug Tools
          </button>
        </div>
        
        {/* 内容区域 */}
        <div className="p-6">
          {/* 应用状态信息 */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Current Step</h2>
                <div className="flex items-center space-x-2">
                  <div className="bg-primary text-white rounded-full px-3 py-1 text-sm">
                    {stepNames[appContext.currentStep] || 'Unknown Step'}
                  </div>
                  <span className="text-gray-500">Step {appContext.currentStep} / {Object.keys(STEPS).length / 2 - 1}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Location Info</h2>
                {Object.keys(appContext.location).length > 0 ? (
                  <pre className="bg-white p-3 rounded border text-sm overflow-auto max-h-40">
                    {JSON.stringify(appContext.location, null, 2)}
                  </pre>
                ) : (
                  <p className="text-gray-500 italic">No location data</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Photos ({appContext.photos.length})</h2>
                {appContext.photos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {appContext.photos.map(photo => (
                      <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden">
                        <img 
                          src={photo.preview} 
                          alt="Balcony photo" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No photos</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Plant Preferences</h2>
                {appContext.preferences.growType ? (
                  <pre className="bg-white p-3 rounded border text-sm overflow-auto max-h-40">
                    {JSON.stringify(appContext.preferences, null, 2)}
                  </pre>
                ) : (
                  <p className="text-gray-500 italic">No preferences set</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Recommendations ({appContext.results.length})</h2>
                {appContext.results.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {appContext.results.map(plant => (
                      <div key={plant.id} className="bg-white p-3 rounded border flex items-start gap-3">
                        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <img 
                            src={plant.image} 
                            alt={plant.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{plant.name}</h3>
                          <p className="text-sm text-gray-500">{plant.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No recommendations yet</p>
                )}
              </div>
            </div>
          )}
          
          {/* 页面导航 */}
          {activeTab === 'navigate' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Quick Navigation</h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigateTo('/')}
                  className="bg-white border border-primary text-primary rounded-lg p-4 text-left hover:bg-primary-bg transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <i className="ri-home-line text-xl"></i>
                    <span className="font-medium">Home</span>
                  </div>
                  <p className="text-sm text-gray-500">Welcome page</p>
                </button>
                
                <button 
                  onClick={() => navigateTo('/location')}
                  className="bg-white border border-primary text-primary rounded-lg p-4 text-left hover:bg-primary-bg transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <i className="ri-map-pin-line text-xl"></i>
                    <span className="font-medium">Location Page</span>
                  </div>
                  <p className="text-sm text-gray-500">Get user location</p>
                </button>
                
                <button 
                  onClick={() => navigateTo('/location/manual')}
                  className="bg-white border border-primary text-primary rounded-lg p-4 text-left hover:bg-primary-bg transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <i className="ri-edit-line text-xl"></i>
                    <span className="font-medium">Manual Location</span>
                  </div>
                  <p className="text-sm text-gray-500">Set location and sunlight manually</p>
                </button>
                
                <button 
                  onClick={() => navigateTo('/photos')}
                  className="bg-white border border-primary text-primary rounded-lg p-4 text-left hover:bg-primary-bg transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <i className="ri-image-line text-xl"></i>
                    <span className="font-medium">Photos Page</span>
                  </div>
                  <p className="text-sm text-gray-500">Upload balcony photos</p>
                </button>
                
                <button 
                  onClick={() => navigateTo('/preferences')}
                  className="bg-white border border-primary text-primary rounded-lg p-4 text-left hover:bg-primary-bg transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <i className="ri-list-check text-xl"></i>
                    <span className="font-medium">Preferences Page</span>
                  </div>
                  <p className="text-sm text-gray-500">Set plant preferences</p>
                </button>
                
                <button 
                  onClick={() => navigateTo('/loading')}
                  className="bg-white border border-primary text-primary rounded-lg p-4 text-left hover:bg-primary-bg transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <i className="ri-loader-4-line text-xl"></i>
                    <span className="font-medium">Loading Page</span>
                  </div>
                  <p className="text-sm text-gray-500">Generate plant recommendations</p>
                </button>
                
                <button 
                  onClick={() => navigateTo('/results')}
                  className="bg-white border border-primary text-primary rounded-lg p-4 text-left hover:bg-primary-bg transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <i className="ri-plant-line text-xl"></i>
                    <span className="font-medium">Results Page</span>
                  </div>
                  <p className="text-sm text-gray-500">View recommended plants</p>
                </button>
              </div>
            </div>
          )}
          
          {/* 调试工具 */}
          {activeTab === 'debug' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Debug Tools</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Reset App State</h3>
                <p className="text-gray-500 mb-4">Clear all app data and reset to initial state</p>
                <button 
                  onClick={resetAppState}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Reset State
                </button>
      </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">设置当前步骤</h3>
                <p className="text-gray-500 mb-4">直接修改应用当前步骤</p>
                <div className="flex gap-2">
                  {Object.entries(STEPS).filter(([key]) => isNaN(Number(key))).map(([key, value]) => (
        <button
                      key={key}
                      onClick={() => appContext.goToStep(value as number)}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        appContext.currentStep === value 
              ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Test Data</h3>
                <p className="text-gray-500 mb-4">Fill test data for debugging</p>
                <div className="flex gap-2 flex-wrap">
                  <button 
                    onClick={() => {
                      appContext.setLocation({
                        latitude: 39.9042,
                        longitude: 116.4074,
                        address: 'Beijing Haidian District',
                        sunExposure: 'partial'
                      });
                      alert('Added test location data');
                    }}
                    className="px-3 py-2 rounded-lg bg-white border hover:bg-gray-100 transition-colors"
                  >
                    Add Test Location
        </button>
                  
        <button
                    onClick={() => {
                      appContext.setPreferences({
                        growType: 'both',
                        subType: null,
                        cycleType: 'annual',
                        winterType: null
                      });
                      alert('Added test preference data');
                    }}
                    className="px-3 py-2 rounded-lg bg-white border hover:bg-gray-100 transition-colors"
                  >
                    Add Test Preferences
        </button>
                  
        <button
                    onClick={() => {
                      // 调用加载页面中的生成函数
                      const mockResults = [
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
                        }
                      ];
                      appContext.setResults(mockResults);
                      alert('Added test results data');
                    }}
                    className="px-3 py-2 rounded-lg bg-white border hover:bg-gray-100 transition-colors"
                  >
                    Add Test Results
        </button>
      </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t p-4 flex justify-between items-center">
          <button
            onClick={() => navigateTo('/')}
            className="text-primary hover:underline"
          >
            Return to Home
          </button>
          
          <div className="text-sm text-gray-500">
            GreenBalcony v1.0 Test Panel
          </div>
        </div>
      </div>
    </main>
  );
} 