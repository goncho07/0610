import { Staff } from '../types';

const lastNames = ['GOMEZ', 'PEREZ', 'RAMIREZ', 'SOTO', 'CORDOVA', 'MONTERO', 'VEGA', 'MARÓN', 'DIAZ', 'ROMERO', 'ZUÑIGA', 'CUYUBAMBA', 'FLORES', 'RIVERA', 'ALLAUCA', 'VALENZUELA', 'BARRETO', 'BARRÓN', 'BUENDIA', 'SANTIAGO', 'AQUINO', 'POMA', 'SOTELO', 'RODRÍGUEZ', 'VIZCARRA', 'HERRERA', 'CHONTA', 'DE LA CRUZ', 'VILLEGAS', 'VALDIVIA', 'ZAPATA', 'LUNA', 'PAREDES', 'MANSILLA', 'CASTRO', 'MONTES', 'FIESTAS', 'POLO', 'PUERTA', 'REYNA', 'TORRES', 'ROJAS', 'MENDOZA', 'CASTILLO'];
const firstNamesMale = ['JUAN CARLOS', 'ANGEL ROSARIO', 'GREGORIO', 'MIRELLA MARTHA', 'MARCO ANTONIO', 'JHOSSEL ANDERSON', 'VLADIMIR', 'FREDDY', 'FELIX YVAN', 'GUSTAVO ALEJANDRO', 'LUIS HUMBERTO', 'JAVIER', 'DANIEL', 'ALEJANDRO', 'MANUEL', 'RICARDO', 'ROBERTO', 'FERNANDO', 'JORGE', 'EDUARDO'];
const firstNamesFemale = ['MARIA ELENA', 'NATALY', 'AURIA CAROLINE', 'LUZ MARÍA', 'PATRICIA MARIBEL', 'GLORIA LUZ', 'CINTHIA MAYURI', 'MARILYN FANNY', 'LILI', 'ANAMARIA ESTHER', 'LAURA', 'SOFIA', 'CARMEN', 'ISABEL', 'ANA', 'VERONICA', 'SANDRA', 'ELIZABETH', 'PAOLA'];
const areas = ['Inicial', 'Primaria', 'Secundaria', 'CIENCIA Y TECNOLOGÍA', 'COMUNICACIÓN', 'EDUCACIÓN FÍSICA', 'ARTE Y CULTURA', 'Matemática', 'Ciencias Sociales', 'Inglés'];

const generateDNI = () => Math.floor(10000000 + Math.random() * 90000000).toString();

const generateName = (gender: 'Male' | 'Female') => {
    const lastName1 = lastNames[Math.floor(Math.random() * lastNames.length)];
    const lastName2 = lastNames[Math.floor(Math.random() * lastNames.length)];
    const firstNameList = gender === 'Male' ? firstNamesMale : firstNamesFemale;
    const firstName = firstNameList[Math.floor(Math.random() * firstNameList.length)];
    return `${lastName1} ${lastName2}, ${firstName}`;
};

const generatedStaff: Staff[] = [];

// Generate 100 teachers
for (let i = 0; i < 100; i++) {
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    const area = areas[Math.floor(Math.random() * areas.length)];
    const role = area === 'Inicial' ? 'Docente_Inicial' : area === 'Primaria' ? 'Docente_Primaria' : 'Docente_Secundaria';
    const lastLoginDate = new Date(2025, 6, 20 + Math.floor(Math.random() * 10));
    
    generatedStaff.push({
        dni: generateDNI(),
        name: generateName(gender),
        area: area,
        role: role,
        avatarUrl: `https://picsum.photos/seed/${generateDNI()}/100/100`,
        category: 'Docente',
        status: Math.random() > 0.05 ? 'Activo' : 'Inactivo',
        sede: Math.random() > 0.5 ? 'Norte' : 'Sur',
        lastLogin: lastLoginDate.toISOString(),
        tags: [],
        notesProgress: Math.floor(60 + Math.random() * 41),
        attendancePercentage: Math.floor(90 + Math.random() * 11),
    });
}

// Fixed administrative and support staff
const fixedStaff: Staff[] = [
  // Administrativos
  { dni: '10203040', name: 'GOMEZ PEREZ, MARIA ELENA', area: 'Secretaría Académica', role: 'Secretaria', avatarUrl: 'https://picsum.photos/seed/10203040/100/100', category: 'Administrativo', status: 'Activo', sede: 'Norte', lastLogin: '2025-07-28T10:00:00Z', tags: ['admin-principal'], attendancePercentage: 98 },
  { dni: '20304050', name: 'RAMIREZ SOTO, JUAN CARLOS', area: 'Administración', role: 'Jefe de Administración', avatarUrl: 'https://picsum.photos/seed/20304050/100/100', category: 'Administrativo', status: 'Activo', sede: 'Sur', lastLogin: '2025-07-27T11:30:00Z', tags: [], attendancePercentage: 100 },
  // Apoyo
  { dni: '07673115', name: 'CORDOVA MONTERO ANGEL ROSARIO', area: 'PIP', role: 'Docente_Secundaria', avatarUrl: 'https://picsum.photos/seed/07673115/100/100', category: 'Apoyo', status: 'Activo', sede: 'Norte', lastLogin: '2025-07-29T08:00:00Z', tags: ['tecnologia'], attendancePercentage: 95 },
  { dni: '08046665', name: 'VEGA MARÓN GREGORIO', area: 'PIP', role: 'Docente_Secundaria', avatarUrl: 'https://picsum.photos/seed/08046665/100/100', category: 'Apoyo', status: 'Inactivo', sede: 'Norte', lastLogin: '2025-05-10T14:00:00Z', tags: ['tecnologia'], attendancePercentage: 90 },
  { dni: '45480502', name: 'DIAZ ROMERO MIRELLA MARTHA', area: 'PSICÓLOGO DOCENTE', role: 'Docente_Secundaria', avatarUrl: 'https://picsum.photos/seed/45480502/100/100', category: 'Apoyo', status: 'Activo', sede: 'Sur', lastLogin: '2025-07-26T15:20:00Z', tags: ['bienestar'], attendancePercentage: 99 },
  { dni: '10106071', name: 'ZUÑIGA CUYUBAMBA MARCO ANTONIO', area: 'PSICÓLOGO JEC', role: 'Docente_Secundaria', avatarUrl: 'https://picsum.photos/seed/10106071/100/100', category: 'Apoyo', status: 'Activo', sede: 'Norte', lastLogin: '2025-07-28T12:10:00Z', tags: ['bienestar'], attendancePercentage: 100 },
  { dni: '71829882', name: 'FLORES RIVERA JHOSSEL ANDERSON', area: 'PROFESOR DE BANDA', role: 'Docente_Secundaria', avatarUrl: 'https://picsum.photos/seed/71829882/100/100', category: 'Apoyo', status: 'Activo', sede: 'Norte', lastLogin: '2025-07-29T09:45:00Z', tags: ['extracurricular'], attendancePercentage: 97 },
];

// Combine and ensure the total is exactly 112
export const staff: Staff[] = [...fixedStaff, ...generatedStaff].slice(0, 112);