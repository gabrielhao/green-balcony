"use client";

interface Action {
  icon: string;
  label: string;
  onClick: () => void;
}

interface ActionButtonGroupProps {
  primaryAction: Action;
  secondaryAction: Action;
  className?: string;
}

export function ActionButtonGroup({
  primaryAction,
  secondaryAction,
  className = ''
}: ActionButtonGroupProps) {
  return (
    <div className={`absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 ${className}`}>
      <div className="flex gap-4 max-w-md mx-auto">
        <button
          onClick={primaryAction.onClick}
          className="flex-1 bg-[#3B5E43] text-white font-medium py-3.5 rounded-full flex items-center justify-center gap-2 transition-all duration-300"
        >
          <i className={`${primaryAction.icon} text-xl`}></i>
          <span>{primaryAction.label}</span>
        </button>
        <button
          onClick={secondaryAction.onClick}
          className="flex-1 bg-[#3B5E43] text-white font-medium py-3.5 rounded-full flex items-center justify-center gap-2 transition-all duration-300"
        >
          <i className={`${secondaryAction.icon} text-xl`}></i>
          <span>{secondaryAction.label}</span>
        </button>
      </div>
    </div>
  );
} 