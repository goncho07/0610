import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GenericUser, Student } from '../../types';

const isStudent = (user: GenericUser): user is Student => 'studentCode' in user;
const getFullName = (user: GenericUser): string => isStudent(user) ? user.fullName : user.name;

interface AutocompleteSuggestionsProps {
    suggestions: GenericUser[];
    activeSuggestionIndex: number;
    onSelectSuggestion: (suggestion: GenericUser) => void;
    inputValue: string;
}

const AutocompleteSuggestions: React.FC<AutocompleteSuggestionsProps> = ({ suggestions, activeSuggestionIndex, onSelectSuggestion, inputValue }) => {
    
    const highlightMatch = (text: string, query: string) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === query.toLowerCase() ? (
                        <strong key={i} className="font-extrabold">{part}</strong>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    return (
        <AnimatePresence>
            {suggestions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 5 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full w-full mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
                >
                    <ul role="listbox">
                        {suggestions.map((user, index) => {
                            const fullName = getFullName(user);
                            return (
                                <li
                                    key={isStudent(user) ? user.documentNumber : user.dni}
                                    role="option"
                                    aria-selected={index === activeSuggestionIndex}
                                    onClick={() => onSelectSuggestion(user)}
                                    className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                                        index === activeSuggestionIndex ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                    }`}
                                >
                                    <img src={user.avatarUrl} alt={fullName} className="w-9 h-9 rounded-full" />
                                    <span className="text-base text-slate-700 dark:text-slate-200 capitalize">
                                        {highlightMatch(fullName.toLowerCase(), inputValue)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AutocompleteSuggestions;