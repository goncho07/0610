import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Inbox, Send, Edit, Trash2, Archive } from 'lucide-react';
import { track } from '@/analytics/track';

// New Architecture Components
import { ModulePage } from '@/layouts/ModulePage';
import FilterBar from '@/ui/FilterBar';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';

const mockMessages = [
  { id: 1, from: 'Dirección Académica', subject: 'Recordatorio: Cierre de Notas del 2do Bimestre', snippet: 'Estimados docentes, se les recuerda que la fecha límite para el registro de notas...', timestamp: 'hace 2 horas', read: false, folder: 'inbox' },
  { id: 2, from: 'Secretaría', subject: 'Actualización de Ficha de Matrícula', snippet: 'Se solicita a los padres de familia del 3er Grado "B" acercarse a secretaría para...', timestamp: 'hace 1 día', read: true, folder: 'inbox' },
  { id: 3, to: 'Docentes de Primaria', subject: 'Convocatoria a Reunión de Coordinación', snippet: 'Se convoca a todos los docentes del nivel primario a la reunión de coordinación...', timestamp: 'hace 2 días', folder: 'sent' },
  { id: 4, from: 'APAFA', subject: 'Comunicado sobre la Kermesse Anual', snippet: 'Invitamos a toda la comunidad educativa a participar de nuestra gran kermesse...', timestamp: 'hace 3 días', read: true, folder: 'inbox' },
];

const ComunicacionesPage: React.FC = () => {
    const [activeFolder, setActiveFolder] = useState('inbox');
    const [selectedMessage, setSelectedMessage] = useState(mockMessages[0]);
    
    const filteredMessages = mockMessages.filter(m => m.folder === activeFolder);
    
    const handleSelectMessage = (msg: typeof mockMessages[0]) => {
        setSelectedMessage(msg);
        if (!msg.read) {
            track('message_read', { messageId: msg.id });
            // Here you would also update the message state to mark as read
        }
    };

    return (
        <ModulePage
            title="Comunicaciones Internas"
            description="Envíe y reciba comunicados oficiales a docentes, apoderados y personal."
            icon={MessageSquare}
            actionsRight={<Button variant="filled" aria-label="Redactar nuevo mensaje" icon={Edit} onClick={() => track('message_compose_started')}>Redactar</Button>}
            filters={<FilterBar activeFilters={[]} onRemoveFilter={()=>{}} onClearAll={()=>{}} />}
            content={
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 h-[calc(100vh-320px)]">
                    {/* Sidebar */}
                    <div className="md:col-span-1 lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
                        <nav className="space-y-1">
                            <button onClick={() => setActiveFolder('inbox')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold ${activeFolder === 'inbox' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                <Inbox size={18} /> Bandeja de Entrada
                            </button>
                            <button onClick={() => setActiveFolder('sent')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold ${activeFolder === 'sent' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                <Send size={18} /> Enviados
                            </button>
                        </nav>
                    </div>

                    {/* Message List */}
                    <div className="md:col-span-3 lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col">
                        <ul className="overflow-y-auto flex-1">
                            {filteredMessages.map(msg => (
                                 <li key={msg.id}>
                                    <button onClick={() => handleSelectMessage(msg)} className={`w-full text-left p-4 border-l-4 ${selectedMessage?.id === msg.id ? 'border-indigo-500 bg-slate-50 dark:bg-slate-700/50' : `border-transparent ${!msg.read && 'font-bold'}`} hover:bg-slate-50 dark:hover:bg-slate-700/50`}>
                                        <div className="flex justify-between items-baseline">
                                            <p className="text-sm text-slate-800 dark:text-slate-100">{msg.from || msg.to}</p>
                                            <p className="text-xs text-slate-400">{msg.timestamp}</p>
                                        </div>
                                        <p className="text-sm mt-1 text-slate-700 dark:text-slate-200">{msg.subject}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">{msg.snippet}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Message Detail */}
                    <div className="hidden lg:block lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 p-6 overflow-y-auto">
                        {selectedMessage && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedMessage.subject}</h2>
                                    <div className="flex items-center gap-1">
                                        <IconButton aria-label="Archivar mensaje" variant="text" icon={Archive} />
                                        <IconButton aria-label="Eliminar mensaje" variant="text" icon={Trash2} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-4">
                                    <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold">D</div>
                                    <div>
                                        <p className="font-semibold text-slate-700 dark:text-slate-200">{selectedMessage.from || 'Yo'}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Para: {selectedMessage.to || 'Mí'}</p>
                                    </div>
                                </div>
                                <div className="mt-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
                                    <p>{selectedMessage.snippet}</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            }
        />
    );
};

export default ComunicacionesPage;