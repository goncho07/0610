
import React from 'react';
import { ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Checkbox from './Checkbox';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  selectable: boolean;
  selectedRowIds: Set<string | number>;
  onSelect: (id: string | number) => void;
  onSelectAll: (isSelected: boolean) => void;
  getRowId: (row: T) => string | number;
}

const Table = <T extends {}>({
  columns,
  rows,
  onSort,
  sortConfig,
  selectable,
  selectedRowIds,
  onSelect,
  onSelectAll,
  getRowId,
}: TableProps<T>) => {
  const isAllSelected = rows.length > 0 && selectedRowIds.size > 0 && rows.every(row => selectedRowIds.has(getRowId(row)));

  return (
    <div className="overflow-auto max-h-[calc(100vh-450px)] bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700/80">
      <table className="w-full">
        <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm">
          <tr className="border-b-2 border-slate-200 dark:border-slate-700">
            {selectable && (
              <th className="sticky left-0 bg-slate-50 dark:bg-slate-800/80 px-6 w-12 z-20">
                <Checkbox
                  aria-label="Seleccionar todas las filas"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
            )}
            {columns.map((col) => (
              <th key={String(col.key)} className={`px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap text-left ${col.className}`}>
                {col.sortable ? (
                  <button onClick={() => onSort(col.key)} className="flex items-center gap-1 group w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
                    {col.header}
                    <div className="opacity-30 group-hover:opacity-100 transition-opacity">
                      {sortConfig?.key === col.key ? (sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ChevronsUpDown size={14} />}
                    </div>
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = getRowId(row);
            const isSelected = selectedRowIds.has(id);
            return (
              <tr 
                key={id}
                aria-selected={isSelected}
                className={`border-b border-slate-100 dark:border-slate-700 transition-colors text-sm h-[72px] ${isSelected ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                {selectable && (
                  <td className="sticky left-0 bg-inherit px-6 w-12 z-10">
                    <Checkbox aria-label={`Seleccionar fila`} checked={isSelected} onChange={() => onSelect(id)} />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={`${String(id)}-${String(col.key)}`} className={`px-6 ${col.className}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;