import { useState } from 'react';
import { PhotoData } from '@/context/app-context';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';

interface UsePhotoUploadReturn {
  photos: PhotoData[];
  uploadPhoto: (file: File) => Promise<PhotoData>;
  takePhoto: () => Promise<PhotoData | null>;
  removeCloudPhoto: (id: string, url: string) => Promise<void>;
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
      const uploadedName = await uploadToAzureBlob(file);
      const uploadedUrl = `${process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_URL}images/${uploadedName}?${process.env.NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN}`;
      // Debug information
      console.log('Uploaded image name:', uploadedName);
      
      const newPhoto: PhotoData = {
        id: Date.now().toString(),
        name: uploadedName,
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
      // Create a hidden input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use rear camera
      input.style.display = 'none';
      document.body.appendChild(input);

      // Create a promise to handle the photo capture
      const photo = await new Promise<PhotoData>((resolve, reject) => {
        // Handle file selection
        input.onchange = async (event) => {
          try {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) {
              reject(new Error('No file selected'));
              return;
            }

            console.log('File selected:', {
              name: file.name,
              type: file.type,
              size: file.size
            });

            // Create a new File object with proper type and name
            const newFile = new File([file], `photo-${Date.now()}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });

            console.log('New file created:', {
              name: newFile.name,
              type: newFile.type,
              size: newFile.size
            });

            // Create a preview URL for the image
            const preview = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.readAsDataURL(newFile);
            });

            console.log('Preview created, length:', preview.length);

            // Use existing uploadPhoto function to upload
            const photo = await uploadPhoto(newFile);
            console.log('Photo uploaded successfully:', photo);
            resolve(photo);
          } catch (error) {
            console.error('Error in photo capture process:', error);
            reject(error);
          } finally {
            // Clean up the input element
            if (document.body.contains(input)) {
              document.body.removeChild(input);
            }
          }
        };

        // Handle cancellation
        const handleCancel = () => {
          console.log('Camera closed by user');
          reject(new Error('Camera closed by user'));
          if (document.body.contains(input)) {
            document.body.removeChild(input);
          }
        };

        // Add event listeners for cancellation
        input.oncancel = handleCancel;
        window.addEventListener('focus', handleCancel, { once: true });

        // Trigger the file input click
        input.click();
      });

      setIsLoading(false);
      return photo;

    } catch (err) {
      console.error('Error in takePhoto:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError('Camera error: ' + errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  // 删除照片
  const removeCloudPhoto = async (id: string, name: string): Promise<void> => {
    // input checkt
    if (!id || !name) {
      throw new Error('Invalid input for remove cloud photo, id: ' + id + ', name: ' + name);
    }

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

      // Extract the blob name from the URL
      const blobName = name;
      if (!blobName) {
        throw new Error('Invalid blob name');
      }

      // Create a BlobServiceClient
      const blobServiceClient = new BlobServiceClient(`${storageAccountUrl}?${sasToken}`);

      // Get a reference to the container
      const containerClient = blobServiceClient.getContainerClient("images");

      // Get a block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Delete the blob
      await blockBlobClient.delete();
      console.log(`Blob ${blobName} deleted successfully.`);

      // Remove the photo from the local state
      setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
    } catch (error) {
      console.error("Error deleting photo:", error instanceof Error ? error.message : 'Unknown error');
      throw new Error('Failed to delete photo from Azure Blob Storage');
    }
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

      // Validate the storage account URL format
      if (!storageAccountUrl.startsWith('https://')) {
        throw new Error('Invalid storage account URL format');
      }

      // Remove any trailing slashes from the URL
      const cleanStorageUrl = storageAccountUrl.replace(/\/$/, '');
      const fullUrl = `${cleanStorageUrl}?${sasToken}`;

      console.log('Attempting to connect to Azure Blob Storage:', {
        url: cleanStorageUrl,
        fileType: file.type,
        fileSize: file.size
      });

      // Create a BlobServiceClient with retry options
      const blobServiceClient = new BlobServiceClient(fullUrl);

      // Get a reference to the container
      const containerClient = blobServiceClient.getContainerClient("images");

      // Verify container exists
      const containerExists = await containerClient.exists();
      if (!containerExists) {
        throw new Error('Container "images" does not exist in the storage account');
      }

      // Create a unique name for the blob
      const timestamp = Date.now();
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const blobName = `${timestamp}-${safeFileName}`;

      console.log('Starting upload for blob:', blobName);

      // Get a block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload the file to the container with options
      const uploadBlobResponse = await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: { 
          blobContentType: file.type,
          blobCacheControl: 'max-age=31536000'
        },
        onProgress: (ev) => {
          console.log(`Upload progress: ${ev.loadedBytes} bytes`);
        }
      });

      if (!uploadBlobResponse.requestId) {
        throw new Error('Upload failed: No request ID received');
      }

      console.log('Upload successful:', {
        requestId: uploadBlobResponse.requestId,
        clientRequestId: uploadBlobResponse.clientRequestId,
        version: uploadBlobResponse.version
      });

      return blockBlobClient.name;
    } catch (error) {
      // Log the full error details
      console.error('Error uploading file:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown error type'
      });

      // Check for specific error types
      if (error instanceof Error) {
        if (error.message.includes('Load failed')) {
          throw new Error('Network error: Unable to connect to Azure Storage. Please check your internet connection and try again.');
        }
        if (error.message.includes('403')) {
          throw new Error('Access denied: Invalid or expired SAS token');
        }
        if (error.message.includes('404')) {
          throw new Error('Storage account or container not found');
        }
      }

      throw new Error('Failed to upload file to Azure Blob Storage: ' + 
        (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return {
    photos,
    uploadPhoto,
    takePhoto,
    removeCloudPhoto,
    isLoading,
    error
  };
}