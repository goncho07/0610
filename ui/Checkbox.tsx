import React, { InputHTMLAttributes } from 'react';
import { tokens } from '@/design/tokens';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  'aria-label': string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, className, ...props }) => {
  const baseClasses = `h-4 w-4 rounded border-slate-300 dark:border-[${tokens.color.border}] text-[${tokens.color.primary}] bg-slate-100 dark:bg-[${tokens.color.surface}] focus:ring-[${tokens.color.primary}] focus:ring-offset-slate-50 dark:focus:ring-offset-[${tokens.color.bg}]`;

  if (label) {
    return (
      <label className="flex items-center gap-2">
        <input type="checkbox" className={`${baseClasses} ${className || ''}`} {...props} />
        <span className="text-sm text-slate-700 dark:text-slate-200">{label}</span>
      </label>
    );
  }
  
  return (
    <input
      type="checkbox"
      className={`${baseClasses} ${className || ''}`}
      {...props}
    />
  );
};

export default Checkbox;