import React, { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import Input from './Input';

const SearchBar: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isCommandMenuOpen, setCommandMenuOpen } = useUIStore();
  
  useEffect(() => {
    if (isCommandMenuOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      setCommandMenuOpen(false); // Reset state after focusing
    }
  }, [isCommandMenuOpen, setCommandMenuOpen]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      <Input
        ref={inputRef}
        type="text"
        aria-label="Buscar por nombre, DNI o rol"
        placeholder="Buscar por nombre, DNI o rol… (Ctrl/Cmd+K)"
        className="!pl-11"
      />
    </div>
  );
};

export default SearchBar;