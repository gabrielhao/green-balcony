"use client";

import { useRouter } from 'next/navigation';
import { 
  DeviceFrame, 
  ProgressBar, 
  BackButton 
} from '@/components/layout';
import { 
  PreferenceCard, 
  SubOptionsList 
} from '@/components/shared';
import { usePlantPreferences } from '@/hooks/usePlantPreferences';
import { useAppContext, STEPS } from '@/context/app-context';

export default function PreferencesPage() {
  const router = useRouter();
  const { goToStep, setPreferences } = useAppContext();
  const { 
    preferences,
    setGrowType,
    setSubType,
    setCycleType,
    setWinterType,
    isComplete,
    ornamentalOptions,
    edibleOptions,
    perennialOptions
  } = usePlantPreferences();
  
  // 处理返回按钮点击
  const handleBack = () => {
    router.push('/photos');
  };
  
  // 处理提交按钮点击
  const handleSubmit = () => {
    if (isComplete) {
      // 保存偏好到全局状态
      setPreferences(preferences);
      
      // 更新步骤
      goToStep(STEPS.RESULTS);
      
      // 导航到加载页面
      router.push('/loading');
    }
  };
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <DeviceFrame>
        <div className="h-full flex flex-col items-center p-8 bg-white relative">
          <div className="w-full flex justify-between items-center mb-4">
            <BackButton onClick={handleBack} />
            <ProgressBar currentStep={3} totalSteps={4} />
          </div>

          {/* 可滚动内容区域 */}
          <div className="screen-content w-full flex-1 flex flex-col items-start pb-32 overflow-y-auto scrollbar-hide">
            <h2 className="text-3xl font-bold text-primary mb-3">Choose your plants</h2>
            <p className="text-gray-600 text-lg mb-6">Tell us your preferences for personalized recommendations</p>

            {/* I want to grow section */}
            <div className="preference-section mb-8 w-full">
              <h3 className="text-lg font-semibold mb-4">I want to grow:</h3>
              <div className="option-group flex flex-col gap-3 w-full">
                <PreferenceCard
                  icon="ri-eye-line"
                  title="Ornamental"
                  selected={preferences.growType === 'ornamental'}
                  onSelect={() => setGrowType('ornamental')}
                />
                <SubOptionsList
                  options={ornamentalOptions}
                  selectedOption={preferences.subType}
                  onSelect={setSubType}
                  parentSelected={preferences.growType === 'ornamental'}
                />
                <PreferenceCard
                  icon="ri-emotion-happy-line"
                  title="Edible"
                  selected={preferences.growType === 'edible'}
                  onSelect={() => setGrowType('edible')}
                />
                <SubOptionsList
                  options={edibleOptions}
                  selectedOption={preferences.subType}
                  onSelect={setSubType}
                  parentSelected={preferences.growType === 'edible'}
                />
                <PreferenceCard
                  icon="ri-contrast-line"
                  title="Both"
                  selected={preferences.growType === 'both'}
                  onSelect={() => setGrowType('both')}
                />
              </div>
            </div>

            {/* Growing cycle section */}
            <div className="preference-section mb-8 w-full">
              <h3 className="text-lg font-semibold mb-4">Growing cycle:</h3>
              <div className="option-group flex flex-col gap-3 w-full">
                <PreferenceCard
                  icon="ri-repeat-2-line"
                  title="Perennial"
                  description="Plant once, harvest yearly"
                  selected={preferences.cycleType === 'perennial'}
                  onSelect={() => setCycleType('perennial')}
                />
                <SubOptionsList
                  options={perennialOptions}
                  selectedOption={preferences.winterType}
                  onSelect={(id: string) => setWinterType(id as "indoors" | "outdoors" | "")}
                  parentSelected={preferences.cycleType === 'perennial'}
                />
                <PreferenceCard
                  icon="ri-restart-line"
                  title="Annual"
                  description="Fresh start yearly"
                  selected={preferences.cycleType === 'annual'}
                  onSelect={() => setCycleType('annual')}
                />
              </div>
            </div>
          </div>

          {/* 内部底部按钮 */}
          <div className="absolute left-0 right-0 bottom-0 flex justify-center items-center pb-8">
            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className={`w-[90%] max-w-md h-[56px] rounded-full text-lg font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-300 ease-in-out
                ${isComplete ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Create My Garden
            </button>
          </div>
        </div>
      </DeviceFrame>
    </main>
  );
} 