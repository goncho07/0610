import { Student, EnrollmentStatus, EnrollmentCondition, EnrollmentType, UserStatus } from '../types';
import { gradesAndSections } from './grades';

// --- Data for random generation ---
const lastNames = ['QUISPE', 'FLORES', 'RODRIGUEZ', 'SANCHEZ', 'GARCIA', 'ROJAS', 'DIAZ', 'TORRES', 'LOPEZ', 'GONZALES', 'PEREZ', 'CHAVEZ', 'VASQUEZ', 'MENDOZA', 'RAMOS', 'RAMIREZ', 'CASTILLO', 'CASTRO', 'VARGAS', 'RIVERA', 'MAMANI', 'GUTIERREZ', 'MARTINEZ', 'SOTO', 'HUAMAN'];
const maleNames = ['JUAN', 'CARLOS', 'LUIS', 'MIGUEL', 'JOSE', 'ANGEL', 'PEDRO', 'JORGE', 'ALEJANDRO', 'RICARDO', 'DAVID', 'FERNANDO', 'VICTOR', 'MARTIN', 'RAUL', 'MATEO', 'DANIEL', 'DIEGO', 'NICOLAS', 'SANTIAGO'];
const femaleNames = ['MARIA', 'ANA', 'ROSA', 'SOFIA', 'CAMILA', 'CARMEN', 'JUANA', 'VICTORIA', 'ISABEL', 'PATRICIA', 'MONICA', 'ELIZABETH', 'LAURA', 'ANDREA', 'DANIELA', 'VALENTINA', 'LUCIA', 'MARTINA', 'PAULA', 'SARA'];

const generateDNI = () => Math.floor(70000000 + Math.random() * 20000000).toString();

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateStudent = (): Omit<Student, 'avatarUrl' | 'tutorIds' | 'tags' | 'averageGrade' | 'attendancePercentage' | 'tardinessCount' | 'behaviorIncidents' | 'academicRisk'> => {
    const gender: 'Hombre' | 'Mujer' = Math.random() > 0.5 ? 'Hombre' : 'Mujer';
    const paternalLastName = getRandomItem(lastNames);
    const maternalLastName = getRandomItem(lastNames);
    const name = gender === 'Hombre' ? getRandomItem(maleNames) : getRandomItem(femaleNames);
    const fullName = `${paternalLastName} ${maternalLastName}, ${name}`;
    
    // FIX: Refactored to be type-safe and avoid inferring `gradeKey` as `never`.
    const levelKey = getRandomItem(Object.keys(gradesAndSections)) as keyof typeof gradesAndSections;
    const grades = gradesAndSections[levelKey];
    const gradeKey = getRandomItem(Object.keys(grades));
    const section = getRandomItem((grades as Record<string, string[]>)[gradeKey]);

    const year = 2025 - (parseInt(gradeKey.charAt(0)) + (levelKey === 'inicial' ? 2 : (levelKey === 'primaria' ? 5 : 11)));
    // FIX: Generate a valid date string in YYYY-MM-DD format to avoid potential issues and a misleading TypeScript error.
    const birthDate = new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];

    const enrollmentStatusRoll = Math.random();
    let enrollmentStatus: EnrollmentStatus;
    if (enrollmentStatusRoll < 0.85) { // 85%
        enrollmentStatus = 'Matriculado';
    } else if (enrollmentStatusRoll < 0.93) { // 8%
        enrollmentStatus = 'Trasladado';
    } else if (enrollmentStatusRoll < 0.98) { // 5%
        enrollmentStatus = 'Retirado';
    } else { // 2%
        enrollmentStatus = 'Pendiente';
    }
    
    const status: UserStatus = enrollmentStatus === 'Matriculado' ? 'Activo' : (enrollmentStatus === 'Pendiente' ? 'Pendiente' : 'Inactivo');

    const enrollmentType: EnrollmentType = enrollmentStatus === 'Trasladado' ? 'Traslado' : (Math.random() > 0.7 ? 'Ingresante' : 'Continuidad');
    const condition: EnrollmentCondition = Math.random() > 0.9 ? 'Repitente' : 'Promovido';
    const documentNumber = generateDNI();

    return {
        documentNumber,
        studentCode: `S2025${documentNumber}`,
        paternalLastName,
        maternalLastName,
        names: name,
        fullName,
        gender,
        birthDate,
        grade: gradeKey,
        section,
        enrollmentStatus,
        status,
        sede: Math.random() > 0.5 ? 'Norte' : 'Sur',
        lastLogin: Math.random() > 0.3 ? new Date(2025, 6, 20 + Math.floor(Math.random() * 10)).toISOString() : null,
        condition,
        enrollmentType,
    };
};

const generateFullStudentList = (count: number): Student[] => {
    const list: Student[] = [];
    const usedDnis = new Set<string>();
    
    while (list.length < count) {
        const partialStudent = generateStudent();
        if (!usedDnis.has(partialStudent.documentNumber)) {
            usedDnis.add(partialStudent.documentNumber);
            list.push({
                ...partialStudent,
                avatarUrl: `https://picsum.photos/seed/${partialStudent.documentNumber}/80/80`,
                tutorIds: [],
                tags: [],
                averageGrade: 11 + Math.random() * 8,
                attendancePercentage: 85 + Math.random() * 15,
                tardinessCount: Math.floor(Math.random() * 5),
                behaviorIncidents: Math.floor(Math.random() * 3),
                academicRisk: Math.random() > 0.85,
            });
        }
    }
    return list;
};

// Generated 1681 students distributed across all grades and sections.
export const students: Student[] = generateFullStudentList(1681);