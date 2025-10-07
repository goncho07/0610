import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { UsersRound, Plus, UploadCloud, Download } from 'lucide-react';

// Data store
import { useAppDataStore } from '@/store/appDataStore';

// Types and Hooks
import { GenericUser, UserStatus, Student, Staff, ParentTutor, SortConfig, ConfirmationModalState, ScheduleModalState, UserLevel, SearchTag } from '@/types';
import { track } from '@/analytics/track';

// PDF Utils
import { generateCarnet } from '@/utils/pdfGenerator';

// New Architecture Components
import { ModulePage } from '@/layouts/ModulePage';
import Button from '@/ui/Button';
import UserKpiCards from '@/components/users/UserKpiCards';
import UserListHeader from '@/components/users/UserListHeader';
import UserTable from '@/components/users/UserTable';
import UserDetailDrawer from '@/components/users/UserDetailDrawer';
import UserImportModal from '@/components/users/UserImportModal';
import ConfirmationModal from '@/components/users/ConfirmationModal';
import ScheduleDeactivationModal from '@/components/users/ScheduleDeactivationModal';

// --- TYPE GUARDS & HELPERS ---
const isStudent = (user: GenericUser): user is Student => 'studentCode' in user;
const isStaff = (user: GenericUser): user is Staff => 'category' in user;
const isParent = (user: GenericUser): user is ParentTutor => 'relation' in user;
const getFullName = (user: GenericUser): string => isStudent(user) ? user.fullName : user.name;
const getId = (user: GenericUser): string => isStudent(user) ? user.documentNumber : user.dni;
const getRole = (user: GenericUser) => {
    if (isStudent(user)) return 'Estudiante';
    if (isParent(user)) return 'Apoderado';
    if (isStaff(user)) return user.category;
    return 'N/A';
};
const getLevel = (user: GenericUser): UserLevel => {
    if (isStudent(user)) {
        if (user.grade.toLowerCase().includes('grado')) return 'Primaria';
        return 'Secundaria';
    }
    if (isStaff(user)) {
        if (user.role.includes('Inicial')) return 'Inicial';
        if (user.role.includes('Primaria')) return 'Primaria';
        if (user.role.includes('Secundaria')) return 'Secundaria';
    }
    return 'N/A';
};

const gradeMap: { [key: string]: string } = {
    '1': 'Primer', 'primero': 'Primer',
    '2': 'Segundo', 'segundo': 'Segundo',
    '3': 'Tercero', 'tercero': 'Tercero',
    '4': 'Cuarto', 'cuarto': 'Cuarto',
    '5': 'Quinto', 'quinto': 'Quinto',
    '6': 'Sexto', 'sexto': 'Sexto',
};

const UsersPage: React.FC = () => {
    const { allUsers: users, setAllUsers: setUsers } = useAppDataStore();
    const [activeTab, setActiveTab] = useState('Todos');
    const [searchTags, setSearchTags] = useState<SearchTag[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'fullName', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 7;

    // Modals state
    const [detailDrawerState, setDetailDrawerState] = useState<{isOpen: boolean, user: GenericUser | null, initialTab?: string}>({isOpen: false, user: null});
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalState>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    const [scheduleModal, setScheduleModal] = useState<ScheduleModalState>({ isOpen: false, users: [], onConfirm: () => {} });
    
    const detailDrawerTriggerRef = useRef<HTMLButtonElement | null>(null);

    const handleAddTag = useCallback((value: string) => {
        const lowerValue = value.toLowerCase().trim();
        if (searchTags.some(t => t.value.toLowerCase() === lowerValue || t.displayValue.toLowerCase() === lowerValue)) return; // Avoid duplicates

        const gradeRegex = /(?:(\d{1,2})|(primero|segundo|tercero|cuarto|quinto|sexto))\s?([A-F])/i;
        const match = lowerValue.match(gradeRegex);

        let newTag: SearchTag;

        if (match) {
            const gradeNum = match[1];
            const gradeName = match[2];
            const section = match[3].toUpperCase();
            
            const gradeWord = gradeMap[gradeNum] || gradeMap[gradeName];

            if (gradeWord) {
                const isValid = users.some(u => isStudent(u) && u.grade.toLowerCase() === gradeWord.toLowerCase() && u.section === section);
                newTag = {
                    value: `${gradeWord} ${section}`,
                    displayValue: `Grado: ${gradeWord} "${section}"`,
                    type: 'grade',
                    isValid
                };
            } else {
                 const isValidKeyword = users.some(u => getFullName(u).toLowerCase().includes(lowerValue) || getId(u).includes(lowerValue));
                 newTag = { value: value, displayValue: value, type: 'keyword', isValid: isValidKeyword };
            }
        } else {
            const isValid = users.some(u => getFullName(u).toLowerCase().includes(lowerValue) || getId(u).includes(lowerValue));
            newTag = { value: value, displayValue: value, type: 'keyword', isValid };
        }

        setSearchTags(prev => [...prev, newTag]);
    }, [users, searchTags]);

    const handleRemoveTag = useCallback((value: string) => {
        setSearchTags(prev => prev.filter(t => t.value !== value));
    }, []);

    const filteredUsers = useMemo(() => {
        let filtered = users;

        if (activeTab !== 'Todos') {
            filtered = filtered.filter(user => {
                const role = getRole(user);
                if (activeTab === 'Administrativos') return role === 'Administrativo';
                if (activeTab === 'Docentes') return role === 'Docente' || role === 'Apoyo';
                if (activeTab === 'Estudiantes') return role === 'Estudiante';
                if (activeTab === 'Apoderados') return role === 'Apoderado';
                return false;
            });
        }
        
        const validTags = searchTags.filter(t => t.isValid);
        if (validTags.length > 0) {
            filtered = filtered.filter(user => {
                return validTags.every(tag => {
                    if (tag.type === 'grade') {
                        if (!isStudent(user)) return false;
                        const [grade, section] = tag.value.split(' ');
                        return user.grade === grade && user.section === section;
                    }
                    const lowerValue = tag.value.toLowerCase();
                    return getFullName(user).toLowerCase().includes(lowerValue) || getId(user).toLowerCase().includes(lowerValue);
                });
            });
        }

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                const aVal = (a as any)[sortConfig.key];
                const bVal = (b as any)[sortConfig.key];

                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        
        return filtered;
    }, [users, activeTab, searchTags, sortConfig]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * usersPerPage;
        return filteredUsers.slice(startIndex, startIndex + usersPerPage);
    }, [filteredUsers, currentPage, usersPerPage]);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
                return;
            }

            if (detailDrawerState.isOpen || importModalOpen || confirmationModal.isOpen || scheduleModal.isOpen) {
                return;
            }

            if (event.key === 'ArrowRight') {
                if (currentPage < totalPages) {
                    setCurrentPage(prev => prev + 1);
                }
            } else if (event.key === 'ArrowLeft') {
                if (currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentPage, totalPages, detailDrawerState.isOpen, importModalOpen, confirmationModal.isOpen, scheduleModal.isOpen]);


    const handleOpenDrawer = (user: GenericUser | null, initialTab = 'resumen', event: React.MouseEvent<HTMLButtonElement>) => {
        detailDrawerTriggerRef.current = event.currentTarget;
        setDetailDrawerState({ isOpen: true, user, initialTab });
    };

    const handleCloseDrawer = () => {
        setDetailDrawerState({isOpen: false, user: null});
    };
    
    const handleSaveUser = (userData: Partial<GenericUser>) => {
        toast.success(`Usuario ${getFullName(userData as GenericUser) || 'nuevo'} guardado con éxito.`);
        handleCloseDrawer();
    };

    const handleGenerateFilteredCarnets = async () => {
        const studentsToPrint = filteredUsers.filter(u => isStudent(u)) as Student[];
        if (studentsToPrint.length > 0) {
            await generateCarnet(studentsToPrint);
            track('carnet_generated', { count: studentsToPrint.length, source: 'header_button_filtered' });
            toast.success(`${studentsToPrint.length} carnets generados para los usuarios en la vista actual.`);
        } else {
            toast.error('No hay estudiantes en la vista actual para generar carnets.');
        }
    };

    const handleImportUsers = (newUsers: GenericUser[]) => {
        const existingIds = new Set(users.map(u => getId(u)));
        const uniqueNewUsers = newUsers.filter(u => !existingIds.has(getId(u)));
        
        setUsers([...users, ...uniqueNewUsers]);
        
        const importedCount = uniqueNewUsers.length;
        const skippedCount = newUsers.length - importedCount;
        
        let toastMessage = `${importedCount} usuario(s) importado(s) con éxito.`;
        if (skippedCount > 0) {
            toastMessage += ` ${skippedCount} omitido(s) por ser duplicado(s).`;
        }
        toast.success(toastMessage);
        track('users_imported', { imported: importedCount, skipped: skippedCount });
    };
    
    return (
        <>
            <ModulePage
                title="Gestión de Usuarios"
                description="Administre perfiles de estudiantes, docentes, personal administrativo y apoderados."
                icon={UsersRound}
                kpis={<UserKpiCards users={users} activeTab={activeTab} onTabChange={setActiveTab} />}
                actionsRight={
                    <>
                        <Button aria-label="Generar Carnets de la vista filtrada" variant="tonal" icon={Download} onClick={handleGenerateFilteredCarnets}>Generar Carnets</Button>
                        <Button aria-label="Importar Usuarios" variant="tonal" icon={UploadCloud} onClick={() => setImportModalOpen(true)}>Importar</Button>
                        <Button aria-label="Crear Nuevo Usuario" variant="filled" icon={Plus} onClick={(e) => handleOpenDrawer(null, 'editar', e)}>Crear Usuario</Button>
                    </>
                }
                filters={
                    <UserListHeader
                        tags={searchTags}
                        allUsers={users}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                    />
                }
                content={
                    <UserTable
                        isLoading={false}
                        users={paginatedUsers}
                        sortConfig={sortConfig}
                        setSortConfig={setSortConfig as any}
                        onAction={(action, user, event) => {
                            if (action === 'view-details') handleOpenDrawer(user, 'resumen', event);
                        }}
                        onClearFilters={() => { setActiveTab('Todos'); setSearchTags([]); }}
                        onCreateUser={(e) => handleOpenDrawer(null, 'editar', e)}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                }
            />
            <UserDetailDrawer
                isOpen={detailDrawerState.isOpen}
                user={detailDrawerState.user}
                onClose={handleCloseDrawer}
                onSave={handleSaveUser}
                triggerElementRef={detailDrawerTriggerRef}
                initialTab={detailDrawerState.initialTab}
            />
             <UserImportModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} onImport={handleImportUsers} />
             <ConfirmationModal {...confirmationModal} onClose={() => setConfirmationModal(prev => ({...prev, isOpen: false}))} />
             <ScheduleDeactivationModal {...scheduleModal} onClose={() => setScheduleModal(prev => ({...prev, isOpen: false}))} />
        </>
    );
};

export default UsersPage;