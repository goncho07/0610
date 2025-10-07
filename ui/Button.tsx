import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { LucideProps } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'disabled' | 'children'> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'danger' | 'warning' | 'text';
  size?: 'md';
  icon?: React.ComponentType<LucideProps>;
  iconOnly?: boolean;
  'aria-label': string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Button = ({ 
  children, 
  variant = 'filled', 
  size = 'md',
  icon: Icon, 
  iconOnly = false,
  className = '', 
  disabled = false,
  ...props 
}: ButtonProps): React.ReactElement => {
  const baseClasses = `inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-4`;

  const sizeClasses = {
    md: `px-6 h-11 text-sm`,
    iconMd: `w-11 h-11`,
  };

  const variantClasses = {
    filled: `bg-indigo-600 text-white shadow-sm hover:shadow-md hover:bg-indigo-500
             dark:bg-indigo-500 dark:hover:bg-indigo-400
             focus-visible:ring-indigo-500/50
             disabled:bg-slate-400/20 disabled:text-slate-500 dark:disabled:bg-slate-500/20 dark:disabled:text-slate-500 disabled:shadow-none`,
    
    tonal: `bg-indigo-100 text-indigo-700
            dark:bg-indigo-500/20 dark:text-indigo-300
            hover:bg-indigo-200 dark:hover:bg-indigo-500/30
            focus-visible:ring-indigo-500/50
            disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-700/50 dark:disabled:text-slate-500`,
            
    outlined: `bg-transparent border border-slate-300 text-slate-700
               dark:border-slate-600 dark:text-slate-200
               hover:bg-slate-100 dark:hover:bg-slate-800
               focus-visible:ring-indigo-500/50
               disabled:border-slate-200 disabled:text-slate-400 dark:disabled:border-slate-700 dark:disabled:text-slate-500`,

    danger: `bg-rose-600 text-white shadow-sm hover:shadow-md hover:bg-rose-500
             dark:bg-rose-600 dark:hover:bg-rose-500
             focus-visible:ring-rose-500/50
             disabled:bg-slate-400/20 disabled:text-slate-500 dark:disabled:bg-slate-500/20 dark:disabled:text-slate-500 disabled:shadow-none`,
    
    warning: `bg-amber-500 text-white shadow-sm hover:shadow-md hover:bg-amber-400
             dark:bg-amber-500 dark:hover:bg-amber-400
             focus-visible:ring-amber-500/50
             disabled:bg-slate-400/20 disabled:text-slate-500 dark:disabled:bg-slate-500/20 dark:disabled:text-slate-500 disabled:shadow-none`,

    text: `bg-transparent text-slate-600 dark:text-slate-300
           hover:bg-slate-100 dark:hover:bg-slate-700
           disabled:text-slate-400 dark:disabled:text-slate-500`,
  };
  
  const currentSizeClass = iconOnly ? sizeClasses.iconMd : sizeClasses.md;

  return (
    <motion.button
      whileHover={!disabled ? { y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${currentSizeClass} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={20} />}
      {!iconOnly && children}
    </motion.button>
  );
};

export default Button;