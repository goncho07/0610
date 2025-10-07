import React, { useMemo } from 'react';
import KpiCard from '@/ui/KpiCard';
import { GenericUser, Staff, Student, ParentTutor } from '@/types';
import { Shield, GraduationCap, User, Users2, Users } from 'lucide-react';

const isStaff = (user: GenericUser): user is Staff => 'category' in user;
const isStudent = (user: GenericUser): user is Student => 'studentCode' in user;
const isParent = (user: GenericUser): user is ParentTutor => 'relation' in user;

interface UserKpiCardsProps {
    users: GenericUser[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const UserKpiCards: React.FC<UserKpiCardsProps> = ({ users, activeTab, onTabChange }) => {

    const kpiCounts = useMemo(() => ({
        Todos: users.length,
        Administrativos: users.filter(u => isStaff(u) && u.category === 'Administrativo').length,
        Docentes: users.filter(u => isStaff(u) && (u.category === 'Docente' || u.category === 'Apoyo')).length,
        Estudiantes: users.filter(isStudent).length,
        Apoderados: users.filter(isParent).length,
    }), [users]);

    const handleCardClick = (category: string) => {
        if (activeTab === category) {
            onTabChange('Todos');
        } else {
            onTabChange(category);
        }
    };
    
    const kpiCategories = [
        { id: 'Todos', title: 'Todos', count: kpiCounts.Todos, icon: Users },
        { id: 'Administrativos', title: 'Administrativos', count: kpiCounts.Administrativos, icon: Shield },
        { id: 'Docentes', title: 'Docentes', count: kpiCounts.Docentes, icon: GraduationCap },
        { id: 'Estudiantes', title: 'Estudiantes', count: kpiCounts.Estudiantes, icon: User },
        { id: 'Apoderados', title: 'Apoderados', count: kpiCounts.Apoderados, icon: Users2 },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {kpiCategories.map(kpi => (
                <KpiCard 
                    key={kpi.id}
                    title={kpi.title} 
                    value={kpi.count} 
                    active={activeTab === kpi.id} 
                    onClick={() => onTabChange(kpi.id)} 
                    icon={kpi.icon} 
                />
            ))}
        </div>
    );
};

export default UserKpiCards;