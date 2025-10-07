import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, File } from 'lucide-react';
import { GenericUser, Student, Staff } from '@/types';
import Button from '@/ui/Button';

interface UserImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (newUsers: GenericUser[]) => void;
}

const UserImportModal: React.FC<UserImportModalProps> = ({ isOpen, onClose, onImport }) => {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [parsedData, setParsedData] = useState<{data: GenericUser[], errors: any[]}>({data: [], errors: []});

    const handleDownloadTemplate = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const csvHeaders = "ROL,ETAPA,SECCIÓN,ÁREA CURRICULAR,TIPO DE DOCUMENTO,NÚMERO DE DOCUMENTO,CÓDIGO DEL ESTUDIANTE,APELLIDO PATERNO,APELLIDO MATERNO,NOMBRES,SEXO,FECHA DE NACIMIENTO\n";
        const exampleStudentInitial = "Estudiante,INICIAL,MARGARITAS_3AÑOS,,DNI,92354252,25050242700010,ANDRES,ALVAREZ,LARA MABEL,Mujer,11/05/2021\n";
        const exampleStudentPrimary = "Estudiante,PRIMARIA,2C,,DNI,90626045,00000090626045,NAVARRO,SANTOS,ALVARO DANTE,Hombre,11/02/2018\n";
        const exampleTeacher = "Docente,Secundaria,,Matemática,DNI,10203040,,PEREZ,GOMEZ,JUAN CARLOS,Hombre,1985-10-15\n";
        const csvContent = csvHeaders + exampleStudentInitial + exampleStudentPrimary + exampleTeacher;
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "plantilla_importacion_usuarios.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleParseAndValidate = () => {
        if (!file) return;
        setIsLoading(true);
        setTimeout(() => { // Simulate processing time
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const rows = text.split('\n').slice(1); // Assume header row
                const validUsers: GenericUser[] = [];
                const errorRows: any[] = [];

                rows.forEach((rowStr, index) => {
                    if (!rowStr.trim()) return;
                    const cols = rowStr.split(',');

                    if (cols.length < 12) {
                        errorRows.push({ row: index + 2, message: 'Número incorrecto de columnas, se esperaban 12' });
                        return;
                    }
                    
                    const [ ROL, ETAPA, SECCION, AREA_CURRICULAR, TIPO_DOC, NUM_DOC, COD_EST, APE_PAT, APE_MAT, NOMBRES, SEXO, FECHA_NAC ] = cols.map(c => c.trim().replace(/"/g, ''));

                    if (!ROL || !NUM_DOC || !APE_PAT || !NOMBRES) {
                         errorRows.push({ row: index + 2, message: 'Faltan campos obligatorios (Rol, N° Documento, Apellido Paterno, Nombres)' });
                        return;
                    }
                    
                    const fullName = `${APE_PAT} ${APE_MAT}, ${NOMBRES}`;

                    if (ROL.toLowerCase() === 'estudiante') {
                        let grade = '';
                        let section = '';

                        if (ETAPA.toUpperCase() === 'INICIAL') {
                            const parts = SECCION.split('_');
                            if (parts.length === 2) {
                                section = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase(); // Capitalize first letter
                                grade = parts[1].replace(/AÑOS/i, ' AÑOS').replace(/AÃ‘OS/i, ' AÑOS');
                            }
                        } else if (ETAPA.toUpperCase() === 'PRIMARIA' || ETAPA.toUpperCase() === 'SECUNDARIA') {
                            const gradeNumMatch = SECCION.match(/^(\d+)/);
                            if (gradeNumMatch) {
                                const gradeNum = gradeNumMatch[1];
                                section = SECCION.substring(gradeNum.length).toUpperCase();
                                const suffix = ETAPA.toUpperCase() === 'PRIMARIA' ? '° Grado' : '° Año';
                                grade = `${gradeNum}${suffix}`;
                            }
                        }

                        if (!grade || !section) {
                            errorRows.push({ row: index + 2, message: `Formato de SECCIÓN inválido ('${SECCION}') para la etapa '${ETAPA}'. Use 'NombreSeccion_Grado' para Inicial o 'GradoSeccion' para Primaria/Secundaria.` });
                            return;
                        }
                        
                        const student: Student = {
                            documentNumber: NUM_DOC,
                            studentCode: COD_EST || `S${new Date().getFullYear()}${NUM_DOC}`,
                            paternalLastName: APE_PAT,
                            maternalLastName: APE_MAT,
                            names: NOMBRES,
                            fullName: fullName,
                            gender: SEXO as 'Hombre' | 'Mujer',
                            birthDate: FECHA_NAC,
                            grade: grade,
                            section: section,
                            avatarUrl: `https://picsum.photos/seed/${NUM_DOC}/80/80`,
                            tutorIds: [],
                            enrollmentStatus: 'Matriculado',
                            status: 'Activo',
                            sede: 'Norte',
                            condition: 'Regular',
                            tags: [],
                            averageGrade: 0, attendancePercentage: 100, tardinessCount: 0, behaviorIncidents: 0, academicRisk: false,
                        };
                        validUsers.push(student);
                    } else {
                        const staff: Staff = {
                            dni: NUM_DOC,
                            name: fullName,
                            area: AREA_CURRICULAR,
                            role: ROL,
                            avatarUrl: `https://picsum.photos/seed/${NUM_DOC}/100/100`,
                            category: (['Docente', 'Apoyo', 'Director', 'Administrativo'].includes(ROL) ? ROL : 'Docente') as any,
                            status: 'Activo',
                            sede: 'Norte',
                            tags: [],
                        };
                        validUsers.push(staff);
                    }
                });
                setParsedData({ data: validUsers, errors: errorRows });
                setStep(2);
                setIsLoading(false);
            };
            reader.readAsText(file, 'UTF-8');
        }, 1500);
    };
    
    const handleConfirmImport = () => {
        setIsLoading(true);
        setTimeout(() => { // Simulate import
            onImport(parsedData.data);
            handleClose();
        }, 1000);
    };

    const handleClose = () => {
        setStep(1);
        setFile(null);
        setParsedData({data: [], errors: []});
        setIsLoading(false);
        onClose();
    };
    
    return (
         <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleClose}>
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-white dark:bg-slate-900 shadow-2xl rounded-2xl w-full max-w-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                    <header className="p-6 border-b border-slate-200 dark:border-slate-700 shrink-0"><div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Importar Usuarios desde CSV</h2><button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X size={20} /></button></div></header>
                    <main className="flex-1 overflow-y-auto p-6">
                        {step === 1 && (
                            <div>
                                <p className="mb-4 text-slate-600 dark:text-slate-300">Suba un archivo CSV con las 12 columnas requeridas. La columna "SECCIÓN" tiene un formato especial según la etapa. Puede usar la plantilla para asegurar el formato correcto. <a href="#" onClick={handleDownloadTemplate} className="text-indigo-600 font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">Descargar plantilla</a>.</p>
                                <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <File size={48} className="mx-auto text-slate-400"/>
                                        <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-900 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                <span>Seleccione un archivo</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                                            </label>
                                            <p className="pl-1">o arrástrelo aquí</p>
                                        </div>
                                        {file && <p className="text-xs text-slate-500">{file.name}</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div>
                                <p className="text-lg font-semibold">Validación de Datos</p>
                                <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex justify-around">
                                    <p><span className="font-bold text-emerald-600">{parsedData.data.length}</span> registros listos para importar.</p>
                                    <p><span className="font-bold text-rose-600">{parsedData.errors.length}</span> registros con errores.</p>
                                </div>
                                {parsedData.errors.length > 0 && <div className="mt-4 text-rose-600 text-sm">Errores encontrados: {parsedData.errors.map(e => `Fila ${e.row}: ${e.message}`).join('; ')}</div>}
                            </div>
                        )}
                    </main>
                    <footer className="p-6 border-t border-slate-200 dark:border-slate-700 shrink-0 flex justify-end items-center gap-2">
                        {step === 1 && <Button variant="filled" onClick={handleParseAndValidate} disabled={!file || isLoading} aria-label={isLoading ? 'Validando archivo' : 'Validar Archivo'}>{isLoading ? 'Validando...' : 'Validar Archivo'}</Button>}
                        {step === 2 && <>
                            <Button variant="tonal" onClick={() => setStep(1)} disabled={isLoading} aria-label="Volver al paso anterior">Atrás</Button>
                            <Button variant="filled" onClick={handleConfirmImport} disabled={parsedData.data.length === 0 || isLoading} aria-label={isLoading ? 'Importando usuarios' : 'Confirmar e Importar'}>{isLoading ? 'Importando...' : 'Confirmar e Importar'}</Button>
                        </>}
                    </footer>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
};

export default UserImportModal;