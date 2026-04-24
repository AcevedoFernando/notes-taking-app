import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({ children, icon, type = 'button', onClick, disabled, className }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-outline font-bold font-Inter gap-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed ${className ?? ''}`.trim()}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
}
