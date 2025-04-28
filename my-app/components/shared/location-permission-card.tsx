"use client";

interface LocationPermissionCardProps {
  onAllow: () => void;
  onManualSet: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function LocationPermissionCard({
  onAllow,
  onManualSet,
  isLoading = false,
  error = null
}: LocationPermissionCardProps) {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-6 text-center space-y-6">
      <div className="w-24 h-24 bg-primary-bg rounded-full flex items-center justify-center mx-auto mb-4">
        <i className="ri-map-pin-line text-4xl text-primary"></i>
      </div>
      
      <h2 className="text-xl font-semibold">Location Access</h2>
      
      <p className="text-gray-600">
        We need your location to analyze sunlight patterns and recommend the best plants for your balcony
      </p>
      
      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}
      
      <div className="space-y-3">
        <button 
          onClick={onAllow}
          disabled={isLoading}
          className={`w-full py-3.5 rounded-full transition-all ${
            isLoading 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {isLoading ? 'Getting location...' : 'Allow Location Access'}
        </button>
        
        <button 
          onClick={onManualSet}
          disabled={isLoading}
          className="w-full border-2 border-gray-200 py-3.5 rounded-full text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Set Location Manually
        </button>
      </div>
    </div>
  );
} 