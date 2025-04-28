import { createContext, useContext, useState, ReactNode } from 'react';

// 定义位置数据类型
export interface LocationData {
  latitude?: number;
  longitude?: number;
  address?: string;
  manualLocation?: string;
  sunExposure?: 'full' | 'partial' | 'shade';
}

// 定义照片数据类型
export interface PhotoData {
  id: string;
  url: string;
  preview: string;
}

// 定义植物偏好类型
export interface PlantPreferences {
  growType: 'ornamental' | 'edible' | 'both' | null;
  subType: string | null;
  cycleType: 'perennial' | 'annual' | null;
  winterType: 'indoors' | 'outdoors' | null;
}

// 定义推荐植物类型
export interface PlantResult {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
}

// 定义应用状态类型
interface AppState {
  currentStep: number;
  location: LocationData;
  photos: PhotoData[];
  preferences: PlantPreferences;
  results: PlantResult[];
  setLocation: (data: LocationData) => void;
  addPhoto: (photo: PhotoData) => void;
  removePhoto: (id: string) => void;
  clearPhotos: () => void;
  setPreferences: (prefs: PlantPreferences) => void;
  setResults: (results: PlantResult[]) => void;
  goToStep: (step: number) => void;
}

// 创建Context
const AppContext = createContext<AppState | undefined>(undefined);

// 步骤常量
export const STEPS = {
  WELCOME: 0,
  LOCATION: 1,
  PHOTOS: 2,
  PREFERENCES: 3,
  RESULTS: 4
};

// Provider组件
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [location, setLocationState] = useState<LocationData>({});
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [preferences, setPreferencesState] = useState<PlantPreferences>({
    growType: null,
    subType: null,
    cycleType: null,
    winterType: null
  });
  const [results, setResultsState] = useState<PlantResult[]>([]);

  // 设置位置数据
  const setLocation = (data: LocationData) => {
    setLocationState(prevState => ({ ...prevState, ...data }));
  };

  // 添加照片
  const addPhoto = (photo: PhotoData) => {
    setPhotos(prevPhotos => [...prevPhotos, photo]);
  };

  // 移除照片
  const removePhoto = (id: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
  };

  // 清除所有照片
  const clearPhotos = () => {
    setPhotos([]);
  };

  // 设置偏好
  const setPreferences = (prefs: PlantPreferences) => {
    setPreferencesState(prefs);
  };

  // 设置结果
  const setResults = (newResults: PlantResult[]) => {
    setResultsState(newResults);
  };

  // 设置当前步骤
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <AppContext.Provider
      value={{
        currentStep,
        location,
        photos,
        preferences,
        results,
        setLocation,
        addPhoto,
        removePhoto,
        clearPhotos,
        setPreferences,
        setResults,
        goToStep
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// 自定义Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 