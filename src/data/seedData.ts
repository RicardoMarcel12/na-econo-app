import { Miembro, CuotaMembresia, MaterialClase, TransaccionOtro, ReporteMora } from '../types/models';

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
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const METODOS_PAGO_DEFAULT = [
  'Págala',
  'Transferencia',
  'Efectivo',
  'Depósito Bancario'
];

export const INITIAL_MIEMBROS: Miembro[] = [
  {
    ID_Miembro: 1,
    Miembro_Aspirante: 'Alejandro Mendoza Ortiz',
    Condicion: 'Miembro',
    DUI: '03456789-2',
    Celular: '7845-1234',
    Correo: 'alejandro.mendoza@email.com',
    Grupo_Horario: 'Introducción a la Filosofía - Mar/Jue 6:30 PM',
    Instructores: 'Prof. Roberto Valencia',
    Concepto_Pago: 'Cuota Mensual de Membresía',
    Cuota: 25.00,
    Fecha_Ingreso: '2025-03-15'
  },
  {
    ID_Miembro: 2,
    Miembro_Aspirante: 'Beatriz Elena Castaneda',
    Condicion: 'Miembro',
    DUI: '02891234-7',
    Celular: '7123-9845',
    Correo: 'beatriz.castaneda@email.com',
    Grupo_Horario: 'Filosofía de Oriente y Occidente - Mié 6:00 PM',
    Instructores: 'Lic. Claudia Solórzano',
    Concepto_Pago: 'Cuota Mensual de Membresía',
    Cuota: 30.00,
    Fecha_Ingreso: '2024-06-10'
  },
  {
    ID_Miembro: 3,
    Miembro_Aspirante: 'Carlos Eduardo Lemus',
    Condicion: 'Aspirante',
    DUI: '01984562-3',
    Celular: '7456-7890',
    Correo: 'carlos.lemus@email.com',
    Grupo_Horario: 'Ética y Moral Clásica - Sáb 9:00 AM',
    Instructores: 'Ing. Javier Arévalo',
    Concepto_Pago: 'Cuota de Aspirante',
    Cuota: 25.00,
    Fecha_Ingreso: '2025-10-01'
  },
  {
    ID_Miembro: 4,
    Miembro_Aspirante: 'Diana Marcela Henríquez',
    Condicion: 'Miembro Activo',
    DUI: '04561230-8',
    Celular: '7901-2345',
    Correo: 'diana.henriquez@email.com',
    Grupo_Horario: 'Psicología Holística y Simbolismo - Vie 6:30 PM',
    Instructores: 'Dra. Elena Monroy',
    Concepto_Pago: 'Cuota de Miembro Activo',
    Cuota: 35.00,
    Fecha_Ingreso: '2023-11-20'
  },
  {
    ID_Miembro: 5,
    Miembro_Aspirante: 'Ernesto Alonso Zavaleta',
    Condicion: 'Aspirante',
    DUI: '01874590-1',
    Celular: '7654-3210',
    Correo: 'ernesto.zavaleta@email.com',
    Grupo_Horario: 'Aspirantes de Primer Ingreso - Lun/Mié 7:00 PM',
    Instructores: 'Prof. Roberto Valencia',
    Concepto_Pago: 'Cuota de Aspirante',
    Cuota: 25.00,
    Fecha_Ingreso: '2026-01-15'
  },
  {
    ID_Miembro: 6,
    Miembro_Aspirante: 'Gabriela Sofía Rivas',
    Condicion: 'Miembro',
    DUI: '03789124-5',
    Celular: '7234-5678',
    Correo: 'gabriela.rivas@email.com',
    Grupo_Horario: 'Introducción a la Filosofía - Mar/Jue 6:30 PM',
    Instructores: 'Prof. Roberto Valencia',
    Concepto_Pago: 'Cuota Mensual de Membresía',
    Cuota: 25.00,
    Fecha_Ingreso: '2025-05-12'
  },
  {
    ID_Miembro: 7,
    Miembro_Aspirante: 'Hugo Mauricio Escalante',
    Condicion: 'Miembro',
    DUI: '02564178-9',
    Celular: '7789-0123',
    Correo: 'hugo.escalante@email.com',
    Grupo_Horario: 'Filosofía de Oriente y Occidente - Mié 6:00 PM',
    Instructores: 'Lic. Claudia Solórzano',
    Concepto_Pago: 'Cuota Mensual de Membresía',
    Cuota: 30.00,
    Fecha_Ingreso: '2024-09-01'
  },
  {
    ID_Miembro: 8,
    Miembro_Aspirante: 'Karla Patricia Moran',
    Condicion: 'Miembro',
    DUI: '04123890-4',
    Celular: '7567-8901',
    Correo: 'karla.moran@email.com',
    Grupo_Horario: 'Ética y Moral Clásica - Sáb 9:00 AM',
    Instructores: 'Ing. Javier Arévalo',
    Concepto_Pago: 'Cuota Mensual de Membresía',
    Cuota: 25.00,
    Fecha_Ingreso: '2025-02-18'
  },
  {
    ID_Miembro: 9,
    Miembro_Aspirante: 'Fernando José Calderón',
    Condicion: 'Miembro',
    DUI: '03901234-6',
    Celular: '7345-6789',
    Correo: 'fernando.calderon@email.com',
    Grupo_Horario: 'Introducción a la Filosofía - Mar/Jue 6:30 PM',
    Instructores: 'Prof. Roberto Valencia',
    Concepto_Pago: 'Cuota Mensual de Membresía',
    Cuota: 25.00,
    Fecha_Ingreso: '2024-11-05'
  },
  {
    ID_Miembro: 10,
    Miembro_Aspirante: 'Lorena Ivette Carranza',
    Condicion: 'Miembro',
    DUI: '02678901-3',
    Celular: '7890-1234',
    Correo: 'lorena.carranza@email.com',
    Grupo_Horario: 'Filosofía de Oriente y Occidente - Mié 6:00 PM',
    Instructores: 'Lic. Claudia Solórzano',
    Concepto_Pago: 'Cuota Mensual de Membresía',
    Cuota: 30.00,
    Fecha_Ingreso: '2025-04-20'
  },
  {
    ID_Miembro: 11,
    Miembro_Aspirante: 'Rodrigo Antonio Morales',
    Condicion: 'Miembro',
    DUI: '03123456-9',
    Celular: '7012-3456',
    Correo: 'rodrigo.morales@email.com',
    Grupo_Horario: 'Ética y Moral Clásica - Sáb 9:00 AM',
    Instructores: 'Ing. Javier Arévalo',
    Concepto_Pago: 'Cuota Mensual de Membresía',
    Cuota: 30.00,
    Fecha_Ingreso: '2024-08-14'
  }
];

export const INITIAL_CUOTAS: CuotaMembresia[] = [
  {
    ID_Registro: 1,
    Miembro_Aspirante: 'Alejandro Mendoza Ortiz',
    DUI: '03456789-2',
    Grupo_Horario: 'Introducción a la Filosofía - Mar/Jue 6:30 PM',
    Mes_Pagado: 'Febrero',
    Monto_Cuota: 25.00,
    Fecha_Pago: '2026-02-05',
    Metodo_Pago: 'Págala',
    Referencia: 'PAG-2026-9012'
  },
  {
    ID_Registro: 2,
    Miembro_Aspirante: 'Beatriz Elena Castaneda',
    DUI: '02891234-7',
    Grupo_Horario: 'Filosofía de Oriente y Occidente - Mié 6:00 PM',
    Mes_Pagado: 'Febrero',
    Monto_Cuota: 30.00,
    Fecha_Pago: '2026-02-06',
    Metodo_Pago: 'Transferencia',
    Referencia: 'TRF-BAC-48190'
  },
  {
    ID_Registro: 3,
    Miembro_Aspirante: 'Carlos Eduardo Lemus',
    DUI: '01984562-3',
    Grupo_Horario: 'Ética y Moral Clásica - Sáb 9:00 AM',
    Mes_Pagado: 'Enero',
    Monto_Cuota: 25.00,
    Fecha_Pago: '2026-01-28',
    Metodo_Pago: 'Efectivo',
    Referencia: 'REC-00412'
  },
  {
    ID_Registro: 4,
    Miembro_Aspirante: 'Diana Marcela Henríquez',
    DUI: '04561230-8',
    Grupo_Horario: 'Psicología Holística y Simbolismo - Vie 6:30 PM',
    Mes_Pagado: 'Febrero',
    Monto_Cuota: 35.00,
    Fecha_Pago: '2026-02-07',
    Metodo_Pago: 'Págala',
    Referencia: 'PAG-2026-9045'
  },
  {
    ID_Registro: 5,
    Miembro_Aspirante: 'Ernesto Alonso Zavaleta',
    DUI: '01874590-1',
    Grupo_Horario: 'Aspirantes de Primer Ingreso - Lun/Mié 7:00 PM',
    Mes_Pagado: 'Febrero',
    Monto_Cuota: 25.00,
    Fecha_Pago: '2026-02-10',
    Metodo_Pago: 'Depósito Bancario',
    Referencia: 'DEP-CUSC-7712'
  },
  {
    ID_Registro: 6,
    Miembro_Aspirante: 'Gabriela Sofía Rivas',
    DUI: '03789124-5',
    Grupo_Horario: 'Introducción a la Filosofía - Mar/Jue 6:30 PM',
    Mes_Pagado: 'Febrero',
    Monto_Cuota: 25.00,
    Fecha_Pago: '2026-02-11',
    Metodo_Pago: 'Págala',
    Referencia: 'PAG-2026-9088'
  },
  {
    ID_Registro: 7,
    Miembro_Aspirante: 'Hugo Mauricio Escalante',
    DUI: '02564178-9',
    Grupo_Horario: 'Filosofía de Oriente y Occidente - Mié 6:00 PM',
    Mes_Pagado: 'Febrero',
    Monto_Cuota: 30.00,
    Fecha_Pago: '2026-02-12',
    Metodo_Pago: 'Transferencia',
    Referencia: 'TRF-AGR-10924'
  },
  {
    ID_Registro: 8,
    Miembro_Aspirante: 'Karla Patricia Moran',
    DUI: '04123890-4',
    Grupo_Horario: 'Ética y Moral Clásica - Sáb 9:00 AM',
    Mes_Pagado: 'Febrero',
    Monto_Cuota: 25.00,
    Fecha_Pago: '2026-02-14',
    Metodo_Pago: 'Efectivo',
    Referencia: 'REC-00418'
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
    Accion_Pendiente: 'Archivar factura fiscal'
  },
  {
    ID_Transaccion: 3,
    Fecha: '2026-02-05',
    Concepto: 'Reparación e Iluminación Sede Aula Magna',
    Monto: -65.00,
    Contacto: 'Técnico Manuel Ayala',
    Estado: 'Completado',
    Accion_Pendiente: 'Garantía 6 meses recibida'
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
    Detalle_Meses: 'Enero, Febrero',
    Ultimo_Contacto: '2026-02-10',
    Estado_Gestion: 'En Negociación'
  },
  {
    ID_Mora: 2,
    Miembro_Aspirante: 'Fernando José Calderón',
    Saldo_Anterior: 25.00,
    Saldo_Actual: 85.00,
    Meses_En_Mora: 3,
    Detalle_Meses: 'Diciembre 2025, Enero, Febrero',
    Ultimo_Contacto: '2026-02-04',
    Estado_Gestion: 'Notificado'
  },
  {
    ID_Mora: 3,
    Miembro_Aspirante: 'Lorena Ivette Carranza',
    Saldo_Anterior: 0.00,
    Saldo_Actual: 30.00,
    Meses_En_Mora: 1,
    Detalle_Meses: 'Febrero',
    Ultimo_Contacto: '2026-02-12',
    Estado_Gestion: 'Sin Respuesta'
  },
  {
    ID_Mora: 4,
    Miembro_Aspirante: 'Rodrigo Antonio Morales',
    Saldo_Anterior: 30.00,
    Saldo_Actual: 60.00,
    Meses_En_Mora: 2,
    Detalle_Meses: 'Enero, Febrero',
    Ultimo_Contacto: '2026-02-08',
    Estado_Gestion: 'En Negociación'
  }
];
