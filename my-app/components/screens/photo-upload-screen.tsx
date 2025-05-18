"use client";

import { useState } from 'react';
import { BackButton, ProgressBar } from "@/components/layout";
import { PhotoGrid } from "@/components/shared/photo-grid";
import { ActionButton } from "@/components/shared/action-button";
import { UploadService } from '@/lib/services/upload-service';
import { toast, Toaster } from 'react-hot-toast';

interface Photo {
  id: string;
  url: string;
  name: string;
  uploading?: boolean;
}

interface PhotoUploadScreenProps {
  onBack: () => void;
  onContinue: () => void;
  currentStep: number;
  totalSteps: number;
  photos: Photo[];
  onAddPhoto: (file: File) => void | Promise<void>;
  onEditPhoto: (id: string, file: File) => void | Promise<void>;
  onDeletePhoto: (id: string) => void;
}

export function PhotoUploadScreen({
  onBack,
  onContinue,
  currentStep,
  totalSteps,
  photos,
  onAddPhoto,
  onEditPhoto,
  onDeletePhoto,
}: PhotoUploadScreenProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    await onAddPhoto(file);
    setIsUploading(false);
  };

  const handleEditFileChange = async (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    await onEditPhoto(id, file);
    setIsUploading(false);
  };

  return (
    <div className="h-full flex flex-col p-8 bg-white">
      <Toaster position="top-center" />
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4">
        <BackButton onClick={onBack} />
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-start w-full">
        <h2 className="text-3xl font-bold text-primary mb-3">
          Let's see your balcony!
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          Create a planting plan that suits your conditions
        </p>
        
        <input
          type="file"
          accept="image/*"
          id="photo-upload"
          data-testid="photo-upload"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        <PhotoGrid
          photos={photos.map(photo => ({
            ...photo,
            name: photo.name || photo.url.split('/').pop() || 'photo'
          }))}
          onAdd={() => document.getElementById('photo-upload')?.click()}
          onEdit={(id) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
              const event = e as unknown as React.ChangeEvent<HTMLInputElement>;
              handleEditFileChange(id, event);
            };
            input.click();
          }}
          onDelete={onDeletePhoto}
        />

        <ActionButton 
          onClick={onContinue}
          className="w-full mt-auto"
        >
          <div className="flex items-center justify-center gap-2">
            {isUploading ? (
              <>
                <i className="ri-loader-4-line animate-spin text-2xl" />
                上传中...
              </>
            ) : (
              <>
                <i className="ri-arrow-right-line text-2xl" />
                Continue
              </>
            )}
          </div>
        </ActionButton>
      </div>
    </div>
  );
} 