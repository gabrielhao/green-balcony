"use client";

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function ActionButton({ 
  onClick, 
  children, 
  variant = 'primary',
  className = ''
}: ActionButtonProps) {
  const baseStyles = "font-semibold py-4 px-12 rounded-full transition duration-300 ease-in-out transform hover:scale-105";
  const variantStyles = {
    primary: "bg-primary hover:bg-primary-dark text-white",
    secondary: "border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
} 