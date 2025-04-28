"use client";

import { PhotoCard } from './photo-card';
import { AddPhotoButton } from './add-photo-button';

interface Photo {
  id: string;
  url: string;
  alt?: string;
}

interface PhotoGridProps {
  photos: Photo[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  maxPhotos?: number;
  isLoading?: boolean;
}

export function PhotoGrid({ 
  photos, 
  onAdd, 
  onEdit, 
  onDelete,
  maxPhotos = 6,
  isLoading = false
}: PhotoGridProps) {
  return (
    <div className="w-full mb-6">
      <div className="grid grid-cols-2 gap-4">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            image={photo.url}
            onEdit={() => onEdit(photo.id)}
            onDelete={() => onDelete(photo.id)}
          />
        ))}
        
        {photos.length < maxPhotos && (
          <AddPhotoButton onAdd={onAdd} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
} 