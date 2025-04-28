"use client";

interface IconButtonProps {
  icon: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'light' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

export function IconButton({
  icon,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
}: IconButtonProps) {
  // 定义不同变体的样式
  const variantStyles = {
    primary: 'bg-[#3B5E43] text-white icon-btn-primary',
    secondary: 'bg-gray-200 text-gray-700 icon-btn-secondary',
    danger: 'bg-red-500 text-white icon-btn-danger',
    light: 'bg-white/90 text-gray-700 icon-btn-light shadow backdrop-blur-sm',
    ghost: 'bg-transparent text-gray-700 icon-btn-ghost',
  };

  // 定义不同尺寸的样式
  const sizeStyles = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-full flex items-center justify-center transition-all duration-300 ${className}`}
      aria-label={ariaLabel}
    >
      <i className={`${icon}`}></i>
    </button>
  );
} 