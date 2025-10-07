

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Student } from '../types';

export const generateFichaMatricula = (student: Student) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Ficha Única de Matrícula - SIAGIE", 14, 22);
    doc.setFontSize(11);
    doc.text("IEE 6049 Ricardo Palma", 14, 28);
    
    (doc as any).autoTable({
        startY: 40,
        head: [['Campo', 'Información del Estudiante']],
        body: [
            ['Apellidos y Nombres', student.fullName],
            ['DNI', student.documentNumber],
            ['Código de Estudiante', student.studentCode],
            ['Fecha de Nacimiento', student.birthDate],
            ['Género', student.gender],
            ['Grado y Sección', `${student.grade} "${student.section}"`],
            ['Condición', student.condition],
            ['Estado de Matrícula', student.enrollmentStatus],
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
    });
    
    doc.text("Firma del Apoderado:", 14, (doc as any).autoTable.previous.finalY + 20);
    doc.line(14, (doc as any).autoTable.previous.finalY + 30, 80, (doc as any).autoTable.previous.finalY + 30);
    
    doc.text("Firma del Director:", 130, (doc as any).autoTable.previous.finalY + 20);
    doc.line(130, (doc as any).autoTable.previous.finalY + 30, 196, (doc as any).autoTable.previous.finalY + 30);
    
    doc.save(`Ficha_Matricula_${student.documentNumber}.pdf`);
};

export const generateConstanciaMatricula = (student: Student) => {
    const doc = new jsPDF();
    const centerX = doc.internal.pageSize.getWidth() / 2;

    doc.setFontSize(18);
    doc.text("CONSTANCIA DE MATRÍCULA - 2025", centerX, 22, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text("La Dirección de la IEE 6049 Ricardo Palma hace constar que:", 14, 40);
    
    doc.setFont("helvetica", "bold");
    doc.text(student.fullName.toUpperCase(), centerX, 60, { align: 'center' });
    
    doc.setFont("helvetica", "normal");
    doc.text(`Identificado(a) con DNI N° ${student.documentNumber}, se encuentra debidamente matriculado(a) en esta institución educativa para el año lectivo 2025, en el:`, 14, 75, { maxWidth: 180 });
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`${student.grade.toUpperCase()} DE EDUCACIÓN ${student.grade.includes('Año') ? 'SECUNDARIA' : 'PRIMARIA'} - SECCIÓN "${student.section.toUpperCase()}"`, centerX, 95, { align: 'center' });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Se expide la presente constancia a solicitud del interesado para los fines que estime conveniente.", 14, 115, { maxWidth: 180 });

    doc.text(`Lima, ${new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}`, 130, 140);

    doc.text("________________________", 130, 170);
    doc.text("Dirección", 145, 175);
    
    doc.save(`Constancia_Matricula_${student.documentNumber}.pdf`);
};

export const generateCarnet = (students: Student[]) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const cardWidth = 85.6;
    const cardHeight = 53.98;
    const marginX = 15;
    const marginY = 15;
    let x = marginX;
    let y = marginY;

    students.forEach((student, index) => {
        if (index > 0 && index % 8 === 0) {
            doc.addPage();
            x = marginX;
            y = marginY;
        }

        // Card Background
        doc.setFillColor(79, 70, 229); // indigo-600
        doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');
        
        // Header
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text("IEE 6049 Ricardo Palma", x + 5, y + 8);
        doc.setFontSize(10);
        doc.text("CARNET ESCOLAR 2025", x + 5, y + 13);

        // Photo
        doc.setFillColor(255, 255, 255);
        doc.rect(x + 5, y + 18, 25, 30, 'F');
        doc.addImage(student.avatarUrl, 'JPEG', x + 5.5, y + 18.5, 24, 29);

        // Details
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text(student.fullName.toUpperCase(), x + 33, y + 25, { maxWidth: 50 });
        
        doc.setFontSize(8);
        doc.setTextColor(200, 200, 255);
        doc.text("DNI:", x + 33, y + 35);
        doc.text("GRADO:", x + 33, y + 40);
        doc.text("SECCIÓN:", x + 55, y + 40);

        doc.setTextColor(255, 255, 255);
        doc.text(student.documentNumber, x + 40, y + 35);
        doc.text(student.grade, x + 43, y + 40);
        doc.text(student.section, x + 68, y + 40);

        // Move to next position
        if ((index + 1) % 2 === 0) {
            x = marginX;
            y += cardHeight + 5;
        } else {
            x += cardWidth + 5;
        }
    });

    doc.save(`Carnets_Escolares.pdf`);
};