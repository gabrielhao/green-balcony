"use client";

import { ReactNode } from 'react';

interface DeviceFrameProps {
  children: ReactNode;
  screenLabel?: string;
}

export function DeviceFrame({ children, screenLabel }: DeviceFrameProps) {
  return (
    <div className="relative">
      {screenLabel && (
        <div className="absolute top-[-3rem] left-1/2 transform -translate-x-1/2 bg-[#1a1a1a] text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap">
          {screenLabel}
        </div>
      )}
      <div className="w-[375px] h-[812px] border-[12px] border-[#1a1a1a] rounded-[40px] overflow-hidden relative bg-white flex-shrink-0">
        {children}
      </div>
    </div>
  );
} 