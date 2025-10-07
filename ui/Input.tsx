import React, { InputHTMLAttributes, forwardRef } from 'react';
import { tokens } from '@/design/tokens';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  'aria-label': string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, className, ...props }, ref) => {
  const baseClasses = `w-full px-4 h-11 border border-slate-300 dark:border-[${tokens.color.border}] rounded-[${tokens.radius.md}px] bg-slate-50 dark:bg-[${tokens.color.surface}] text-[${tokens.fontSize.sm}px] text-slate-800 dark:text-[${tokens.color.text}] focus:bg-white dark:focus:bg-[${tokens.color.surface2}] focus:ring-2 focus:ring-[${tokens.color.focus}] focus:border-[${tokens.color.primary}] transition focus:outline-none disabled:opacity-50`;
  
  return (
    <div>
      {label && <label htmlFor={props.id} className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">{label}</label>}
      <input
        ref={ref}
        className={`${baseClasses} ${className || ''}`}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';
export default Input;