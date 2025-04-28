"use client";

interface AddPhotoButtonProps {
  onAdd: () => void;
  isLoading?: boolean;
}

export function AddPhotoButton({ onAdd, isLoading = false }: AddPhotoButtonProps) {
  return (
    <button 
      onClick={onAdd}
      disabled={isLoading}
      className="aspect-[1/1] rounded-xl border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Add photo"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
      ) : (
        <>
          <i className="ri-add-line text-2xl text-primary"></i>
          <span className="text-primary font-medium">Add Photo</span>
        </>
      )}
    </button>
  );
} 