import React from 'react';

interface TagProps {
  children: React.ReactNode;
}

const Tag: React.FC<TagProps> = ({ children }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 capitalize">
      {children}
    </span>
  );
};

export default Tag;
