import { useState } from 'react';
import { PhotoData } from '@/context/app-context';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';

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
      
      // 上传到Azure Blob Storage
      const uploadedUrl = await uploadToAzureBlob(file);
      
      // Debug information
      console.log('Uploaded image URL:', uploadedUrl);
      
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

  /**
 * Uploads a file to Azure Blob Storage container "images"
 * @param file - The File object to be uploaded
 * @returns The URL of the uploaded blob
 * @throws Error if upload fails
 */
  const uploadToAzureBlob = async (file: File): Promise<string> => {
    try {
      // Get SAS token from environment variables
      const sasToken = process.env.NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN;
      if (!sasToken) {
        throw new Error('Azure Storage SAS token is not configured');
      }

      // Define the Storage Account URL
      const storageAccountUrl = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_URL;
      if (!storageAccountUrl) {
        throw new Error('Azure Storage Account URL is not configured');
      }

      // Create a BlobServiceClient
      const blobServiceClient = new BlobServiceClient(`${storageAccountUrl}?${sasToken}`);

      // Get a reference to the container
      const containerClient = blobServiceClient.getContainerClient("images");

      // Create a unique name for the blob
      const blobName = `${Date.now()}-${file.name}`;

      // Get a block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload the file to the container
      const uploadBlobResponse = await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: { blobContentType: file.type }
      });

      console.log(`File uploaded successfully. Request ID: ${uploadBlobResponse.requestId}`);

      // Return the file URL
      return blockBlobClient.url;
    } catch (error) {
      console.error("Error uploading file:", error instanceof Error ? error.message : 'Unknown error');
      throw new Error('Failed to upload file to Azure Blob Storage');
    }
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