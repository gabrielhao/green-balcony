import { useState, useEffect } from 'react';
import { LocationData } from '@/context/app-context';

interface UseLocationReturn {
  getCurrentLocation: () => Promise<LocationData>;
  setManualLocation: (location: string) => Promise<LocationData>;
  setSunExposure: (exposure: 'full' | 'partial' | 'shade') => LocationData;
  isLoading: boolean;
  error: string | null;
  locationData: LocationData;
}

export function useLocation(): UseLocationReturn {
  const [locationData, setLocationData] = useState<LocationData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 获取当前位置
  const getCurrentLocation = async (): Promise<LocationData> => {
    setIsLoading(true);
    setError(null);

    try {
      // 检查浏览器是否支持地理位置API
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
              // 使用反向地理编码获取地址（实际应用中可能使用Google Maps API或其他服务）
              // 这里我们使用一个模拟的地址
              const address = await getAddressFromCoordinates(latitude, longitude);
              
              const newLocationData = {
                latitude,
                longitude,
                address
              };
              
              setLocationData(newLocationData);
              setIsLoading(false);
              resolve(newLocationData);
            } catch (err) {
              setError('Failed to get address: ' + (err as Error).message);
              setIsLoading(false);
              reject(err);
            }
          },
          (err) => {
            setError('Failed to get location: ' + err.message);
            setIsLoading(false);
            reject(err);
          }
        );
      });
    } catch (err) {
      setError('Location error: ' + (err as Error).message);
      setIsLoading(false);
      throw err;
    }
  };

  // 设置手动位置
  const setManualLocation = async (location: string): Promise<LocationData> => {
    setIsLoading(true);
    setError(null);

    try {
      // 在实际应用中，这里会调用地理编码API将地址转换为坐标
      // 这里我们使用模拟数据
      const coordinates = await getCoordinatesFromAddress(location);
      
      const newLocationData = {
        ...coordinates,
        manualLocation: location
      };
      
      setLocationData(newLocationData);
      setIsLoading(false);
      return newLocationData;
    } catch (err) {
      setError('Failed to set manual location: ' + (err as Error).message);
      setIsLoading(false);
      throw err;
    }
  };

  // 设置阳光照射情况
  const setSunExposure = (exposure: 'full' | 'partial' | 'shade'): LocationData => {
    const newLocationData = {
      ...locationData,
      sunExposure: exposure
    };
    
    setLocationData(newLocationData);
    return newLocationData;
  };

  // 模拟API - 从坐标获取地址
  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 返回模拟地址
    return "假设的地址基于坐标";
  };

  // 模拟API - 从地址获取坐标
  const getCoordinatesFromAddress = async (address: string): Promise<{latitude: number, longitude: number}> => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 返回模拟坐标
    return {
      latitude: 40.7128,
      longitude: -74.0060
    };
  };

  return {
    getCurrentLocation,
    setManualLocation,
    setSunExposure,
    isLoading,
    error,
    locationData
  };
} 