import {
  Miembro,
  CuotaMembresia,
  MaterialClase,
  TransaccionOtro,
  ReporteMora,
  DiaSemana,
  HorarioClase,
  Instructor,
  GrupoClase
} from '../types/models';

export const DIAS_SEMANA_DEFAULT: DiaSemana[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
];

export const INITIAL_HORARIOS: HorarioClase[] = [
  { ID_Horario: 1, Dia: 'Martes', Hora_Inicio: '18:30', Hora_Fin: '20:30' },
  { ID_Horario: 2, Dia: 'Jueves', Hora_Inicio: '18:30', Hora_Fin: '20:30' },
  { ID_Horario: 3, Dia: 'Miércoles', Hora_Inicio: '18:00', Hora_Fin: '20:00' },
  { ID_Horario: 4, Dia: 'Sábado', Hora_Inicio: '09:00', Hora_Fin: '12:00' },
  { ID_Horario: 5, Dia: 'Viernes', Hora_Inicio: '18:30', Hora_Fin: '20:30' },
  { ID_Horario: 6, Dia: 'Lunes', Hora_Inicio: '19:00', Hora_Fin: '21:00' }
];

export const INITIAL_INSTRUCTORES: Instructor[] = [
  { ID_Instructor: 1, Nombre_Completo: 'Prof. Roberto Valencia', Estatus: '01-J.F.' },
  { ID_Instructor: 2, Nombre_Completo: 'Lic. Claudia Solórzano', Estatus: '02-F.F.V.V.' },
  { ID_Instructor: 3, Nombre_Completo: 'Ing. Javier Arévalo', Estatus: '03-Miembro' },
  { ID_Instructor: 4, Nombre_Completo: 'Dra. Elena Monroy', Estatus: '02-F.F.V.V.' }
];

export const INITIAL_GRUPOS: GrupoClase[] = [
  { ID_Grupo: 1, Numero_Grupo: 'G-01 Introducción a la Filosofía', ID_Horario: 1, ID_Instructor: 1 },
  { ID_Grupo: 2, Numero_Grupo: 'G-02 Filosofía de Oriente y Occidente', ID_Horario: 3, ID_Instructor: 2 },
  { ID_Grupo: 3, Numero_Grupo: 'G-03 Ética y Moral Clásica', ID_Horario: 4, ID_Instructor: 3 },
  { ID_Grupo: 4, Numero_Grupo: 'G-04 Psicología Holística y Simbolismo', ID_Horario: 5, ID_Instructor: 4 },
  { ID_Grupo: 5, Numero_Grupo: 'G-05 Aspirantes de Primer Ingreso', ID_Horario: 6, ID_Instructor: 1 }
];

export const GRUPOS_HORARIOS_DEFAULT = [
  'Introducción a la Filosofía - Mar/Jue 6:30 PM',
  'Filosofía de Oriente y Occidente - Mié 6:00 PM',
  'Ética y Moral Clásica - Sáb 9:00 AM',
  'Psicología Holística y Simbolismo - Vie 6:30 PM',
  'Aspirantes de Primer Ingreso - Lun/Mié 7:00 PM'
];

export const INSTRUCTORES_DEFAULT = [
  'Prof. Roberto Valencia',
  'Lic. Claudia Solórzano',
  'Ing. Javier Arévalo',
  'Dra. Elena Monroy'
];

export const CONCEPTOS_PAGO_DEFAULT = [
  'Cuota Mensual de Membresía',
  'Cuota de Aspirante',
  'Aporte Filosófico Mensual',
  'Cuota de Miembro Activo'
];

export const MESES_CALENDARIO = [
  "01-ENERO", "02-FEBRERO", "03-MARZO", "04-ABRIL", "05-MAYO", "06-JUNIO",
  "07-JULIO", "08-AGOSTO", "09-SEPTIEMBRE", "10-OCTUBRE", "11-NOVIEMBRE", "12-DICIEMBRE"
];

export const METODOS_PAGO_DEFAULT = [
  'Págala',
  'Transferencia',
  'Efectivo',
  'Depósito Bancario'
];

export const CATALOGO_ESTATUS_DEFAULT: string[] = [
  '01-J.F.',
  '02-F.F.V.V.',
  '03-Miembro',
  '04-Probacionista',
  '05-Inscrito',
  '06-Ficha llena',
  '98-Sospecha de retiro',
  '99-Retirado'
];

export const INITIAL_MIEMBROS: Miembro[] = [
  {
    ID_Miembro: 1,
    Miembro_Aspirante: 'Alejandro Mendoza Ortiz',
    Condicion: 'Miembro',
    DUI: '03456789-2',
    Celular: '7845-1234',
    Correo: 'alejandro.mendoza@email.com',
    Grupo_Horario: 'G-01 Introducción a la Filosofía — Martes 18:30 a 20:30',
    Instructores: 'Prof. Roberto Valencia',
    Cuota: 25.00,
    Estatus: '03-Miembro',
    Fecha_Ingreso: '2025-03-15'
  },
  {
    ID_Miembro: 2,
    Miembro_Aspirante: 'Beatriz Elena Castaneda',
    Condicion: 'Miembro',
    DUI: '02891234-7',
    Celular: '7123-9845',
    Correo: 'beatriz.castaneda@email.com',
    Grupo_Horario: '',
    Instructores: '',
    Cuota: 30.00,
    Estatus: '01-J.F.',
    Fecha_Ingreso: '2024-06-10'
  },
  {
    ID_Miembro: 3,
    Miembro_Aspirante: 'Carlos Eduardo Lemus',
    Condicion: 'Aspirante',
    DUI: '01984562-3',
    Celular: '7456-7890',
    Correo: 'carlos.lemus@email.com',
    Grupo_Horario: 'G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00',
    Instructores: 'Ing. Javier Arévalo',
    Cuota: 25.00,
    Estatus: '05-Inscrito',
    Fecha_Ingreso: '2025-10-01'
  },
  {
    ID_Miembro: 4,
    Miembro_Aspirante: 'Diana Marcela Henríquez',
    Condicion: 'Miembro Activo',
    DUI: '04561230-8',
    Celular: '7901-2345',
    Correo: 'diana.henriquez@email.com',
    Grupo_Horario: '',
    Instructores: '',
    Cuota: 35.00,
    Estatus: '02-F.F.V.V.',
    Fecha_Ingreso: '2023-11-20'
  },
  {
    ID_Miembro: 5,
    Miembro_Aspirante: 'Ernesto Alonso Zavaleta',
    Condicion: 'Aspirante',
    DUI: '01874590-1',
    Celular: '7654-3210',
    Correo: 'ernesto.zavaleta@email.com',
    Grupo_Horario: 'G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00',
    Instructores: 'Prof. Roberto Valencia',
    Cuota: 25.00,
    Estatus: '06-Ficha llena',
    Fecha_Ingreso: '2026-01-15'
  },
  {
    ID_Miembro: 6,
    Miembro_Aspirante: 'Gabriela Sofía Rivas',
    Condicion: 'Miembro',
    DUI: '03789124-5',
    Celular: '7234-5678',
    Correo: 'gabriela.rivas@email.com',
    Grupo_Horario: 'G-01 Introducción a la Filosofía — Martes 18:30 a 20:30',
    Instructores: 'Prof. Roberto Valencia',
    Cuota: 25.00,
    Estatus: '03-Miembro',
    Fecha_Ingreso: '2025-05-12'
  },
  {
    ID_Miembro: 7,
    Miembro_Aspirante: 'Hugo Mauricio Escalante',
    Condicion: 'Miembro',
    DUI: '02564178-9',
    Celular: '7789-0123',
    Correo: 'hugo.escalante@email.com',
    Grupo_Horario: 'G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00',
    Instructores: 'Lic. Claudia Solórzano',
    Cuota: 30.00,
    Estatus: '04-Probacionista',
    Fecha_Ingreso: '2024-09-01'
  },
  {
    ID_Miembro: 8,
    Miembro_Aspirante: 'Karla Patricia Moran',
    Condicion: 'Miembro',
    DUI: '04123890-4',
    Celular: '7567-8901',
    Correo: 'karla.moran@email.com',
    Grupo_Horario: 'G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00',
    Instructores: 'Ing. Javier Arévalo',
    Cuota: 25.00,
    Estatus: '03-Miembro',
    Fecha_Ingreso: '2025-02-18'
  },
  {
    ID_Miembro: 9,
    Miembro_Aspirante: 'Fernando José Calderón',
    Condicion: 'Miembro',
    DUI: '03901234-6',
    Celular: '7345-6789',
    Correo: 'fernando.calderon@email.com',
    Grupo_Horario: 'G-01 Introducción a la Filosofía — Martes 18:30 a 20:30',
    Instructores: 'Prof. Roberto Valencia',
    Cuota: 25.00,
    Estatus: '98-Sospecha de retiro',
    Fecha_Ingreso: '2024-11-05'
  },
  {
    ID_Miembro: 10,
    Miembro_Aspirante: 'Lorena Ivette Carranza',
    Condicion: 'Miembro',
    DUI: '02678901-3',
    Celular: '7890-1234',
    Correo: 'lorena.carranza@email.com',
    Grupo_Horario: 'G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00',
    Instructores: 'Lic. Claudia Solórzano',
    Cuota: 30.00,
    Estatus: '03-Miembro',
    Fecha_Ingreso: '2025-04-20'
  },
  {
    ID_Miembro: 11,
    Miembro_Aspirante: 'Rodrigo Antonio Morales',
    Condicion: 'Miembro',
    DUI: '03123456-9',
    Celular: '7012-3456',
    Correo: 'rodrigo.morales@email.com',
    Grupo_Horario: 'G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00',
    Instructores: 'Ing. Javier Arévalo',
    Cuota: 30.00,
    Estatus: '99-Retirado',
    Fecha_Ingreso: '2024-08-14'
  },
  {
    "ID_Miembro": 12,
    "Miembro_Aspirante": "Mauricio Alexander Peña",
    "Condicion": "Miembro",
    "DUI": "02456781-9",
    "Celular": "7412-5896",
    "Correo": "mauricio.pena@email.com",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Instructores": "Prof. Roberto Valencia",
    "Cuota": 25,
    "Estatus": "03-Miembro",
    "Fecha_Ingreso": "2025-01-20"
  },
  {
    "ID_Miembro": 13,
    "Miembro_Aspirante": "Silvia María Portillo",
    "Condicion": "Miembro",
    "DUI": "03891234-5",
    "Celular": "7823-4567",
    "Correo": "silvia.portillo@email.com",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Instructores": "Lic. Claudia Solórzano",
    "Cuota": 30,
    "Estatus": "03-Miembro",
    "Fecha_Ingreso": "2024-10-15"
  },
  {
    "ID_Miembro": 14,
    "Miembro_Aspirante": "Francisco Javier Meléndez",
    "Condicion": "Aspirante",
    "DUI": "01784562-1",
    "Celular": "7156-7890",
    "Correo": "francisco.melendez@email.com",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Instructores": "Ing. Javier Arévalo",
    "Cuota": 25,
    "Estatus": "04-Probacionista",
    "Fecha_Ingreso": "2025-06-01"
  },
  {
    "ID_Miembro": 15,
    "Miembro_Aspirante": "Patricia Elizabeth Gómez",
    "Condicion": "Miembro",
    "DUI": "04231567-8",
    "Celular": "7934-5678",
    "Correo": "patricia.gomez@email.com",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Instructores": "Dra. Elena Monroy",
    "Cuota": 30,
    "Estatus": "03-Miembro",
    "Fecha_Ingreso": "2024-12-10"
  },
  {
    "ID_Miembro": 16,
    "Miembro_Aspirante": "Walter Ernesto Guardado",
    "Condicion": "Aspirante",
    "DUI": "02981245-6",
    "Celular": "7678-9012",
    "Correo": "walter.guardado@email.com",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Instructores": "Prof. Roberto Valencia",
    "Cuota": 25,
    "Estatus": "05-Inscrito",
    "Fecha_Ingreso": "2026-02-01"
  },
  {
    "ID_Miembro": 17,
    "Miembro_Aspirante": "Andrea Carolina Villalobos",
    "Condicion": "Miembro",
    "DUI": "03678901-2",
    "Celular": "7289-0123",
    "Correo": "andrea.villalobos@email.com",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Instructores": "Prof. Roberto Valencia",
    "Cuota": 25,
    "Estatus": "03-Miembro",
    "Fecha_Ingreso": "2025-07-18"
  },
  {
    "ID_Miembro": 18,
    "Miembro_Aspirante": "Jorge Alberto Cienfuegos",
    "Condicion": "Miembro",
    "DUI": "01567890-3",
    "Celular": "7745-6789",
    "Correo": "jorge.cienfuegos@email.com",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Instructores": "Dra. Elena Monroy",
    "Cuota": 35,
    "Estatus": "03-Miembro",
    "Fecha_Ingreso": "2023-09-05"
  },
  {
    "ID_Miembro": 19,
    "Miembro_Aspirante": "Carmen Elena Quintanilla",
    "Condicion": "Aspirante",
    "DUI": "02789012-4",
    "Celular": "7312-3456",
    "Correo": "carmen.quintanilla@email.com",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Instructores": "Prof. Roberto Valencia",
    "Cuota": 25,
    "Estatus": "06-Ficha llena",
    "Fecha_Ingreso": "2026-02-15"
  },
  {
    "ID_Miembro": 20,
    "Miembro_Aspirante": "Ricardo Enrique Orellana",
    "Condicion": "Miembro",
    "DUI": "03987654-1",
    "Celular": "7045-6789",
    "Correo": "ricardo.orellana@email.com",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Instructores": "Ing. Javier Arévalo",
    "Cuota": 30,
    "Estatus": "03-Miembro",
    "Fecha_Ingreso": "2025-04-10"
  }
];

export const INITIAL_CUOTAS: CuotaMembresia[] = [
  {
    "ID_Registro": 1,
    "Miembro_Aspirante": "Alejandro Mendoza Ortiz",
    "DUI": "03456789-2",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-07-02",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0701"
  },
  {
    "ID_Registro": 2,
    "Miembro_Aspirante": "Beatriz Elena Castaneda",
    "DUI": "02891234-7",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-07-03",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-074017"
  },
  {
    "ID_Registro": 3,
    "Miembro_Aspirante": "Carlos Eduardo Lemus",
    "DUI": "01984562-3",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-07-05",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-07110"
  },
  {
    "ID_Registro": 4,
    "Miembro_Aspirante": "Diana Marcela Henríquez",
    "DUI": "04561230-8",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 35,
    "Fecha_Pago": "2026-07-06",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-077069"
  },
  {
    "ID_Registro": 5,
    "Miembro_Aspirante": "Ernesto Alonso Zavaleta",
    "DUI": "01874590-1",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-07-07",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0705"
  },
  {
    "ID_Registro": 6,
    "Miembro_Aspirante": "Gabriela Sofía Rivas",
    "DUI": "03789124-5",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-07-08",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-074085"
  },
  {
    "ID_Registro": 7,
    "Miembro_Aspirante": "Hugo Mauricio Escalante",
    "DUI": "02564178-9",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-07-10",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-07130"
  },
  {
    "ID_Registro": 8,
    "Miembro_Aspirante": "Karla Patricia Moran",
    "DUI": "04123890-4",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-07-11",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-077161"
  },
  {
    "ID_Registro": 9,
    "Miembro_Aspirante": "Fernando José Calderón",
    "DUI": "03901234-6",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-07-13",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0709"
  },
  {
    "ID_Registro": 10,
    "Miembro_Aspirante": "Lorena Ivette Carranza",
    "DUI": "02678901-3",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-07-14",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-074153"
  },
  {
    "ID_Registro": 11,
    "Miembro_Aspirante": "Rodrigo Antonio Morales",
    "DUI": "03123456-9",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-07-15",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-07150"
  },
  {
    "ID_Registro": 12,
    "Miembro_Aspirante": "Mauricio Alexander Peña",
    "DUI": "02456781-9",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-07-17",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-077253"
  },
  {
    "ID_Registro": 13,
    "Miembro_Aspirante": "Silvia María Portillo",
    "DUI": "03891234-5",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-07-18",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0713"
  },
  {
    "ID_Registro": 14,
    "Miembro_Aspirante": "Francisco Javier Meléndez",
    "DUI": "01784562-1",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-07-20",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-074221"
  },
  {
    "ID_Registro": 15,
    "Miembro_Aspirante": "Patricia Elizabeth Gómez",
    "DUI": "04231567-8",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-07-21",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-07170"
  },
  {
    "ID_Registro": 16,
    "Miembro_Aspirante": "Walter Ernesto Guardado",
    "DUI": "02981245-6",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-07-22",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-077345"
  },
  {
    "ID_Registro": 17,
    "Miembro_Aspirante": "Andrea Carolina Villalobos",
    "DUI": "03678901-2",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-07-24",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0717"
  },
  {
    "ID_Registro": 18,
    "Miembro_Aspirante": "Jorge Alberto Cienfuegos",
    "DUI": "01567890-3",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 35,
    "Fecha_Pago": "2026-07-25",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-074289"
  },
  {
    "ID_Registro": 19,
    "Miembro_Aspirante": "Carmen Elena Quintanilla",
    "DUI": "02789012-4",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-07-27",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-07190"
  },
  {
    "ID_Registro": 20,
    "Miembro_Aspirante": "Ricardo Enrique Orellana",
    "DUI": "03987654-1",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "07-JULIO",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-07-28",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-077437"
  },
  {
    "ID_Registro": 21,
    "Miembro_Aspirante": "Alejandro Mendoza Ortiz",
    "DUI": "03456789-2",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-08-01",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-087000"
  },
  {
    "ID_Registro": 22,
    "Miembro_Aspirante": "Beatriz Elena Castaneda",
    "DUI": "02891234-7",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-08-03",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0802"
  },
  {
    "ID_Registro": 23,
    "Miembro_Aspirante": "Carlos Eduardo Lemus",
    "DUI": "01984562-3",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-08-04",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-084034"
  },
  {
    "ID_Registro": 24,
    "Miembro_Aspirante": "Diana Marcela Henríquez",
    "DUI": "04561230-8",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 35,
    "Fecha_Pago": "2026-08-05",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-08115"
  },
  {
    "ID_Registro": 25,
    "Miembro_Aspirante": "Ernesto Alonso Zavaleta",
    "DUI": "01874590-1",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-08-07",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-087092"
  },
  {
    "ID_Registro": 26,
    "Miembro_Aspirante": "Gabriela Sofía Rivas",
    "DUI": "03789124-5",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-08-08",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0806"
  },
  {
    "ID_Registro": 27,
    "Miembro_Aspirante": "Hugo Mauricio Escalante",
    "DUI": "02564178-9",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-08-10",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-084102"
  },
  {
    "ID_Registro": 28,
    "Miembro_Aspirante": "Karla Patricia Moran",
    "DUI": "04123890-4",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-08-11",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-08135"
  },
  {
    "ID_Registro": 29,
    "Miembro_Aspirante": "Fernando José Calderón",
    "DUI": "03901234-6",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-08-12",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-087184"
  },
  {
    "ID_Registro": 30,
    "Miembro_Aspirante": "Lorena Ivette Carranza",
    "DUI": "02678901-3",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-08-14",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0810"
  },
  {
    "ID_Registro": 31,
    "Miembro_Aspirante": "Rodrigo Antonio Morales",
    "DUI": "03123456-9",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-08-15",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-084170"
  },
  {
    "ID_Registro": 32,
    "Miembro_Aspirante": "Mauricio Alexander Peña",
    "DUI": "02456781-9",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-08-17",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-08155"
  },
  {
    "ID_Registro": 33,
    "Miembro_Aspirante": "Silvia María Portillo",
    "DUI": "03891234-5",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-08-18",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-087276"
  },
  {
    "ID_Registro": 34,
    "Miembro_Aspirante": "Francisco Javier Meléndez",
    "DUI": "01784562-1",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-08-19",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0814"
  },
  {
    "ID_Registro": 35,
    "Miembro_Aspirante": "Patricia Elizabeth Gómez",
    "DUI": "04231567-8",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-08-21",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-084238"
  },
  {
    "ID_Registro": 36,
    "Miembro_Aspirante": "Walter Ernesto Guardado",
    "DUI": "02981245-6",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-08-22",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-08175"
  },
  {
    "ID_Registro": 37,
    "Miembro_Aspirante": "Andrea Carolina Villalobos",
    "DUI": "03678901-2",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-08-24",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-087368"
  },
  {
    "ID_Registro": 38,
    "Miembro_Aspirante": "Jorge Alberto Cienfuegos",
    "DUI": "01567890-3",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 35,
    "Fecha_Pago": "2026-08-25",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0818"
  },
  {
    "ID_Registro": 39,
    "Miembro_Aspirante": "Carmen Elena Quintanilla",
    "DUI": "02789012-4",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-08-27",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-084306"
  },
  {
    "ID_Registro": 40,
    "Miembro_Aspirante": "Ricardo Enrique Orellana",
    "DUI": "03987654-1",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "08-AGOSTO",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-08-29",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-08195"
  },
  {
    "ID_Registro": 41,
    "Miembro_Aspirante": "Alejandro Mendoza Ortiz",
    "DUI": "03456789-2",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-09-02",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-09100"
  },
  {
    "ID_Registro": 42,
    "Miembro_Aspirante": "Beatriz Elena Castaneda",
    "DUI": "02891234-7",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-09-03",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-097023"
  },
  {
    "ID_Registro": 43,
    "Miembro_Aspirante": "Carlos Eduardo Lemus",
    "DUI": "01984562-3",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-09-04",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0903"
  },
  {
    "ID_Registro": 44,
    "Miembro_Aspirante": "Diana Marcela Henríquez",
    "DUI": "04561230-8",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 35,
    "Fecha_Pago": "2026-09-05",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-094051"
  },
  {
    "ID_Registro": 45,
    "Miembro_Aspirante": "Ernesto Alonso Zavaleta",
    "DUI": "01874590-1",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-09-07",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-09120"
  },
  {
    "ID_Registro": 46,
    "Miembro_Aspirante": "Gabriela Sofía Rivas",
    "DUI": "03789124-5",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-09-08",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-097115"
  },
  {
    "ID_Registro": 47,
    "Miembro_Aspirante": "Hugo Mauricio Escalante",
    "DUI": "02564178-9",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-09-09",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0907"
  },
  {
    "ID_Registro": 48,
    "Miembro_Aspirante": "Karla Patricia Moran",
    "DUI": "04123890-4",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-09-11",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-094119"
  },
  {
    "ID_Registro": 49,
    "Miembro_Aspirante": "Fernando José Calderón",
    "DUI": "03901234-6",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-09-12",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-09140"
  },
  {
    "ID_Registro": 50,
    "Miembro_Aspirante": "Lorena Ivette Carranza",
    "DUI": "02678901-3",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-09-14",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-097207"
  },
  {
    "ID_Registro": 51,
    "Miembro_Aspirante": "Rodrigo Antonio Morales",
    "DUI": "03123456-9",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-09-15",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0911"
  },
  {
    "ID_Registro": 52,
    "Miembro_Aspirante": "Mauricio Alexander Peña",
    "DUI": "02456781-9",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-09-16",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-094187"
  },
  {
    "ID_Registro": 53,
    "Miembro_Aspirante": "Silvia María Portillo",
    "DUI": "03891234-5",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-09-18",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-09160"
  },
  {
    "ID_Registro": 54,
    "Miembro_Aspirante": "Francisco Javier Meléndez",
    "DUI": "01784562-1",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-09-19",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-097299"
  },
  {
    "ID_Registro": 55,
    "Miembro_Aspirante": "Patricia Elizabeth Gómez",
    "DUI": "04231567-8",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-09-21",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0915"
  },
  {
    "ID_Registro": 56,
    "Miembro_Aspirante": "Walter Ernesto Guardado",
    "DUI": "02981245-6",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-09-22",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-094255"
  },
  {
    "ID_Registro": 57,
    "Miembro_Aspirante": "Andrea Carolina Villalobos",
    "DUI": "03678901-2",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-09-23",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-09180"
  },
  {
    "ID_Registro": 58,
    "Miembro_Aspirante": "Jorge Alberto Cienfuegos",
    "DUI": "01567890-3",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 35,
    "Fecha_Pago": "2026-09-25",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-097391"
  },
  {
    "ID_Registro": 59,
    "Miembro_Aspirante": "Carmen Elena Quintanilla",
    "DUI": "02789012-4",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-09-26",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-0919"
  },
  {
    "ID_Registro": 60,
    "Miembro_Aspirante": "Ricardo Enrique Orellana",
    "DUI": "03987654-1",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "09-SEPTIEMBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-09-28",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-094323"
  },
  {
    "ID_Registro": 61,
    "Miembro_Aspirante": "Alejandro Mendoza Ortiz",
    "DUI": "03456789-2",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-10-02",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-104000"
  },
  {
    "ID_Registro": 62,
    "Miembro_Aspirante": "Beatriz Elena Castaneda",
    "DUI": "02891234-7",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-10-03",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-10105"
  },
  {
    "ID_Registro": 63,
    "Miembro_Aspirante": "Carlos Eduardo Lemus",
    "DUI": "01984562-3",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-10-05",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-107046"
  },
  {
    "ID_Registro": 64,
    "Miembro_Aspirante": "Diana Marcela Henríquez",
    "DUI": "04561230-8",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 35,
    "Fecha_Pago": "2026-10-06",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-1004"
  },
  {
    "ID_Registro": 65,
    "Miembro_Aspirante": "Ernesto Alonso Zavaleta",
    "DUI": "01874590-1",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-10-07",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-104068"
  },
  {
    "ID_Registro": 66,
    "Miembro_Aspirante": "Gabriela Sofía Rivas",
    "DUI": "03789124-5",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-10-08",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-10125"
  },
  {
    "ID_Registro": 67,
    "Miembro_Aspirante": "Hugo Mauricio Escalante",
    "DUI": "02564178-9",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-10-09",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-107138"
  },
  {
    "ID_Registro": 68,
    "Miembro_Aspirante": "Karla Patricia Moran",
    "DUI": "04123890-4",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-10-12",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-1008"
  },
  {
    "ID_Registro": 69,
    "Miembro_Aspirante": "Fernando José Calderón",
    "DUI": "03901234-6",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-10-13",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-104136"
  },
  {
    "ID_Registro": 70,
    "Miembro_Aspirante": "Lorena Ivette Carranza",
    "DUI": "02678901-3",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-10-14",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-10145"
  },
  {
    "ID_Registro": 71,
    "Miembro_Aspirante": "Rodrigo Antonio Morales",
    "DUI": "03123456-9",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-10-15",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-107230"
  },
  {
    "ID_Registro": 72,
    "Miembro_Aspirante": "Mauricio Alexander Peña",
    "DUI": "02456781-9",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-10-16",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-1012"
  },
  {
    "ID_Registro": 73,
    "Miembro_Aspirante": "Silvia María Portillo",
    "DUI": "03891234-5",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-10-19",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-104204"
  },
  {
    "ID_Registro": 74,
    "Miembro_Aspirante": "Francisco Javier Meléndez",
    "DUI": "01784562-1",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-10-20",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-10165"
  },
  {
    "ID_Registro": 75,
    "Miembro_Aspirante": "Patricia Elizabeth Gómez",
    "DUI": "04231567-8",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-10-21",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-107322"
  },
  {
    "ID_Registro": 76,
    "Miembro_Aspirante": "Walter Ernesto Guardado",
    "DUI": "02981245-6",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-10-22",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-1016"
  },
  {
    "ID_Registro": 77,
    "Miembro_Aspirante": "Andrea Carolina Villalobos",
    "DUI": "03678901-2",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-10-23",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-104272"
  },
  {
    "ID_Registro": 78,
    "Miembro_Aspirante": "Jorge Alberto Cienfuegos",
    "DUI": "01567890-3",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 35,
    "Fecha_Pago": "2026-10-24",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-10185"
  },
  {
    "ID_Registro": 79,
    "Miembro_Aspirante": "Carmen Elena Quintanilla",
    "DUI": "02789012-4",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-10-25",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-107414"
  },
  {
    "ID_Registro": 80,
    "Miembro_Aspirante": "Ricardo Enrique Orellana",
    "DUI": "03987654-1",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "10-OCTUBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-10-26",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-1020"
  },
  {
    "ID_Registro": 81,
    "Miembro_Aspirante": "Alejandro Mendoza Ortiz",
    "DUI": "03456789-2",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-11-02",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-1101"
  },
  {
    "ID_Registro": 82,
    "Miembro_Aspirante": "Beatriz Elena Castaneda",
    "DUI": "02891234-7",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-11-03",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-114017"
  },
  {
    "ID_Registro": 83,
    "Miembro_Aspirante": "Carlos Eduardo Lemus",
    "DUI": "01984562-3",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-11-04",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-11110"
  },
  {
    "ID_Registro": 84,
    "Miembro_Aspirante": "Diana Marcela Henríquez",
    "DUI": "04561230-8",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 35,
    "Fecha_Pago": "2026-11-05",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-117069"
  },
  {
    "ID_Registro": 85,
    "Miembro_Aspirante": "Ernesto Alonso Zavaleta",
    "DUI": "01874590-1",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-11-06",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-1105"
  },
  {
    "ID_Registro": 86,
    "Miembro_Aspirante": "Gabriela Sofía Rivas",
    "DUI": "03789124-5",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-11-09",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-114085"
  },
  {
    "ID_Registro": 87,
    "Miembro_Aspirante": "Hugo Mauricio Escalante",
    "DUI": "02564178-9",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-11-10",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-11130"
  },
  {
    "ID_Registro": 88,
    "Miembro_Aspirante": "Karla Patricia Moran",
    "DUI": "04123890-4",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-11-11",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-117161"
  },
  {
    "ID_Registro": 89,
    "Miembro_Aspirante": "Fernando José Calderón",
    "DUI": "03901234-6",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-11-12",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-1109"
  },
  {
    "ID_Registro": 90,
    "Miembro_Aspirante": "Lorena Ivette Carranza",
    "DUI": "02678901-3",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-11-13",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-114153"
  },
  {
    "ID_Registro": 91,
    "Miembro_Aspirante": "Rodrigo Antonio Morales",
    "DUI": "03123456-9",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-11-16",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-11150"
  },
  {
    "ID_Registro": 92,
    "Miembro_Aspirante": "Mauricio Alexander Peña",
    "DUI": "02456781-9",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-11-17",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-117253"
  },
  {
    "ID_Registro": 93,
    "Miembro_Aspirante": "Silvia María Portillo",
    "DUI": "03891234-5",
    "Grupo_Horario": "G-02 Filosofía de Oriente y Occidente — Miércoles 18:00 a 20:00",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-11-18",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-1113"
  },
  {
    "ID_Registro": 94,
    "Miembro_Aspirante": "Francisco Javier Meléndez",
    "DUI": "01784562-1",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-11-19",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-114221"
  },
  {
    "ID_Registro": 95,
    "Miembro_Aspirante": "Patricia Elizabeth Gómez",
    "DUI": "04231567-8",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-11-20",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-11170"
  },
  {
    "ID_Registro": 96,
    "Miembro_Aspirante": "Walter Ernesto Guardado",
    "DUI": "02981245-6",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-11-21",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-117345"
  },
  {
    "ID_Registro": 97,
    "Miembro_Aspirante": "Andrea Carolina Villalobos",
    "DUI": "03678901-2",
    "Grupo_Horario": "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-11-23",
    "Metodo_Pago": "Págala",
    "Referencia": "PAG-2026-1117"
  },
  {
    "ID_Registro": 98,
    "Miembro_Aspirante": "Jorge Alberto Cienfuegos",
    "DUI": "01567890-3",
    "Grupo_Horario": "G-04 Psicología Holística y Simbolismo — Viernes 18:30 a 20:30",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 35,
    "Fecha_Pago": "2026-11-24",
    "Metodo_Pago": "Transferencia",
    "Referencia": "TRF-BAC-114289"
  },
  {
    "ID_Registro": 99,
    "Miembro_Aspirante": "Carmen Elena Quintanilla",
    "DUI": "02789012-4",
    "Grupo_Horario": "G-05 Aspirantes de Primer Ingreso — Lunes 19:00 a 21:00",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 25,
    "Fecha_Pago": "2026-11-25",
    "Metodo_Pago": "Efectivo",
    "Referencia": "REC-11190"
  },
  {
    "ID_Registro": 100,
    "Miembro_Aspirante": "Ricardo Enrique Orellana",
    "DUI": "03987654-1",
    "Grupo_Horario": "G-03 Ética y Moral Clásica — Sábado 09:00 a 12:00",
    "Mes_Pagado": "11-NOVIEMBRE",
    "Monto_Cuota": 30,
    "Fecha_Pago": "2026-11-26",
    "Metodo_Pago": "Depósito Bancario",
    "Referencia": "DEP-CUSC-117437"
  }
];

export const INITIAL_MATERIALES: MaterialClase[] = [
  {
    ID_Material_Log: 1,
    Miembro_Aspirante: 'Alejandro Mendoza Ortiz',
    Materia_Articulo: 'Libro: El Banquete de Platón (Edición Comentada)',
    Monto: 16.00,
    Fecha_Solicitud: '2026-02-02',
    Estado_Pago: 'Pagado',
    Estado_Entrega: 'Entregado'
  },
  {
    ID_Material_Log: 2,
    Miembro_Aspirante: 'Beatriz Elena Castaneda',
    Materia_Articulo: 'Libro: La Voz del Silencio - H.P. Blavatsky',
    Monto: 14.50,
    Fecha_Solicitud: '2026-02-04',
    Estado_Pago: 'Pagado',
    Estado_Entrega: 'Entregado'
  },
  {
    ID_Material_Log: 3,
    Miembro_Aspirante: 'Carlos Eduardo Lemus',
    Materia_Articulo: 'Manual de Filosofía Estoica y Epicteto',
    Monto: 12.00,
    Fecha_Solicitud: '2026-01-20',
    Estado_Pago: 'Pendiente',
    Estado_Entrega: 'Pendiente'
  },
  {
    ID_Material_Log: 4,
    Miembro_Aspirante: 'Diana Marcela Henríquez',
    Materia_Articulo: 'Cuaderno de Estudio y Reflexión Filosófica',
    Monto: 8.00,
    Fecha_Solicitud: '2026-02-06',
    Estado_Pago: 'Pagado',
    Estado_Entrega: 'En Tránsito'
  },
  {
    ID_Material_Log: 5,
    Miembro_Aspirante: 'Ernesto Alonso Zavaleta',
    Materia_Articulo: 'Insignia Institucional NA de Primer Ingreso',
    Monto: 5.00,
    Fecha_Solicitud: '2026-02-08',
    Estado_Pago: 'Pagado',
    Estado_Entrega: 'Entregado'
  },
  {
    ID_Material_Log: 6,
    Miembro_Aspirante: 'Hugo Mauricio Escalante',
    Materia_Articulo: 'Compendio de Mitología y Simbolismo Comparado',
    Monto: 22.00,
    Fecha_Solicitud: '2026-02-12',
    Estado_Pago: 'Pendiente',
    Estado_Entrega: 'En Tránsito'
  }
];

export const INITIAL_OTROS: TransaccionOtro[] = [
  {
    ID_Transaccion: 1,
    Fecha: '2026-02-01',
    Concepto: 'Aporte Taller de Filosofía Práctica y Concentración',
    Monto: 145.00,
    Contacto: 'Lic. Claudia Solórzano',
    Estado: 'Completado',
    Accion_Pendiente: 'Enviar comprobante de donación'
  },
  {
    ID_Transaccion: 2,
    Fecha: '2026-02-03',
    Concepto: 'Compra de Café, Té y Suministros para Biblioteca Filosófica',
    Monto: -38.50,
    Contacto: 'Distribuidora San Salvador',
    Estado: 'Completado',
    Accion_Pendiente: 'Archivar factura fiscal',
    Archivos: [
      {
        id: 'arch-seed-1',
        nombre: 'Factura_Fiscal_Distribuidora_SS_0982.pdf',
        tamano: 184320,
        tipo: 'application/pdf',
        fechaSubida: '2026-02-03'
      }
    ]
  },
  {
    ID_Transaccion: 3,
    Fecha: '2026-02-05',
    Concepto: 'Reparación e Iluminación Sede Aula Magna',
    Monto: -65.00,
    Contacto: 'Técnico Manuel Ayala',
    Estado: 'Completado',
    Accion_Pendiente: 'Garantía 6 meses recibida',
    Archivos: [
      {
        id: 'arch-seed-2',
        nombre: 'Comprobante_Garantia_ManuelAyala.pdf',
        tamano: 225280,
        tipo: 'application/pdf',
        fechaSubida: '2026-02-05'
      },
      {
        id: 'arch-seed-3',
        nombre: 'Foto_Instalacion_Luminarias_Aula.jpg',
        tamano: 412500,
        tipo: 'image/jpeg',
        fechaSubida: '2026-02-05'
      }
    ]
  },
  {
    ID_Transaccion: 4,
    Fecha: '2026-02-08',
    Concepto: 'Inscripciones Conferencia Día Mundial de la Filosofía',
    Monto: 210.00,
    Contacto: 'Coordinación de Extensión Cultural',
    Estado: 'Completado',
    Accion_Pendiente: 'Publicar lista de participantes'
  },
  {
    ID_Transaccion: 5,
    Fecha: '2026-02-13',
    Concepto: 'Anticipo para Impresión de Boletines Filosóficos Marzo',
    Monto: -85.00,
    Contacto: 'Imprenta Clásica SA',
    Estado: 'Pendiente',
    Accion_Pendiente: 'Aprobar muestra de impresión'
  }
];

export const INITIAL_MORA: ReporteMora[] = [
  {
    ID_Mora: 1,
    Miembro_Aspirante: 'Carlos Eduardo Lemus',
    Saldo_Anterior: 0.00,
    Saldo_Actual: 50.00,
    Meses_En_Mora: 2,
    Detalle_Meses: '01-ENERO, 02-FEBRERO',
    Ultimo_Contacto: '2026-02-10',
    Estado_Gestion: 'En Negociación'
  },
  {
    ID_Mora: 2,
    Miembro_Aspirante: 'Fernando José Calderón',
    Saldo_Anterior: 25.00,
    Saldo_Actual: 85.00,
    Meses_En_Mora: 3,
    Detalle_Meses: '12-DICIEMBRE 2025, 01-ENERO, 02-FEBRERO',
    Ultimo_Contacto: '2026-02-04',
    Estado_Gestion: 'Notificado'
  },
  {
    ID_Mora: 3,
    Miembro_Aspirante: 'Lorena Ivette Carranza',
    Saldo_Anterior: 0.00,
    Saldo_Actual: 30.00,
    Meses_En_Mora: 1,
    Detalle_Meses: '02-FEBRERO',
    Ultimo_Contacto: '2026-02-12',
    Estado_Gestion: 'Sin Respuesta'
  },
  {
    ID_Mora: 4,
    Miembro_Aspirante: 'Rodrigo Antonio Morales',
    Saldo_Anterior: 30.00,
    Saldo_Actual: 60.00,
    Meses_En_Mora: 2,
    Detalle_Meses: '01-ENERO, 02-FEBRERO',
    Ultimo_Contacto: '2026-02-08',
    Estado_Gestion: 'En Negociación'
  }
];
