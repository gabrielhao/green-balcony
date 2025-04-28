import { useState } from 'react';
import { PhotoData } from '@/context/app-context';

interface UsePhotoUploadReturn {
  photos: PhotoData[];
  uploadPhoto: (file: File) => Promise<PhotoData>;
  takePhoto: () => Promise<PhotoData | null>;
  removePhoto: (id: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function usePhotoUpload(): UsePhotoUploadReturn {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 上传照片
  const uploadPhoto = async (file: File): Promise<PhotoData> => {
    setIsLoading(true);
    setError(null);

    try {
      // 文件类型验证
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // 文件大小验证 (最大10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image size should be less than 10MB');
      }

      // 创建图片预览
      const preview = await createImagePreview(file);
      
      // 模拟上传到服务器的过程
      // 在实际应用中，这里会调用API上传图片到服务器
      const uploadedUrl = await mockUploadToServer(file);
      
      const newPhoto: PhotoData = {
        id: Date.now().toString(),
        url: uploadedUrl,
        preview
      };
      
      setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
      setIsLoading(false);
      
      return newPhoto;
    } catch (err) {
      setError('Upload failed: ' + (err as Error).message);
      setIsLoading(false);
      throw err;
    }
  };

  // 拍照功能
  const takePhoto = async (): Promise<PhotoData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // 检查浏览器是否支持媒体设备API
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser');
      }

      // 模拟拍照过程
      // 在实际应用中，这里会打开相机并拍照
      const photo = await mockTakePhoto();
      
      if (photo) {
        setPhotos(prevPhotos => [...prevPhotos, photo]);
      }
      
      setIsLoading(false);
      return photo;
    } catch (err) {
      setError('Camera error: ' + (err as Error).message);
      setIsLoading(false);
      return null;
    }
  };

  // 删除照片
  const removePhoto = (id: string): void => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
  };

  // 创建图片预览
  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  // 模拟上传到服务器
  const mockUploadToServer = async (file: File): Promise<string> => {
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 返回本地预览URL（在实际应用中这将是服务器URL）
    return URL.createObjectURL(file);
  };

  // 模拟拍照
  const mockTakePhoto = async (): Promise<PhotoData | null> => {
    // 模拟拍照延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 返回模拟照片数据
    return {
      id: Date.now().toString(),
      url: '/assets/sample-balcony-1.jpg',
      preview: '/assets/sample-balcony-1.jpg'
    };
  };

  return {
    photos,
    uploadPhoto,
    takePhoto,
    removePhoto,
    isLoading,
    error
  };
} 