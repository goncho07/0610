import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { tokens } from '@/design/tokens';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, className, children, ...props }, ref) => {
  const baseClasses = `w-full pl-4 pr-10 h-11 border border-slate-300 dark:border-[${tokens.color.border}] rounded-[${tokens.radius.md}px] bg-slate-50 dark:bg-[${tokens.color.surface}] text-[${tokens.fontSize.sm}px] text-slate-800 dark:text-[${tokens.color.text}] focus:bg-white dark:focus:bg-[${tokens.color.surface2}] focus:ring-2 focus:ring-[${tokens.color.focus}] focus:border-[${tokens.color.primary}] transition focus:outline-none appearance-none disabled:opacity-50`;
  
  return (
    <div>
      {label && <label htmlFor={props.id} className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          className={`${baseClasses} ${className || ''}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
});

export default Select;