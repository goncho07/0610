import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={`bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md ${className || ''}`} />
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 10, cols = 5 }) => (
    <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-100 dark:border-slate-700 h-[72px]">
                <td className="sticky left-0 bg-inherit px-6 w-12 z-10"><Skeleton className="h-4 w-4 rounded" /></td>
                <td className="sticky left-12 bg-inherit px-6 min-w-64 z-10">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div>
                            <Skeleton className="h-4 w-32 rounded" />
                            <Skeleton className="h-3 w-40 rounded mt-1" />
                        </div>
                    </div>
                </td>
                {Array.from({ length: cols - 1 }).map((_, colIndex) => (
                     <td key={colIndex} className="px-6"><Skeleton className="h-4 w-24 rounded" /></td>
                ))}
            </tr>
        ))}
    </tbody>
);

export default Skeleton;
