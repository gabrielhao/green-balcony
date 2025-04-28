"use client";

import { ReactNode } from 'react';

interface PreferenceCardProps {
  icon: string;
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  className?: string;
  isSubOption?: boolean;
}

export function PreferenceCard({
  icon,
  title,
  description,
  selected,
  onSelect,
  className = '',
  isSubOption = false
}: PreferenceCardProps) {
  return (
    <div 
      className={`preference-card p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-200 ${
        selected 
          ? 'bg-[#3B5E43] text-white' 
          : 'bg-gray-100 text-gray-800'
      } ${className}`}
      onClick={onSelect}
    >
      <div className={`icon-container text-2xl ${selected ? 'text-white' : 'text-[#3B5E43]'}`}>
        <i className={icon}></i>
      </div>
      <div className="content">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && !isSubOption && <p className={`text-sm mt-1 ${selected ? 'text-gray-100' : 'text-gray-500'}`}>{description}</p>}
      </div>
    </div>
  );
} 