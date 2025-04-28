"use client";

import { ReactNode, useRef, useState, useEffect } from 'react';

interface SlidingPanelProps {
  children: ReactNode;
  initialHeight: number; // 初始高度百分比
  maxHeight: number; // 最大高度百分比
  minHeight?: number; // 最小高度百分比
  title?: string; // 面板标题，显示在面板上方
  className?: string;
}

export function SlidingPanel({
  children,
  initialHeight = 45,
  maxHeight = 90,
  minHeight = 45,
  title,
  className = ''
}: SlidingPanelProps) {
  const [height, setHeight] = useState(initialHeight);
  const panelRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(initialHeight);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!panelRef.current) return;
      isDraggingRef.current = true;
      startYRef.current = e.touches[0].clientY;
      startHeightRef.current = height;
      panelRef.current.style.transition = 'none';
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !panelRef.current) return;
      const deltaY = startYRef.current - e.touches[0].clientY;
      const windowHeight = window.innerHeight;
      const newHeight = Math.min(
        Math.max(startHeightRef.current + (deltaY / windowHeight) * 100, minHeight),
        maxHeight
      );
      setHeight(newHeight);
    };

    const handleTouchEnd = () => {
      if (!panelRef.current) return;
      isDraggingRef.current = false;
      panelRef.current.style.transition = 'height 0.3s ease-out';
      
      // 吸附到最近的位置（最小或最大高度）
      const midPoint = (minHeight + maxHeight) / 2;
      const snapHeight = height > midPoint ? maxHeight : minHeight;
      setHeight(snapHeight);
    };

    // 鼠标事件（用于桌面测试）
    const handleMouseDown = (e: MouseEvent) => {
      if (!panelRef.current) return;
      isDraggingRef.current = true;
      startYRef.current = e.clientY;
      startHeightRef.current = height;
      panelRef.current.style.transition = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !panelRef.current) return;
      const deltaY = startYRef.current - e.clientY;
      const windowHeight = window.innerHeight;
      const newHeight = Math.min(
        Math.max(startHeightRef.current + (deltaY / windowHeight) * 100, minHeight),
        maxHeight
      );
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current || !panelRef.current) return;
      handleTouchEnd();
    };

    const panel = panelRef.current;
    if (panel) {
      panel.addEventListener('touchstart', handleTouchStart);
      panel.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        panel.removeEventListener('touchstart', handleTouchStart);
        panel.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [height, maxHeight, minHeight]);

  return (
    <div
      ref={panelRef}
      className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg overflow-hidden ${className}`}
      style={{ height: `${height}%`, transition: 'height 0.3s ease-out' }}
    >
      {/* 标题 */}
      {title && (
        <div className="px-8 pt-6">
          <h1 className="text-2xl font-bold text-primary mb-4">{title}</h1>
        </div>
      )}
      {/* 内容区域 */}
      <div className="h-full overflow-y-auto scrollbar-hide">
        {children}
      </div>
    </div>
  );
} 