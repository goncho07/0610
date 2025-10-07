
import React from 'react';
import { motion } from 'framer-motion';
import { tokens } from '../design/tokens';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <motion.div
      whileHover={onClick ? { y: -4, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={`bg-white dark:bg-[${tokens.color.surface}] rounded-[${tokens.radius.lg}px] shadow-sm hover:shadow-lg dark:hover:bg-[${tokens.color.surface2}] border border-slate-200/80 dark:border-[${tokens.color.border}] p-[${tokens.spacing.x6}px] ${className || ''} ${onClick ? 'cursor-pointer' : ''} transition-shadow duration-200`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;