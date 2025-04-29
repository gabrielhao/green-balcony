"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceFrame, ProgressBar, BackButton } from '@/components/layout';
import { PhotoGrid } from '@/components/shared';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';
import { useAppContext, STEPS, PhotoData } from '@/context/app-context';

export default function PhotosPage() {
  const router = useRouter();
  const { photos, uploadPhoto, takePhoto, removePhoto, isLoading, error } = usePhotoUpload();
  const { addPhoto, removePhoto: removeGlobalPhoto, goToStep } = useAppContext();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle back button click
  const handleBack = () => {
    router.push('/location');
  };
  
  // Handle photo deletion
  const handleDelete = (id: string) => {
    removePhoto(id);
    removeGlobalPhoto(id);
  };
  
  // Handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check max photos limit
    if (photos.length >= 3) {
      setUploadError('Maximum 3 photos allowed');
      return;
    }
    
    setUploadError(null);
    
    try {
      const file = files[0];
      const uploadedPhoto = await uploadPhoto(file);
      addPhoto(uploadedPhoto);
    } catch (err) {
      setUploadError((err as Error).message);
      console.error('Upload failed:', err);
    }
    
    // Reset file input for reuse
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle take photo
  const handleTakePhoto = async () => {
    // Check max photos limit
    if (photos.length >= 3) {
      setUploadError('Maximum 3 photos allowed');
      return;
    }
    
    setUploadError(null);
    
    try {
      const photo = await takePhoto();
      if (photo) {
        addPhoto(photo);
      }
    } catch (err) {
      setUploadError((err as Error).message);
      console.error('Camera error:', err);
    }
  };
  
  // Handle continue button click
  const handleContinue = () => {
    if (photos.length === 0) {
      setUploadError('Please add at least one photo');
      return;
    }
    
    goToStep(STEPS.PREFERENCES);
    router.push('/preferences');
  };
  
  // Format photos for PhotoGrid component
  const formattedPhotos = photos.map(photo => ({
    id: photo.id,
    url: photo.url || photo.preview,
    alt: 'Balcony photo'
  }));
  
  // Determine if we have photos
  const hasPhotos = photos.length > 0;
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <DeviceFrame>
        <div className="h-full flex flex-col items-center p-8 bg-white">
          <div className="w-full flex justify-between items-center mb-4">
            <BackButton onClick={handleBack} />
            <ProgressBar currentStep={2} totalSteps={4} />
          </div>
          
          <div className="flex-1 flex flex-col items-start w-full">
            <h2 className="text-3xl font-bold text-primary mb-3">Let's see your balcony!</h2>
            <p className="text-gray-600 text-lg mb-6">Create a planting plan that suits your conditions</p>
            
            {hasPhotos && (
              <div className="photos-count flex items-center gap-2 mb-4 text-primary text-sm">
                <i className="ri-image-line text-lg"></i>
                <span>{formattedPhotos.length} of 3 photos added</span>
              </div>
            )}
            
            {uploadError && (
              <div className="text-red-500 text-sm mb-3 w-full">
                {uploadError}
              </div>
            )}
            
            {hasPhotos ? (
              // State 2: Show photo grid when we have photos
              <>
                <PhotoGrid
                  photos={formattedPhotos}
                  onEdit={handleFileInputClick}
                  onDelete={handleDelete}
                  onAdd={handleFileInputClick}
                  isLoading={isLoading}
                  maxPhotos={3}
                />
                
                <button
                  onClick={handleContinue}
                  disabled={isLoading}
                  className="w-full py-4 rounded-full bg-primary text-white font-semibold flex items-center justify-center gap-2 mt-auto hover:bg-primary-dark transition-colors"
                >
                  {isLoading ? 'Processing...' : (
                    <>
                      <i className="ri-arrow-right-line text-xl"></i>
                      Continue
                    </>
                  )}
                </button>
              </>
            ) : (
              // State 1: Show upload options when no photos
              <div className="w-full flex-1 flex flex-col gap-4 justify-center">
                <button
                  onClick={handleFileInputClick}
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-full bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
                >
                  <i className="ri-upload-2-line text-xl"></i>
                  Upload Photo
                </button>
                
                <button
                  onClick={handleTakePhoto}
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-full bg-gray-100 text-primary font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <i className="ri-camera-line text-xl"></i>
                  Take Photo
                </button>
              </div>
            )}
            
            {/* Hidden file input */}
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </DeviceFrame>
    </main>
  );
} 