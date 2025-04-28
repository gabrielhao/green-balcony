import { useState } from 'react';
import { PlantPreferences } from '@/context/app-context';

interface SubOption {
  id: string;
  icon: string;
  title: string;
}

interface UsePreferencesReturn {
  preferences: PlantPreferences;
  setGrowType: (type: 'ornamental' | 'edible' | 'both' | null) => void;
  setSubType: (type: string | null) => void;
  setCycleType: (type: 'perennial' | 'annual' | null) => void;
  setWinterType: (type: 'indoors' | 'outdoors' | null) => void;
  isComplete: boolean;
  ornamentalOptions: SubOption[];
  edibleOptions: SubOption[];
  perennialOptions: SubOption[];
}

export function usePlantPreferences(): UsePreferencesReturn {
  // 初始化偏好状态
  const [preferences, setPreferences] = useState<PlantPreferences>({
    growType: null,
    subType: null,
    cycleType: null,
    winterType: null
  });
  
  // 设置种植类型
  const setGrowType = (type: 'ornamental' | 'edible' | 'both' | null) => {
    setPreferences(prev => ({
      ...prev,
      growType: type,
      subType: null // 重置子类型
    }));
  };
  
  // 设置子类型
  const setSubType = (type: string | null) => {
    setPreferences(prev => ({
      ...prev,
      subType: type
    }));
  };
  
  // 设置生长周期
  const setCycleType = (type: 'perennial' | 'annual' | null) => {
    setPreferences(prev => ({
      ...prev,
      cycleType: type,
      winterType: null // 重置冬季类型
    }));
  };
  
  // 设置冬季处理方式
  const setWinterType = (type: 'indoors' | 'outdoors' | null) => {
    setPreferences(prev => ({
      ...prev,
      winterType: type
    }));
  };
  
  // 检查是否完成所有必要选择
  const isComplete = () => {
    // 如果选择"both"，不需要子类型
    if (preferences.growType === 'both') {
      return preferences.cycleType === 'annual' || 
             (preferences.cycleType === 'perennial' && preferences.winterType !== null);
    }
    
    // 否则需要主类型和子类型
    return (
      preferences.growType !== null && 
      (preferences.growType === 'both' || preferences.subType !== null) &&
      (preferences.cycleType === 'annual' || 
       (preferences.cycleType === 'perennial' && preferences.winterType !== null))
    );
  };
  
  // 观赏植物选项
  const ornamentalOptions: SubOption[] = [
    { id: 'foliage', icon: 'ri-plant-line', title: 'Foliage Plants' },
    { id: 'flowering', icon: 'ri-sun-line', title: 'Flowering Plants' }
  ];
  
  // 食用植物选项
  const edibleOptions: SubOption[] = [
    { id: 'herbs', icon: 'ri-leaf-line', title: 'Herbs' },
    { id: 'vegetables', icon: 'ri-plant-line', title: 'Vegetables' },
    { id: 'fruits', icon: 'ri-apple-line', title: 'Berries & Fruits' }
  ];
  
  // 多年生植物选项
  const perennialOptions: SubOption[] = [
    { id: 'indoors', icon: 'ri-home-4-line', title: 'Winter indoors' },
    { id: 'outdoors', icon: 'ri-snowy-line', title: 'Winters outdoors' }
  ];
  
  return {
    preferences,
    setGrowType,
    setSubType,
    setCycleType,
    setWinterType,
    isComplete: isComplete(),
    ornamentalOptions,
    edibleOptions,
    perennialOptions
  };
} 