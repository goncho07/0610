import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, AlertTriangle } from 'lucide-react';
import { GenericUser, Student, SearchTag } from '@/types';
import AutocompleteSuggestions from './AutocompleteSuggestions';

const isStudent = (user: GenericUser): user is Student => 'studentCode' in user;
const getFullName = (user: GenericUser): string => isStudent(user) ? user.fullName : user.name;

interface UserListHeaderProps {
    tags: SearchTag[];
    allUsers: GenericUser[];
    onAddTag: (value: string) => void;
    onRemoveTag: (value: string) => void;
}

const UserListHeader: React.FC<UserListHeaderProps> = ({ tags, allUsers, onAddTag, onRemoveTag }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<GenericUser[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

    const resetSearch = useCallback(() => {
        setInputValue('');
        setSuggestions([]);
        setActiveSuggestionIndex(-1);
    }, []);

    const handleAddTagAndReset = useCallback((tagValue: string) => {
        if (tagValue.trim()) {
            onAddTag(tagValue.trim());
        }
        resetSearch();
    }, [onAddTag, resetSearch]);

    useEffect(() => {
        if (inputValue.length > 1) {
            const gradeRegex = /^\d{1,2}\s?[A-F]$/i;
            if (gradeRegex.test(inputValue)) {
                setSuggestions([]);
                return;
            }

            const filteredSuggestions = allUsers.filter(user =>
                getFullName(user).toLowerCase().includes(inputValue.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [inputValue, allUsers]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === 'Tab') && inputValue.trim()) {
            e.preventDefault();
            if (activeSuggestionIndex > -1 && suggestions[activeSuggestionIndex]) {
                handleAddTagAndReset(getFullName(suggestions[activeSuggestionIndex]));
            } else {
                handleAddTagAndReset(inputValue);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Escape') {
            resetSearch();
        }
    };

    const isPlaceholderVisible = tags.length === 0 && !inputValue;

    return (
        <div className="relative">
             <div 
                className="relative flex items-center w-full px-4 text-base border border-slate-200 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 dark:text-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition min-h-[52px]"
            >
                <Search className="text-slate-400 pointer-events-none" size={24} />
                
                <div className="relative flex-1 flex items-center flex-wrap gap-2 ml-3">
                    <AnimatePresence>
                        {isPlaceholderVisible && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                aria-hidden="true"
                                className="absolute inset-y-0 left-0 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none"
                            >
                                <span className="text-lg font-bold">Buscar (nombre, DNI, rol, grado: 5A)...</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {tags.map((tag) => (
                            <motion.div
                                key={tag.value}
                                layout
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className={`flex items-center rounded-full text-sm font-semibold pl-3 ${
                                    tag.isValid 
                                    ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200' 
                                    : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200'
                                }`}
                            >
                                {!tag.isValid && <AlertTriangle size={14} className="mr-1.5 shrink-0" />}
                                <span className="pr-2 py-1">{tag.displayValue}</span>
                                <button 
                                    onClick={() => onRemoveTag(tag.value)} 
                                    className={`p-1.5 mr-1 rounded-full transition-colors ${
                                        tag.isValid
                                        ? 'hover:bg-indigo-200 dark:hover:bg-indigo-500/30'
                                        : 'hover:bg-rose-200 dark:hover:bg-rose-500/30'
                                    }`}
                                    aria-label={`Quitar filtro ${tag.displayValue}`}
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={`flex-grow bg-transparent focus:outline-none p-2 min-w-[200px] text-lg font-bold ${isPlaceholderVisible ? 'caret-transparent' : ''}`}
                        aria-label="Añadir filtro de búsqueda"
                        autoComplete="off"
                    />
                </div>
            </div>
            <AutocompleteSuggestions
                suggestions={suggestions}
                activeSuggestionIndex={activeSuggestionIndex}
                onSelectSuggestion={(suggestion) => handleAddTagAndReset(getFullName(suggestion))}
                inputValue={inputValue}
            />
        </div>
    );
};

export default UserListHeader;