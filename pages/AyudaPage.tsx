import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Phone, Mail, Building } from 'lucide-react';
import { track } from '@/analytics/track';

// New Architecture Components
import { ModulePage } from '@/layouts/ModulePage';
import Card from '@/ui/Card';
import FilterBar from '@/ui/FilterBar';

const faqData = { 'Primeros Pasos': [{ q: '¿Cómo restauro mi contraseña?', a: '...' }], 'Gestión de Asistencia': [{ q: '¿Cómo se justifica una inasistencia?', a: '...' }] };
type FaqCategory = keyof typeof faqData;

const AyudaPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('Primeros Pasos');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = useMemo(() => {
    if (!searchQuery) return faqData[activeCategory];
    track('help_search_used', { query: searchQuery });
    return Object.values(faqData).flat().filter(faq => faq.q.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, activeCategory]);
  
  const currentCategoryLabel = searchQuery ? 'Resultados de la Búsqueda' : activeCategory;

  return (
    <ModulePage
      title="Centro de Ayuda"
      description="Encuentre respuestas a preguntas frecuentes, guías y recursos de soporte."
      icon={HelpCircle}
      filters={<FilterBar activeFilters={[]} onRemoveFilter={()=>{}} onClearAll={()=>{}} />}
      content={
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 space-y-2">
               <h2 className="px-3 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categorías</h2>
                {Object.keys(faqData).map(category => (
                    <button 
                        key={category} 
                        onClick={() => setActiveCategory(category as FaqCategory)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors ${activeCategory === category && !searchQuery ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        {category}
                    </button>
                ))}
                <Card className="mt-6 !p-0 overflow-hidden">
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50"><h3 className="font-bold text-slate-800 dark:text-slate-100">Contacto de Soporte</h3></div>
                    <div className="p-4 space-y-3 text-sm"><div className="flex items-start gap-3"><Mail size={16} className="text-slate-500 mt-0.5 shrink-0"/><div><p className="font-semibold text-slate-700 dark:text-slate-200">Soporte Técnico</p><p className="text-slate-500 dark:text-slate-400">soporte.sge@ugel01.gob.pe</p></div></div><div className="flex items-start gap-3"><Phone size={16} className="text-slate-500 mt-0.5 shrink-0"/><div><p className="font-semibold text-slate-700 dark:text-slate-200">Mesa de Ayuda</p><p className="text-slate-500 dark:text-slate-400">(01) 719-5880</p></div></div></div>
                </Card>
            </aside>
            <main className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{currentCategoryLabel}</h2>
              <div className="space-y-3">
                {filteredFaqs.map((faq, index) => (
                    <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                        <button onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)} className="w-full flex justify-between items-center p-4 text-left">
                            <span className="font-bold text-slate-700 dark:text-slate-200">{faq.q}</span>
                            <motion.div animate={{ rotate: expandedQuestion === index ? 180 : 0 }}><ChevronDown className="text-slate-500" /></motion.div>
                        </button>
                        <AnimatePresence>
                        {expandedQuestion === index && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><div className="px-4 pb-4 text-slate-600 dark:text-slate-300">{faq.a}</div></motion.div>)}
                        </AnimatePresence>
                    </div>
                ))}
              </div>
            </main>
          </div>
      }
    />
  );
};

export default AyudaPage;