import React from 'react';
import Button from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-between mt-4">
      <Button
        variant="tonal"
        aria-label="Página anterior"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        icon={ChevronLeft}
      >
        Anterior
      </Button>
      <span className="text-sm text-slate-500">
        Página {currentPage} de {totalPages}
      </span>
      <Button
        variant="tonal"
        aria-label="Página siguiente"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default Pagination;