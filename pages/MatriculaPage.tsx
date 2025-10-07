import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDataStore } from '@/store/appDataStore';
// FIX: Add Staff and ParentTutor to imports for use in type guards.
import { Student, EnrollmentStatus, EnrollmentType, UserLevel, GenericUser, UserRole, Staff, ParentTutor } from '@/types';
import { track } from '@/analytics/track';
import {
    Users, Plus, Upload, UserCheck, UserX, UserMinus, Building2, ChevronDown, Search, X,
    FileText, ArrowRightLeft, ShieldCheck, FilePenLine, CalendarCheck, CheckCircle, ArrowRight, ArrowLeft, Users2 as GroupIcon, Check, Repeat, AlertTriangle,
    Shield, GraduationCap, Users2 as Users2Icon, User,
    ChevronLeft, ChevronRight
} from 'lucide-react';

import KpiCard from '@/ui/KpiCard';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';
import ActionMenu from '@/ui/ActionMenu';
import { generateFichaMatricula, generateConstanciaMatricula } from '@/utils/pdfGenerator';
import Pagination from '@/ui/Pagination';
import Drawer from '@/ui/Drawer';
import Chip from '@/ui/Chip';

// --- HELPERS (from UsersPage) ---
const isStudent = (user: GenericUser): user is Student => 'studentCode' in user;
// FIX: Add isStaff and isParent type guards to handle all GenericUser types.
const isStaff = (user: GenericUser): user is Staff => 'category' in user;
const isParent = (user: GenericUser): user is ParentTutor => 'relation' in user;

// FIX: Corrected getRole implementation to be exhaustive for GenericUser and return a valid UserRole, fixing the type error.
const getRole = (user: GenericUser): UserRole => {
    if (isStudent(user)) {
        return 'Estudiante';
    }
    if (isParent(user)) {
        return 'Apoderado';
    }
    // After the checks above, TypeScript correctly infers `user` as `Staff`.
    return user.category;
};


const getLevel = (user: GenericUser): UserLevel => {
    if (isStudent(user)) {
        if (user.grade.includes('AÑOS')) return 'Inicial';
        if (user.grade.includes('Grado')) return 'Primaria';
        if (user.grade.includes('Año')) return 'Secundaria';
    }
    return 'N/A';
};

const getRoleIcon = (role: UserRole) => {
    const props = { size: 16, className: "shrink-0" };
    switch(role) {
        case 'Director':
        case 'Administrativo': return <Shield {...props} className="text-blue-500" />;
        case 'Docente':
        case 'Apoyo': return <GraduationCap {...props} className="text-emerald-500" />;
        case 'Estudiante': return <User {...props} className="text-indigo-500" />;
        case 'Apoderado': return <Users2Icon {...props} className="text-purple-500" />;
        default: return <User {...props} className="text-slate-500" />;
    }
};

// --- MODAL & DRAWER COMPONENTS ---

const Modal: React.FC<{ children: React.ReactNode, title: string, onClose: () => void, size?: 'md' | 'lg' | 'xl' }> = ({ children, title, onClose, size = 'lg' }) => {
    const sizeClasses = {
        md: 'max-w-md',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
    };
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className={`bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-xl w-full ${sizeClasses[size]} flex flex-col max-h-[90vh]`}
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"><X size={20} /></button>
                </header>
                <main className="flex-grow overflow-y-auto p-6">
                    {children}
                </main>
            </motion.div>
        </motion.div>
    );
};

const VacanciesModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('metas');
    const tabs = [
        { id: 'metas', label: '1. Metas por sección' },
        { id: 'docentes', label: '2. Docentes asignados' },
        { id: 'resumen', label: '3. Resumen de Vacantes' },
    ];
    return (
        <Modal title="Gestión de Vacantes 2025" onClose={onClose} size="xl">
            <div className="flex flex-col h-full min-h-[400px]">
                <nav className="flex gap-2 border-b border-slate-200 dark:border-slate-700 mb-4">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === tab.id ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <div className="flex-grow">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}>
                            {activeTab === 'metas' && 
                                <div>
                                    <h3 className="font-semibold mb-2">Paso 1: Metas de Estudiantes por Sección</h3>
                                    <p className="text-slate-600 dark:text-slate-400">Defina la meta de estudiantes para cada sección. Este número representa la capacidad máxima del aula y es el primer paso para calcular las vacantes.</p>
                                    <div className="mt-4 p-8 bg-slate-100 dark:bg-slate-800 rounded-lg text-center text-slate-500">Tabla de Metas por Sección</div>
                                </div>
                            }
                            {activeTab === 'docentes' && 
                                <div>
                                    <h3 className="font-semibold mb-2">Paso 2: Asignación de Docentes</h3>
                                    <p className="text-slate-600 dark:text-slate-400">Asigne un docente a cada sección. Según la normativa, una vacante solo es válida si el aula tiene un docente asignado para el año lectivo.</p>
                                    <div className="mt-4 p-8 bg-slate-100 dark:bg-slate-800 rounded-lg text-center text-slate-500">Tabla de Asignación de Docentes</div>
                                </div>
                            }
                            {activeTab === 'resumen' && 
                                <div>
                                    <h3 className="font-semibold mb-2">Paso 3: Resumen de Vacantes Disponibles</h3>
                                    <p className="text-slate-600 dark:text-slate-400">Revise el cálculo final de vacantes. El sistema calcula <strong className="text-slate-800 dark:text-slate-200">(Vacantes = Meta - Matriculados)</strong> solo para las secciones con docente asignado. Guarde para actualizar el KPI "Vacantes disp."</p>
                                     <div className="mt-4 p-8 bg-slate-100 dark:bg-slate-800 rounded-lg text-center text-slate-500">Tabla Resumen de Vacantes</div>
                                </div>
                            }
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
             <footer className="mt-6 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
                <Button variant="tonal" onClick={onClose} aria-label="Cancelar">Cancelar</Button>
                <Button variant="filled" onClick={onClose} aria-label="Guardar y Recalcular">Guardar y Recalcular</Button>
            </footer>
        </Modal>
    );
};

const NewEnrollmentWizard: React.FC<{ onComplete: () => void, onClose: () => void }> = ({ onComplete, onClose }) => {
    const [step, setStep] = useState(1);

    const handleNextStep = () => setStep(s => Math.min(4, s + 1));
    const handlePrevStep = () => setStep(s => Math.max(1, s - 1));

    const handleFinish = () => {
        onComplete();
        handleNextStep(); // Go to success step
    };

    return (
         <Modal title="Nueva Matrícula" onClose={onClose} size="lg">
            <div className="flex flex-col">
                 <AnimatePresence mode="wait">
                    <motion.div key={step} initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}}>
                        {step <= 3 && (
                             <div className="flex items-center justify-center mb-6">
                                {['Identificación', 'Ubicación y Condición', 'Confirmación'].map((label, index) => (
                                    <React.Fragment key={label}>
                                        <div className="flex items-center">
                                            <motion.div animate={{ scale: step === index + 1 ? 1.1 : 1 }} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${step > index ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                {step > index + 1 ? <Check size={16} /> : index + 1}
                                            </motion.div>
                                            <span className={`ml-2 text-sm font-semibold transition-colors ${step >= index + 1 ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400'}`}>{label}</span>
                                        </div>
                                        {index < 2 && <div className={`flex-auto border-t-2 mx-4 transition-colors ${step > index + 1 ? 'border-indigo-600' : 'border-slate-200'}`}></div>}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                        
                        <div className="min-h-[250px]">
                            {step === 1 && <div>
                                <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-100">Paso 1: Identificación del Estudiante</h3>
                                <p className="text-sm text-slate-500 mb-4">Busque por DNI o Código de Estudiante. El sistema validará la información con RENIEC y verificará si ya existe una matrícula activa para el año en curso.</p>
                                <input type="text" placeholder="Ingrese DNI o Código de Estudiante" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                            </div>}
                            {step === 2 && <div className="space-y-4">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Paso 2: Ubicación y Condición Académica</h3>
                                <div className="grid grid-cols-2 gap-4">
                                     <div><label className="text-sm font-medium">Nivel</label><select className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 mt-1"><option>Secundaria</option></select></div>
                                     <div><label className="text-sm font-medium">Grado</label><select className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 mt-1"><option>5° Año</option></select></div>
                                     <div><label className="text-sm font-medium">Sección</label><select className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 mt-1"><option>A</option></select></div>
                                     <div><label className="text-sm font-medium">Turno</label><select className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 mt-1"><option>Mañana</option></select></div>
                                     <div><label className="text-sm font-medium">Tipo</label><select className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 mt-1"><option>Nuevo Ingreso</option><option>Continuidad</option></select></div>
                                     <div><label className="text-sm font-medium">Condición</label><select className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 mt-1"><option>Promovido</option><option>Repitente</option></select></div>
                                </div>
                                <div><label className="text-sm font-medium">Exoneraciones (Opcional)</label><div className="flex gap-4 mt-1"><label><input type="checkbox"/> Religión</label><label><input type="checkbox"/> Educación Física</label></div></div>
                            </div>}
                            {step === 3 && <div>
                                <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-100">Paso 3: Confirmación y Registro</h3>
                                <p className="text-sm text-slate-500 mb-4">Revise los datos y confirme la matrícula. Se asignará una vacante si hay disponibilidad. La entrega de la FUM al apoderado es obligatoria y gratuita al finalizar.</p>
                                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-2 text-sm">
                                    <p><strong>Estudiante:</strong> QUISPE MAMANI, JUAN CARLOS</p>
                                    <p><strong>Ubicación:</strong> 5° Año "A" - Turno Mañana</p>
                                    <p><strong>Condición:</strong> Promovido</p>
                                </div>
                            </div>}
                             {step === 4 && <div className="text-center py-8">
                                <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">¡Matrícula Exitosa!</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-2">El estudiante ha sido matriculado correctamente.</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Recuerde entregar los siguientes documentos al apoderado.</p>
                                <div className="mt-6 flex justify-center gap-4">
                                    <Button variant="tonal" icon={FileText} onClick={() => generateFichaMatricula({} as Student)} aria-label="Descargar FUM">Descargar FUM</Button>
                                    <Button variant="tonal" icon={CalendarCheck} onClick={() => generateConstanciaMatricula({} as Student)} aria-label="Descargar Constancia">Descargar Constancia</Button>
                                </div>
                            </div>}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <footer className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    {step <= 3 ? (
                        <>
                            <Button variant="tonal" onClick={handlePrevStep} disabled={step === 1} icon={ArrowLeft} aria-label="Paso anterior">Anterior</Button>
                            <div>
                                {step < 3 ? (
                                    <Button variant="filled" onClick={handleNextStep} aria-label="Siguiente paso">Siguiente <ArrowRight size={16}/></Button>
                                ) : (
                                    <Button variant="filled" onClick={handleFinish} icon={CheckCircle} aria-label="Finalizar Matrícula">Finalizar Matrícula</Button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="w-full flex justify-end">
                            <Button variant="filled" onClick={onClose} aria-label="Cerrar">Cerrar</Button>
                        </div>
                    )}
                </footer>
            </div>
        </Modal>
    );
};

const StudentDetailDrawer: React.FC<{ student: Student | null, isOpen: boolean, onClose: () => void }> = ({ student, isOpen, onClose }) => {
    if (!student) return null;
    return (
        <Drawer isOpen={isOpen} onClose={onClose} title="Resumen FUM (Solo Lectura)">
            <div className="space-y-4">
                 <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                    <p className="font-bold text-lg">{student.fullName}</p>
                    <p className="text-sm text-slate-500">DNI: {student.documentNumber}</p>
                    <p className="text-sm text-slate-500">Grado: {student.grade} "{student.section}"</p>
                </div>
                 <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                    <h4 className="font-semibold mb-2">Información Académica</h4>
                    <p className="text-sm"><strong>Tipo:</strong> {student.enrollmentType}</p>
                    <p className="text-sm"><strong>Condición:</strong> {student.condition}</p>
                    <p className="text-sm"><strong>Estado:</strong> {student.enrollmentStatus}</p>
                </div>
                 <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                    <h4 className="font-semibold mb-2">Familia</h4>
                    <p className="text-sm text-slate-500">Datos del apoderado y hermanos...</p>
                </div>
            </div>
        </Drawer>
    );
};

// --- MAIN PAGE COMPONENTS ---

const Header = ({ onNewEnrollment, onShowVacancies }: any) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-xl">
                <Users size={32} />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Gestión de Matrícula</h1>
                <p className="mt-1 text-base text-slate-500 dark:text-slate-400">Administre matrícula, vacantes, traslados y retiros.</p>
            </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
                <select className="h-11 pl-4 pr-10 text-sm font-semibold text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
                    <option>Año 2025</option>
                    <option>Año 2024</option>
                </select>
                <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
             <Button variant="outlined" aria-label="Gestionar Vacantes" icon={GroupIcon} onClick={onShowVacancies}>Vacantes</Button>
             <Button variant="tonal" aria-label="Importar desde SIAGIE" icon={Upload}>Importar SIAGIE</Button>
             <Button variant="filled" aria-label="Nueva Matrícula" icon={Plus} onClick={onNewEnrollment}>Nueva Matrícula</Button>
        </div>
    </div>
);


const KpiCards = ({ students, activeKpi, setActiveKpi }: { students: Student[], activeKpi: string | null, setActiveKpi: (kpi: string | null) => void }) => {
    const kpiData = useMemo(() => {
        const matriculados = students.filter(s => s.enrollmentStatus === 'Matriculado').length;
        const trasladados = students.filter(s => s.enrollmentStatus === 'Trasladado').length;
        const retirados = students.filter(s => s.enrollmentStatus === 'Retirado').length;
        const vacantes = students.filter(s => s.enrollmentStatus === 'Pendiente').length;
        return { matriculados, trasladados, retirados, vacantes };
    }, [students]);

    const kpiItems = [
        { title: 'Matriculados', value: kpiData.matriculados, icon: UserCheck },
        { title: 'Traslados', value: kpiData.trasladados, icon: UserMinus },
        { title: 'Retirados', value: kpiData.retirados, icon: UserX },
        { title: 'Vacantes disp.', value: kpiData.vacantes, icon: Building2 }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
            {kpiItems.map(item => (
                <KpiCard 
                    key={item.title}
                    title={item.title} 
                    value={item.value} 
                    icon={item.icon} 
                    onClick={() => setActiveKpi(activeKpi === item.title ? null : item.title)}
                    active={activeKpi === item.title}
                />
            ))}
        </div>
    );
};

interface SearchTag {
    value: string;
    displayValue: string;
    type: 'keyword' | 'status' | 'type';
    isValid: boolean;
}

const MatriculaTable = ({ students, onOpenDrawer, onAction }: any) => {
    
    const actions = (student: Student) => [
        { label: 'Generar FUM (PDF)', icon: FileText, onClick: () => generateFichaMatricula(student) },
        { label: 'Generar Constancia (PDF)', icon: CalendarCheck, onClick: () => generateConstanciaMatricula(student) },
        ...(student.enrollmentStatus === 'Pre-matriculado' ? [{ label: 'Asignar Vacante', icon: UserCheck, onClick: () => onAction('assign_vacancy', student) }] : []),
        { label: 'Cambio de Sección/Turno', icon: Repeat, onClick: () => onAction('change_section', student) },
        { label: 'Registrar Traslado', icon: ArrowRightLeft, onClick: () => onAction('transfer', student) },
        { label: 'Registrar Retiro', icon: UserX, onClick: () => onAction('withdraw', student) },
        { label: 'Gestionar Exoneraciones', icon: ShieldCheck, onClick: () => onAction('exoneration', student) },
        { label: 'Rectificar FUM', icon: FilePenLine, onClick: () => onAction('rectification', student) },
    ];
    
    return (
        <div className="overflow-y-auto h-full">
             <table className="w-full text-base">
                <thead className="sticky top-0 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm z-10">
                    <tr>
                        <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300 w-2/5">Estudiante</th>
                        <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300">Rol</th>
                        <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300">Nivel</th>
                        <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300">Grado/Sección</th>
                        <th className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300">Estado</th>
                        <th className="p-4 w-20 text-center font-semibold text-slate-600 dark:text-slate-300">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? students.map((s: Student) => {
                        const role = getRole(s);
                        const level = getLevel(s);
                        return (
                            <tr key={s.documentNumber} className="border-t border-slate-100 dark:border-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-200 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-200 font-bold flex items-center justify-center text-sm uppercase">
                                            {s.paternalLastName.charAt(0)}{s.names.charAt(0)}
                                        </div>
                                        <div>
                                            <button onClick={() => onOpenDrawer(s)} className="font-bold text-lg text-slate-800 dark:text-slate-100 capitalize hover:underline text-left">{s.fullName.toLowerCase()}</button>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-2">{getRoleIcon(role)}<span>{role}</span></div>
                                </td>
                                <td className="p-4 text-slate-600 dark:text-slate-300">{level}</td>
                                <td className="p-4 text-slate-600 dark:text-slate-300">{s.grade} "{s.section}"</td>
                                <td className="p-4"><Chip color={
                                    s.enrollmentStatus === 'Matriculado' ? 'indigo' :
                                    s.enrollmentStatus === 'Trasladado' ? 'amber' :
                                    s.enrollmentStatus === 'Retirado' ? 'rose' : 
                                    s.enrollmentStatus === 'Pendiente' ? 'sky' : 'gray'
                                }>{s.enrollmentStatus}</Chip></td>
                                <td className="p-4 text-center"><ActionMenu actions={actions(s)} /></td>
                            </tr>
                        )
                    }) : (
                         <tr><td colSpan={6} className="text-center py-16 text-slate-500"><Search size={40} className="mx-auto mb-2"/><p className="font-semibold">No se encontraron estudiantes</p></td></tr>
                    )}
                </tbody>
             </table>
        </div>
    );
};

const MatriculaPage: React.FC = () => {
    const students = useAppDataStore(state => state.students);
    const [inputValue, setInputValue] = useState('');
    const [searchTags, setSearchTags] = useState<SearchTag[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 7;
    
    const [activeKpi, setActiveKpi] = useState<string | null>(null);
    const [modal, setModal] = useState<{type: string | null, data?: any}>({ type: null });
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [studentDrawer, setStudentDrawer] = useState<{isOpen: boolean, student: Student | null}>({isOpen: false, student: null});

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const handleAddTag = useCallback((value: string) => {
        const lowerValue = value.toLowerCase().trim();
        if (!lowerValue || searchTags.some(t => t.value.toLowerCase() === lowerValue)) return;

        const statuses: EnrollmentStatus[] = ['Matriculado', 'Pre-matriculado', 'Retirado', 'Trasladado', 'Pendiente'];
        const types: EnrollmentType[] = ['Continuidad', 'Ingresante', 'Traslado'];

        let newTag: SearchTag;
        const matchedStatus = statuses.find(s => s.toLowerCase() === lowerValue);
        const matchedType = types.find(t => t.toLowerCase() === lowerValue);

        if (matchedStatus) {
            newTag = { value, displayValue: `Estado: ${value}`, type: 'status', isValid: true };
        } else if (matchedType) {
            newTag = { value, displayValue: `Tipo: ${value}`, type: 'type', isValid: true };
        } else {
            const isValid = students.some(s => s.fullName.toLowerCase().includes(lowerValue) || s.documentNumber.includes(lowerValue));
            newTag = { value, displayValue: value, type: 'keyword', isValid };
        }
        setSearchTags(prev => [...prev, newTag]);
    }, [students, searchTags]);

    const handleRemoveTag = useCallback((value: string) => {
        setSearchTags(prev => prev.filter(t => t.value !== value));
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === 'Tab') && inputValue.trim()) {
            e.preventDefault();
            handleAddTag(inputValue);
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && searchTags.length > 0) {
            handleRemoveTag(searchTags[searchTags.length - 1].value);
        }
    };
    
    const filteredStudents = useMemo(() => {
        let filtered = students;

        if (activeKpi) {
            if (activeKpi === 'Matriculados') {
                filtered = filtered.filter(s => s.enrollmentStatus === 'Matriculado');
            } else if (activeKpi === 'Traslados') {
                filtered = filtered.filter(s => s.enrollmentStatus === 'Trasladado');
            } else if (activeKpi === 'Retirados') {
                filtered = filtered.filter(s => s.enrollmentStatus === 'Retirado');
            } else if (activeKpi === 'Vacantes disp.') {
                filtered = filtered.filter(s => s.enrollmentStatus === 'Pendiente');
            }
        }

        const validTags = searchTags.filter(t => t.isValid);
        if (validTags.length > 0) {
            filtered = filtered.filter(s => {
                return validTags.every(tag => {
                    const lowerValue = tag.value.toLowerCase();
                    switch (tag.type) {
                        case 'keyword':
                            return s.fullName.toLowerCase().includes(lowerValue) || s.documentNumber.includes(lowerValue);
                        case 'status':
                            return s.enrollmentStatus.toLowerCase() === lowerValue;
                        case 'type':
                            return s.enrollmentType?.toLowerCase() === lowerValue;
                        default:
                            return false;
                    }
                });
            });
        }
        return filtered.sort((a,b) => a.fullName.localeCompare(b.fullName));
    }, [students, searchTags, activeKpi]);

    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredStudents.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredStudents, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
    
    const handleAction = useCallback((action: string, data: any) => {
        track(`matricula_${action}`, { studentId: data?.documentNumber });
        // Logic for handling actions will go here
    }, []);

    const handleNewEnrollmentComplete = () => {
        setShowSuccessDialog(true);
    };

    return (
        <motion.div
            className="flex flex-col h-[calc(100vh-140px)] max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Header onNewEnrollment={() => setModal({ type: 'new_enrollment' })} onShowVacancies={() => setModal({ type: 'vacancies' })} />
            </motion.div>
            <motion.div variants={itemVariants} className="h-8 shrink-0"></motion.div>
            <motion.div variants={itemVariants}>
                <KpiCards students={students} activeKpi={activeKpi} setActiveKpi={setActiveKpi} />
            </motion.div>
            <motion.div variants={itemVariants} className="h-6 shrink-0"></motion.div>
            
            <motion.div variants={itemVariants} className="relative">
                 <div 
                    className="relative flex items-center w-full px-4 text-base border border-slate-200 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 dark:text-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition min-h-[52px]"
                >
                    <Search className="text-slate-400" size={24} />
                    <div className="flex-1 flex items-center flex-wrap gap-2 ml-3">
                        {searchTags.map((tag) => (
                             <Chip key={tag.value} color={tag.isValid ? 'indigo' : 'rose'}>
                                {tag.displayValue}
                                <button onClick={() => handleRemoveTag(tag.value)} className="ml-1.5 opacity-50 hover:opacity-100"><X size={14} /></button>
                            </Chip>
                        ))}
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={searchTags.length === 0 ? "Buscar por nombre, DNI, estado (Matriculado), o tipo (Continuidad)..." : ""}
                            className="flex-grow bg-transparent focus:outline-none p-2 min-w-[200px] font-bold"
                        />
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="h-4 shrink-0"></motion.div>
            
            <motion.div variants={itemVariants} className="flex-grow flex flex-col relative group/table-nav">
                 <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex-grow flex flex-col overflow-hidden">
                    <div className="relative flex-grow overflow-hidden">
                        <MatriculaTable
                            students={paginatedStudents}
                            onOpenDrawer={(s: Student) => setStudentDrawer({ isOpen: true, student: s })}
                            onAction={handleAction}
                        />
                    </div>
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {totalPages > 1 && (
                        <>
                            <motion.button
                                key="prev-page-button"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: currentPage > 1 ? 1 : 0, x: 0, transition: { delay: 0.3 } }}
                                exit={{ opacity: 0, x: 20 }}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="absolute left-[-2.5rem] top-1/2 -translate-y-1/2 z-30 p-2 bg-slate-700/70 text-white rounded-full opacity-0 group-hover/table-nav:opacity-100 disabled:!opacity-0 transition-opacity duration-300 hover:bg-slate-800"
                                aria-label="Página anterior"
                            >
                                <ChevronLeft size={32} />
                            </motion.button>

                            <motion.button
                                key="next-page-button"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: currentPage < totalPages ? 1 : 0, x: 0, transition: { delay: 0.3 } }}
                                exit={{ opacity: 0, x: -20 }}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="absolute right-[-2.5rem] top-1/2 -translate-y-1/2 z-30 p-2 bg-slate-700/70 text-white rounded-full opacity-0 group-hover/table-nav:opacity-100 disabled:!opacity-0 transition-opacity duration-300 hover:bg-slate-800"
                                aria-label="Página siguiente"
                            >
                                <ChevronRight size={32} />
                            </motion.button>
                        </>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {modal.type === 'vacancies' && <VacanciesModal onClose={() => setModal({ type: null })} />}
                {modal.type === 'new_enrollment' && <NewEnrollmentWizard onClose={() => setModal({ type: null })} onComplete={handleNewEnrollmentComplete} />}
            </AnimatePresence>
            <StudentDetailDrawer student={studentDrawer.student} isOpen={studentDrawer.isOpen} onClose={() => setStudentDrawer({isOpen: false, student: null})} />
        </motion.div>
    );
};

export default MatriculaPage;