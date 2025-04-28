"use client";

import { ReactNode } from 'react';
import { PreferenceCard } from './preference-card';

export interface SubOption {
  id: string;
  icon: string;
  title: string;
  description?: string;
}

interface SubOptionsListProps {
  options: SubOption[];
  selectedOption: string | null;
  onSelect: (id: string) => void;
  parentSelected: boolean;
}

export function SubOptionsList({ 
  options, 
  selectedOption, 
  onSelect, 
  parentSelected 
}: SubOptionsListProps) {
  if (!parentSelected) return null;
  
  return (
    <div className={`max-h-[200px] overflow-hidden transition-all duration-300 ease-out ml-4 pl-4 border-l-2 border-gray-200 space-y-2 mt-2 mb-3`}>
      {options.map((option) => (
        <PreferenceCard
          key={option.id}
          icon={option.icon}
          title={option.title}
          description={option.description}
          selected={selectedOption === option.id}
          onSelect={() => onSelect(option.id)}
          isSubOption
        />
      ))}
    </div>
  );
} 