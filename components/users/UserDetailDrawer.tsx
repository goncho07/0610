import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Activity as ActivityIcon, History, X, Save, Send, Pencil, Users, Info, Trash2, KeyRound } from 'lucide-react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import es from 'date-fns/locale/es';
import { UserStatus, ActivityLog, Student, Staff, ParentTutor, GenericUser, UserRole, Level } from '@/types';
// FIX: Import gradesAndSections to be available for the type definition at the module level.
import { gradesAndSections as gradesAndSectionsData } from '@/data/grades';
import { useAppDataStore } from '@/store/appDataStore';
import Button from '@/ui/Button';
import UserProfileSummary from './UserProfileSummary';
import FamilyGroupView from './FamilyGroupView';

const getStatusChipClass = (status: UserStatus) => {
    switch (status) {
        case 'Activo': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-500/30';
        case 'Inactivo': return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 ring-1 ring-inset ring-slate-300 dark:ring-slate-600';
        case 'Suspendido': return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 ring-1 ring-inset ring-amber-200 dark:ring-amber-500/30';
        case 'Egresado': return 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 ring-1 ring-inset ring-sky-200 dark:ring-sky-500/30';
        case 'Pendiente': return 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 ring-1 ring-inset ring-sky-200 dark:ring-sky-500/30';
        default: return 'bg-gray-100 text-gray-800';
    }
};

type UserFormData = Partial<Student & Staff & ParentTutor> & { userType: UserRole | 'Personal', level?: keyof typeof gradesAndSectionsData };

const BLANK_USER: UserFormData = {
    name: '',
    email: '',
    role: 'Estudiante',
    sede: 'Norte',
    condition: 'Regular',
    status: 'Pendiente',
    tags: [],
    userType: 'Estudiante',
    level: 'primaria',
    grade: '1° Grado',
    section: 'A',
};

interface UserDetailDrawerProps {
    isOpen: boolean;
    user: GenericUser | null;
    onClose: () => void;
    onSave: (user: UserFormData) => void;
    triggerElementRef: React.RefObject<HTMLButtonElement | null>;
    initialTab?: string;
}

const isStudent = (user: any): user is Student => user && 'studentCode' in user;
const isStaff = (user: any): user is Staff => user && 'area' in user;
const isParent = (user: any): user is ParentTutor => user && 'relation' in user;

const getUserType = (user: GenericUser | null): UserRole | 'Personal' => {
    if (!user) return 'Estudiante';
    if (isStudent(user)) return 'Estudiante';
    if (isParent(user)) return 'Apoderado';
    if (isStaff(user)) return user.category;
    return 'Estudiante';
};


const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({ isOpen, user, onClose, onSave, triggerElementRef, initialTab }) => {
    const { activityLogs: allLogs, gradesAndSections } = useAppDataStore();
    const isNewUser = !user;
    const [activeTab, setActiveTab] = useState(initialTab || 'resumen');
    const drawerRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<UserFormData>(BLANK_USER);
    const [isEditing, setIsEditing] = useState(isNewUser);
    
    useEffect(() => {
        if (isOpen) {
            const newUserState: UserFormData = user ? { ...user, userType: getUserType(user), level: 'primaria' } : { ...BLANK_USER };
            setFormData(newUserState);
            setIsEditing(isNewUser);
            setActiveTab(isNewUser ? 'resumen' : (initialTab || 'resumen'));
        }
    }, [isOpen, user, isNewUser, initialTab]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFormData((prev) => ({ ...prev, userType: value as UserRole | 'Personal', role: value }));
    };

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLevel = e.target.value as keyof typeof gradesAndSections;
        const newGrades = Object.keys(gradesAndSections[newLevel]);
        const newGrade = newGrades[0];
        const newSections = (gradesAndSections[newLevel] as any)[newGrade] || [];
        const newSection = newSections[0] || '';
        setFormData((prev) => ({
            ...prev,
            level: newLevel,
            grade: newGrade,
            section: newSection
        }));
    };

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newGrade = e.target.value;
        const level = formData.level as keyof typeof gradesAndSections;
        const newSections = (gradesAndSections[level] as any)[newGrade] || [];
        const newSection = newSections[0] || '';
        setFormData((prev) => ({
            ...prev,
            grade: newGrade,
            section: newSection
        }));
    };
    
    const handleSaveClick = () => {
        onSave(formData);
        if (!isNewUser) {
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        if (isNewUser) {
            onClose();
        } else {
            setFormData(user ? { ...user, userType: getUserType(user), level: 'primaria' } : { ...BLANK_USER });
            setIsEditing(false);
        }
    };

    const drawerTabs = [
        { id: 'resumen', label: 'Resumen', icon: Info },
        { id: 'actividad', label: 'Actividad', icon: ActivityIcon },
    ];

    const userLogs = useMemo(() => {
        if (!user) return [];
        const name = isStudent(user) ? user.fullName : user.name;
        return allLogs.filter(log => log.targetUser === name || log.user === name);
    }, [user, allLogs]);
    
     useEffect(() => {
        if (isOpen) {
            // Focus management logic...
        }
    }, [isOpen, onClose, triggerElementRef]);
    
    const name = user ? (isStudent(user) ? user.fullName : user.name) : 'Nuevo Usuario';
    const status = user ? user.status : 'Pendiente';

    const renderFormFields = () => {
        const userType = formData.userType;
        const currentLevel = formData.level;
        // FIX: Explicitly type gradesForLevel as string[] to avoid inference issues with Object.keys on a union type.
        const gradesForLevel: string[] = (currentLevel && gradesAndSections[currentLevel]) ? Object.keys(gradesAndSections[currentLevel]) : [];
        const sectionsForGrade = (currentLevel && formData.grade && gradesAndSections[currentLevel]) ? (gradesAndSections[currentLevel] as any)[formData.grade] || [] : [];
        
        return (
            <div className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <section>
                    <h3 className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Datos del Usuario</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isNewUser && (
                             <div className="md:col-span-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-1">Tipo de Usuario</label>
                                <select name="userType" value={formData.userType} onChange={handleUserTypeChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600">
                                    <option value="Estudiante">Estudiante</option>
                                    <option value="Docente">Docente</option>
                                    <option value="Administrativo">Administrativo</option>
                                    <option value="Apoyo">Personal de Apoyo</option>
                                    <option value="Apoderado">Apoderado</option>
                                </select>
                            </div>
                        )}
                        <div className="md:col-span-2"><label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-1">Nombre Completo</label><input name="name" type="text" value={formData.name || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"/></div>
                        <div className="md:col-span-2"><label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-1">Email</label><input name="email" type="email" value={formData.email || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"/></div>
                        {userType === 'Estudiante' && (
                            <>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-1">Nivel</label>
                                    <select name="level" value={currentLevel} onChange={handleLevelChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 capitalize">
                                        {Object.keys(gradesAndSections).map(level => <option key={level} value={level}>{level}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-1">Grado</label>
                                    <select name="grade" value={formData.grade || ''} onChange={handleGradeChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600">
                                        {gradesForLevel.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-1">Sección</label>
                                    <select name="section" value={String(formData.section ?? '')} onChange={handleInputChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600">
                                        {sectionsForGrade.map((section: string) => <option key={section} value={section}>{section}</option>)}
                                    </select>
                                </div>
                            </>
                        )}
                        {(userType === 'Docente' || userType === 'Administrativo' || userType === 'Apoyo' || userType === 'Personal') && (
                             <div><label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-1">Área</label><select name="area" value={formData.area || 'Inicial'} onChange={handleInputChange} className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"><option>Inicial</option><option>Primaria</option><option>Secundaria</option><option>Secretaría Académica</option><option>Administración</option></select></div>
                        )}
                    </div>
                </section>
            </div>
        );
    }

    const renderContent = () => {
        if (isEditing) {
            return renderFormFields();
        }

        switch(activeTab) {
            case 'resumen':
                return (
                    <div className="space-y-6">
                        <UserProfileSummary user={user as GenericUser} />
                        {isStudent(user) && <FamilyGroupView student={user} />}
                    </div>
                );
            case 'actividad':
                 return (
                    <div className="space-y-3">
                    {userLogs.length > 0 ? userLogs.map(log => (
                        <div key={log.id} className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <img src={log.userAvatar} className="w-9 h-9 rounded-full mt-1 shrink-0" alt={log.user}/>
                            <div className="flex-1">
                                <p className="text-sm">
                                    <strong className="font-semibold text-slate-800 dark:text-slate-100 capitalize">{log.user.toLowerCase()}</strong> realizó la acción <strong className="font-semibold">{log.action}</strong>
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 italic">"{log.details}"</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: es })}</p>
                            </div>
                        </div>
                    )) : <div className="text-center text-slate-500 p-8"><ActivityIcon size={40} className="mx-auto mb-2"/>No hay actividad reciente para este usuario.</div>}
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={onClose}>
                <motion.div
                    ref={drawerRef}
                    key={user ? (isStudent(user) ? user.documentNumber : user.dni) : 'new-user'}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="drawer-title"
                    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute right-0 top-0 h-full w-full max-w-2xl bg-slate-50 dark:bg-slate-900 shadow-2xl flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    <header className="p-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
                         <div className="flex justify-between items-start">
                             <div className="flex items-center gap-4">
                                {user && isStudent(user) ? (
                                    <div className="w-16 h-16 rounded-full bg-indigo-200 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-200 font-bold flex items-center justify-center text-xl uppercase">
                                        {user.paternalLastName.charAt(0)}{user.names.charAt(0)}
                                    </div>
                                ) : (
                                    <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${name.replace(/\s/g, '+')}&background=random`} alt={name} className="w-16 h-16 rounded-full" />
                                )}
                                <div>
                                    <h2 id="drawer-title" className="text-2xl font-bold text-slate-800 dark:text-slate-100 capitalize">{!isNewUser ? name.toLowerCase() : 'Crear Nuevo Usuario'}</h2>
                                    {!isNewUser && user && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusChipClass(status)}`}>{status}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Último acceso: {user.lastLogin ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true, locale: es }) : 'Nunca'}</span>
                                    </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                               {!isNewUser && !isEditing && (
                                   <Button variant="tonal" icon={Pencil} onClick={() => setIsEditing(true)} aria-label="Editar Usuario">Editar</Button>
                               )}
                               <button onClick={onClose} aria-label="Cerrar panel" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"><X size={20} /></button>
                            </div>
                        </div>
                    </header>
                    {!isNewUser && !isEditing && (
                         <nav className="border-b border-slate-200 dark:border-slate-700 px-6 shrink-0">
                            <div className="flex space-x-4">
                            {drawerTabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-t-md ${activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}>
                                    <div className="flex items-center gap-1.5"><tab.icon size={16}/> {tab.label}</div>
                                    {activeTab === tab.id && <motion.div layoutId="drawer-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
                                </button>
                            ))}
                            </div>
                        </nav>
                    )}
                    <main className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab + (isEditing ? '-editing' : '-viewing')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                    <footer className="p-6 border-t border-slate-200 dark:border-slate-700 shrink-0 flex justify-end items-center gap-2 bg-white dark:bg-slate-800/50">
                        {isEditing ? (
                            <div className="flex justify-end items-center gap-2 w-full">
                                <Button variant="tonal" onClick={handleCancelEdit} aria-label="Cancelar">Cancelar</Button>
                                <Button variant="filled" onClick={handleSaveClick} aria-label={isNewUser ? "Crear y Enviar Invitación" : "Guardar Cambios"}>
                                    {isNewUser ? <Send size={16}/> : <Save size={16}/>}
                                    {isNewUser ? "Crear y Enviar Invitación" : "Guardar Cambios"}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center w-full">
                                <Button variant="danger" icon={Trash2} onClick={() => { /* Needs confirmation modal logic */ }} aria-label="Eliminar Usuario">Eliminar</Button>
                                <Button variant="tonal" icon={KeyRound} onClick={() => { /* Needs toast/confirmation */ }} aria-label="Restablecer Contraseña">Restablecer</Button>
                            </div>
                        )}
                    </footer>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
};

export default UserDetailDrawer;