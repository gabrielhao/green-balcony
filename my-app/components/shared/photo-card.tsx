"use client";

interface PhotoCardProps {
  image: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function PhotoCard({ image, onEdit, onDelete }: PhotoCardProps) {
  return (
    <div className="relative aspect-[1/1] rounded-xl overflow-hidden bg-primary-bg">
      <img 
        src={image} 
        alt="Balcony photo" 
        className="w-full h-full object-cover"
      />
      
      <div className="absolute right-2 bottom-2 flex gap-1">
        <button 
          onClick={onEdit}
          className="w-8 h-8 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-sm"
          aria-label="Edit photo"
        >
          <i className="ri-pencil-line text-lg" />
        </button>
        <button 
          onClick={onDelete}
          className="w-8 h-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center shadow-sm"
          aria-label="Delete photo"
        >
          <i className="ri-delete-bin-line text-lg" />
        </button>
      </div>
    </div>
  );
} 