"use client";

import { useState, useEffect } from 'react';

interface LoadingAnimationProps {
  tips?: string[];
  className?: string;
}

export function LoadingAnimation({ tips = [], className = '' }: LoadingAnimationProps) {
  const [currentTip, setCurrentTip] = useState(0);
  const [tipOpacity, setTipOpacity] = useState(1);

  // 在组件挂载时设置提示轮换
  useEffect(() => {
    if (tips.length === 0) return;

    const tipInterval = setInterval(() => {
      // 淡出当前提示
      setTipOpacity(0);

      // 等待淡出动画完成后更改提示并淡入
      setTimeout(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
        setTipOpacity(1);
      }, 800);
    }, 6000);

    return () => clearInterval(tipInterval);
  }, [tips.length]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-full max-w-[240px] mx-auto" id="loading-animation">
        <svg className="plant-animation w-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 花盆 */}
          <path className="pot" d="M60 160 L140 160 L130 200 L70 200 Z" fill="#8B5E3C"/>
          
          {/* 茎 */}
          <path className="stem" d="M100 160 Q100 120 100 80" stroke="#3B5E43" strokeWidth="4" strokeLinecap="round"/>
          
          {/* 叶子 */}
          <path className="leaf leaf-1" d="M100 140 Q120 130 110 110" stroke="#3B5E43" strokeWidth="4" strokeLinecap="round"/>
          <path className="leaf leaf-2" d="M100 120 Q80 110 90 90" stroke="#3B5E43" strokeWidth="4" strokeLinecap="round"/>
          <path className="leaf leaf-3" d="M100 100 Q120 90 110 70" stroke="#3B5E43" strokeWidth="4" strokeLinecap="round"/>
          
          {/* 花 */}
          <circle className="flower" cx="100" cy="60" r="8" fill="#FF69B4"/>
        </svg>
      </div>

      {tips.length > 0 && (
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-primary mb-3">Creating your garden plan...</h3>
          <p 
            className="tip-text text-gray-600 text-lg transition-opacity duration-500"
            style={{ opacity: tipOpacity }}
          >
            {tips[currentTip]}
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes stemGrow {
          0% {
            stroke-dashoffset: 100;
            opacity: 0;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        @keyframes leafGrow {
          0% {
            stroke-dashoffset: 50;
            opacity: 0;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        @keyframes flowerBloom {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          70% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes plantReset {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes potRock {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-2deg);
          }
          75% {
            transform: rotate(2deg);
          }
        }

        :global(.plant-animation .stem) {
          stroke-dasharray: 100;
          animation: stemGrow 3s ease-out infinite;
          animation-fill-mode: both;
        }

        :global(.plant-animation .leaf) {
          stroke-dasharray: 50;
          opacity: 0;
        }

        :global(.plant-animation .leaf-1) {
          animation: leafGrow 2s ease-out infinite;
          animation-delay: 0.5s;
        }

        :global(.plant-animation .leaf-2) {
          animation: leafGrow 2s ease-out infinite;
          animation-delay: 1s;
        }

        :global(.plant-animation .leaf-3) {
          animation: leafGrow 2s ease-out infinite;
          animation-delay: 1.5s;
        }

        :global(.plant-animation .flower) {
          transform-origin: center;
          animation: flowerBloom 2s ease-out infinite;
          animation-delay: 2s;
        }

        :global(.plant-animation .pot) {
          transform-origin: bottom center;
          animation: potRock 2s ease-in-out infinite;
        }

        :global(#loading-animation) {
          animation: plantReset 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 