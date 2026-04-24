'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface InputProps {
  type?: 'text' | 'password' | 'email';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function Input({ type = 'text', placeholder, value, onChange, className }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative w-full">
      <input
        type={resolvedType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full border border-secondary text-secondary px-3 py-2 rounded-[6px] outline-none focus:ring-1 focus:ring-secondary placeholder:text-secondary/50 ${type === 'password' ? 'pr-10' : ''} ${className ?? ''}`.trim()}
      />
      {type === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
}
