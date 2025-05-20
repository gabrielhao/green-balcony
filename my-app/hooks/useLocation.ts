import { useState, useEffect } from 'react';
import { LocationData } from '@/context/app-context';

interface UseLocationReturn {
  getCurrentLocation: () => Promise<LocationData>;
  setManualLocation: (location: string) => Promise<LocationData>;
  setSunExposure: (exposure: 'full' | 'partial' | 'shade') => LocationData;
  isLoading: boolean;
  error: string | null;
  locationData: LocationData;
  checkLocationPermission: () => Promise<boolean>;
}

export function useLocation(): UseLocationReturn {
  const [locationData, setLocationData] = useState<LocationData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 检查位置权限
  const checkLocationPermission = async (): Promise<boolean> => {
    if (!navigator.permissions || !navigator.permissions.query) {
      // 如果浏览器不支持权限API，我们假设权限已授予
      return true;
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state === 'granted';
    } catch (err) {
      console.warn('Permission check failed:', err);
      return false;
    }
  };

  // 获取当前位置
  const getCurrentLocation = async (): Promise<LocationData> => {
    setIsLoading(true);
    setError(null);

    try {
      // 检查浏览器是否支持地理位置API
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      // 检查是否是iOS设备
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      console.log('Device is iOS:', isIOS);

      return new Promise((resolve, reject) => {
        const options = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        };

        console.log('Requesting location with options:', options);

        // Check permission first
        checkLocationPermission().then(hasPermission => {
          if (!hasPermission) {
            throw new Error("Location permission not granted");
          }

          // 首先尝试获取位置，这会触发权限请求
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              console.log('Location obtained:', position);
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
                
                console.log('Location data processed:', newLocationData);
                setLocationData(newLocationData);
                setIsLoading(false);
                resolve(newLocationData);
              } catch (err) {
                console.error('Error processing location:', err);
                setError('Failed to get address: ' + (err as Error).message);
                setIsLoading(false);
                reject(err);
              }
            },
            (err) => {
              console.error('Geolocation error:', err);
              let errorMessage = '';
              
              // 处理特定的错误情况
              switch (err.code) {
                case err.PERMISSION_DENIED:
                  if (isIOS) {
                    errorMessage = 'Location access denied. Please follow these steps:\n\n' +
                      '1. Open your device Settings\n' +
                      '2. Scroll down and tap Safari\n' +
                      '3. Tap Location\n' +
                      '4. Select "Allow While Using App"\n\n' +
                      'If you have already allowed location access, please try:\n' +
                      '1. Close Safari completely\n' +
                      '2. Reopen Safari\n' +
                      '3. Try again';
                  } else {
                    errorMessage = 'Location access denied. Please enable location access in your browser settings and try again.';
                  }
                  break;
                case err.POSITION_UNAVAILABLE:
                  errorMessage = 'Location information is unavailable. Please ensure your device\'s location services are enabled and try again.';
                  break;
                case err.TIMEOUT:
                  errorMessage = 'Location request timed out. Please check your internet connection and try again.';
                  break;
                default:
                  errorMessage = 'Failed to get location: ' + err.message;
              }
              
              setError(errorMessage);
              setIsLoading(false);
              reject(new Error(errorMessage));
            },
            options
          );
        });
      });
    } catch (err) {
      console.error('Location service error:', err);
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
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
    locationData,
    checkLocationPermission
  };
} 