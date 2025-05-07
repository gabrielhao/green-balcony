import { useState } from 'react';
import { PlantPreferences } from '@/context/app-context';

interface SubOption {
  id: string;
  icon: string;
  title: string;
}

interface UsePreferencesReturn {
  preferences: PlantPreferences;
  setGrowType: (type: 'ornamental' | 'edible' | 'both' | '') => void;
  setSubType: (type: string | '') => void;
  setCycleType: (type: 'perennial' | 'annual' | '') => void;
  setWinterType: (type: 'indoors' | 'outdoors' | '') => void;
  isComplete: boolean;
  ornamentalOptions: SubOption[];
  edibleOptions: SubOption[];
  perennialOptions: SubOption[];
}

export function usePlantPreferences(): UsePreferencesReturn {
  // 初始化偏好状态
  const [preferences, setPreferences] = useState<PlantPreferences>({
    growType: '',
    subType: '',
    cycleType: '',
    winterType: ''
  });
  
  // 设置种植类型
  const setGrowType = (type: 'ornamental' | 'edible' | 'both' | '') => {
    setPreferences(prev => ({
      ...prev,
      growType: type,
      subType: type === 'both' ? 'ornamental and edible' : '' // 如果是both，设置子类型为ornamental and edible
    }));
  };
  
  // 设置子类型
  const setSubType = (type: string | '') => {
    setPreferences(prev => ({
      ...prev,
      subType: type
    }));
  };
  
  // 设置生长周期
  const setCycleType = (type: 'perennial' | 'annual' | '') => {
    setPreferences(prev => ({
      ...prev,
      cycleType: type,
      winterType: '' // 重置冬季类型
    }));
  };
  
  // 设置冬季处理方式
  const setWinterType = (type: 'indoors' | 'outdoors' | '') => {
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
             (preferences.cycleType === 'perennial' && preferences.winterType !== '');
    }
    
    // 否则需要主类型和子类型
    return (
      preferences.growType !== '' && 
      preferences.subType !== '' &&
      (preferences.cycleType === 'annual' || 
       (preferences.cycleType === 'perennial' && preferences.winterType !== ''))
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