
import React from 'react';
import SearchBar from './SearchBar';
import Chip from './Chip';
import Button from './Button';

interface Filter {
  id: string;
  label: string;
}

interface FilterBarProps {
  activeFilters: Filter[];
  onRemoveFilter: (id: string) => void;
  onClearAll: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ activeFilters, onRemoveFilter, onClearAll }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700/80">
      <SearchBar />
      {activeFilters.length > 0 && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Filtros Activos:</h4>
          {activeFilters.map(filter => (
            <Chip key={filter.id} onRemove={() => onRemoveFilter(filter.id)}>
              {filter.label}
            </Chip>
          ))}
          <Button variant="text" onClick={onClearAll} aria-label="Quitar todos los filtros">Quitar filtros</Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
