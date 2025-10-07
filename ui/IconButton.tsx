import React from 'react';
import { HTMLMotionProps } from 'framer-motion';
import { LucideProps } from 'lucide-react';
import Button from './Button';

interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'disabled' | 'children'> {
  icon: React.ComponentType<LucideProps>;
  'aria-label': string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'md' | 'lg';
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  return <Button iconOnly {...props} />;
};

export default IconButton;
