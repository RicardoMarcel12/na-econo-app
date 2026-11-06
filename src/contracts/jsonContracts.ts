/**
 * JSON Schema Draft-07 & Centralized Database Backend API Contracts
 * Tailored for 'App Economia NA' (Escuela de Filosofía)
 * Based on data_dictionary_8d3f0ef8.md
 */

export const MiembroSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Miembro",
  description: "Contrato JSON para el registro maestro de miembros y aspirantes con sus datos inmutables (Escuela de Filosofía Nueva Acrópolis).",
  type: "object",
  required: [
    "ID_Miembro",
    "Miembro_Aspirante",
    "Estatus",
    "DUI",
    "Celular",
    "Correo",
    "Cuota"
  ],
  properties: {
    ID_Miembro: {
      type: "integer",
      minimum: 1,
      description: "Identificador único autoincremental del miembro."
    },
    Miembro_Aspirante: {
      type: "string",
      minLength: 3,
      maxLength: 150,
      description: "Nombre completo del estudiante o miembro."
    },
    Estatus: {
      type: "string",
      description: "Estatus del catálogo institucional que sustituye la condición (ej. 01-J.F., 02-F.F.V.V., 03-Miembro, 04-Probacionista, 05-Inscrito, 06-Ficha llena, 98-Sospecha de retiro, 99-Retirado)."
    },
    DUI: {
      type: "string",
      pattern: "^[0-9]{8}-[0-9]$",
      description: "Documento Único de Identidad salvadoreño (00000000-0)."
    },
    Celular: {
      type: "string",
      minLength: 8,
      maxLength: 20,
      description: "Número de teléfono celular o WhatsApp."
    },
    Correo: {
      type: "string",
      format: "email",
      description: "Correo electrónico institucional o personal."
    },
    Grupo_Horario: {
      type: "string",
      description: "Grupo y horario asignado al miembro."
    },
    Instructores: {
      type: "string",
      description: "Nombre del instructor o instructores asignados."
    },
    Concepto_Pago: {
      type: "string",
      description: "Concepto de pago predeterminado (ej. Cuota Mensual de Membresía)."
    },
    Cuota: {
      type: "number",
      exclusiveMinimum: 0.0,
      description: "Monto base mensual de la cuota en dólares (USD)."
    },
    Fecha_Ingreso: {
      type: "string",
      format: "date",
      description: "Fecha de ingreso a la escuela (YYYY-MM-DD)."
    }
  },
  additionalProperties: false
};

export const CuotaMembresiaSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "CuotaMembresia",
  description: "Contrato JSON para el registro principal de cuotas mensuales de miembros o aspirantes (Escuela de Filosofía Nueva Acrópolis).",
  type: "object",
  required: [
    "ID_Registro",
    "Miembro_Aspirante",
    "Grupo_Horario",
    "Mes_Pagado",
    "Monto_Cuota",
    "Fecha_Pago",
    "Metodo_Pago"
  ],
  properties: {
    ID_Registro: {
      type: "integer",
      minimum: 1,
      description: "Identificador único autoincremental del pago (Llave Primaria)."
    },
    Miembro_Aspirante: {
      type: "string",
      minLength: 3,
      maxLength: 150,
      pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s.]+$",
      description: "Nombre completo del estudiante o aspirante (sin caracteres especiales extraños)."
    },
    DUI: {
      type: "string",
      pattern: "^[0-9]{8}-[0-9]$",
      description: "Documento Único de Identidad salvadoreño en formato estándar 00000000-0."
    },
    Grupo_Horario: {
      type: "string",
      minLength: 2,
      description: "Grupo de estudio asignado (ej: 'Introducción a la Filosofía - Mar/Jue 6:30 PM')."
    },
    Mes_Pagado: {
      type: "string",
      enum: [
        "01-ENERO", "02-FEBRERO", "03-MARZO", "04-ABRIL", "05-MAYO", "06-JUNIO",
        "07-JULIO", "08-AGOSTO", "09-SEPTIEMBRE", "10-OCTUBRE", "11-NOVIEMBRE", "12-DICIEMBRE",
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ],
      description: "Mes calendario que cubre la cuota en formato '01-ENERO', '02-FEBRERO', etc."
    },
    Monto_Cuota: {
      type: "number",
      exclusiveMinimum: 0.0,
      description: "Cantidad abonada en la transacción (mayor a 0.00)."
    },
    Fecha_Pago: {
      type: "string",
      format: "date",
      pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
      description: "Fecha en que se realizó el abono (YYYY-MM-DD)."
    },
    Metodo_Pago: {
      type: "string",
      enum: ["Págala", "Transferencia", "Efectivo", "Depósito Bancario", "Cheque", "Tarjeta"],
      description: "Plataforma o canal de pago utilizado."
    },
    Referencia: {
      type: "string",
      maxLength: 100,
      description: "Número de comprobante, ticket o transacción bancaria."
    }
  },
  additionalProperties: false
};

export const MaterialClaseSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "MaterialClase",
  description: "Contrato JSON para el seguimiento de adquisición y entrega de libros, manuales y materiales de estudio.",
  type: "object",
  required: [
    "ID_Material_Log",
    "Miembro_Aspirante",
    "Materia_Articulo",
    "Monto",
    "Fecha_Solicitud",
    "Estado_Pago",
    "Estado_Entrega"
  ],
  properties: {
    ID_Material_Log: {
      type: "integer",
      minimum: 1,
      description: "Identificador único del registro de material (Llave Primaria)."
    },
    Miembro_Aspirante: {
      type: "string",
      minLength: 3,
      maxLength: 150,
      description: "Nombre completo del estudiante (debe coincidir con membresías)."
    },
    Materia_Articulo: {
      type: "string",
      minLength: 2,
      maxLength: 200,
      description: "Nombre o descripción del libro, manual o artículo."
    },
    Monto: {
      type: "number",
      minimum: 0.0,
      description: "Costo o precio del material (mayor o igual a 0.00)."
    },
    Fecha_Solicitud: {
      type: "string",
      format: "date",
      pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
      description: "Fecha en que el miembro requirió el material (YYYY-MM-DD)."
    },
    Estado_Pago: {
      type: "string",
      enum: ["Pagado", "Pendiente"],
      description: "Estatus financiero del material."
    },
    Estado_Entrega: {
      type: "string",
      enum: ["Entregado", "En Tránsito", "Pendiente"],
      description: "Estatus físico del libro o material."
    }
  },
  additionalProperties: false
};

export const TransaccionOtroSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "TransaccionOtro",
  description: "Contrato JSON para la bitácora de transacciones misceláneas, talleres, conferencias o gastos de sede.",
  type: "object",
  required: [
    "ID_Transaccion",
    "Fecha",
    "Concepto",
    "Monto",
    "Estado"
  ],
  properties: {
    ID_Transaccion: {
      type: "integer",
      minimum: 1,
      description: "Identificador único de la transacción miscelánea (Llave Primaria)."
    },
    Fecha: {
      type: "string",
      format: "date",
      pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
      description: "Fecha del evento o transacción (YYYY-MM-DD)."
    },
    Concepto: {
      type: "string",
      minLength: 3,
      maxLength: 250,
      description: "Motivo descriptivo del ingreso o gasto."
    },
    Monto: {
      type: "number",
      description: "Cantidad monetaria (positivo para ingresos, negativo para egresos/gastos)."
    },
    Contacto: {
      type: "string",
      maxLength: 150,
      description: "Persona, proveedor o responsable involucrado."
    },
    Estado: {
      type: "string",
      enum: ["Completado", "Pendiente", "Anulado"],
      description: "Estatus contable de la transacción."
    },
    Accion_Pendiente: {
      type: "string",
      maxLength: 250,
      description: "Siguiente paso a realizar (ej: 'Enviar recibo a donante', 'Archivar comprobante')."
    },
    Archivos: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          nombre: { type: "string" },
          tamano: { type: "number" },
          tipo: { type: "string" },
          dataUrl: { type: "string" },
          fechaSubida: { type: "string" }
        }
      },
      description: "Archivos adjuntos a la transacción (recibos, facturas, contratos, etc.)"
    }
  },
  additionalProperties: false
};

export const ReporteMoraSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "ReporteMora",
  description: "Contrato JSON para el tablero de seguimiento y cobro de miembros con cuotas atrasadas.",
  type: "object",
  required: [
    "ID_Mora",
    "Miembro_Aspirante",
    "Saldo_Anterior",
    "Saldo_Actual",
    "Meses_En_Mora",
    "Detalle_Meses",
    "Estado_Gestion"
  ],
  properties: {
    ID_Mora: {
      type: "integer",
      minimum: 1,
      description: "Identificador único del reporte de mora (Llave Primaria)."
    },
    Miembro_Aspirante: {
      type: "string",
      minLength: 3,
      maxLength: 150,
      description: "Nombre del miembro o aspirante en atraso."
    },
    Saldo_Anterior: {
      type: "number",
      minimum: 0.0,
      default: 0.0,
      description: "Deuda acumulada de periodos o años anteriores."
    },
    Saldo_Actual: {
      type: "number",
      minimum: 0.0,
      description: "Deuda total consolidada al momento del corte."
    },
    Meses_En_Mora: {
      type: "integer",
      minimum: 1,
      description: "Cantidad de meses consecutivos o alternos sin pago."
    },
    Detalle_Meses: {
      type: "string",
      description: "Meses específicos adeudados (ej: 'Enero, Febrero')."
    },
    Ultimo_Contacto: {
      type: "string",
      format: "date",
      pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
      description: "Fecha del último intento o contacto de gestión de cobro (YYYY-MM-DD)."
    },
    Estado_Gestion: {
      type: "string",
      enum: ["Notificado", "En Negociación", "Sin Respuesta"],
      description: "Estatus de la gestión de cobro del área de economía."
    }
  },
  additionalProperties: false
};

export const HorarioClaseSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "HorarioClase",
  description: "Contrato JSON para el catálogo de Horarios de Clase [dia, hora inicio, hora fin] con días restringidos de Lunes a Sábado.",
  type: "object",
  required: [
    "ID_Horario",
    "Dia",
    "Hora_Inicio",
    "Hora_Fin"
  ],
  properties: {
    ID_Horario: {
      type: "integer",
      minimum: 1,
      description: "Identificador único autoincremental del horario."
    },
    Dia: {
      type: "string",
      enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      description: "Día de la semana lectivo institucional (Lunes a Sábado)."
    },
    Hora_Inicio: {
      type: "string",
      pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
      description: "Hora de inicio en formato militar 24h (HH:mm)."
    },
    Hora_Fin: {
      type: "string",
      pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
      description: "Hora de finalización en formato militar 24h (HH:mm)."
    }
  },
  additionalProperties: false
};

export const InstructorSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Instructor",
  description: "Contrato JSON para el catálogo de Instructores [id, nombre completo, ESTATUS] con relación al Catálogo de Estatus.",
  type: "object",
  required: [
    "ID_Instructor",
    "Nombre_Completo",
    "Estatus"
  ],
  properties: {
    ID_Instructor: {
      type: "integer",
      minimum: 1,
      description: "Identificador único autoincremental del instructor."
    },
    Nombre_Completo: {
      type: "string",
      minLength: 3,
      maxLength: 150,
      description: "Nombre y apellidos completos del instructor o docente."
    },
    Estatus: {
      type: "string",
      minLength: 2,
      description: "Estatus institucional del instructor relacionado con el catálogo de estatus (ej: 01-J.F., 02-F.F.V.V.)."
    }
  },
  additionalProperties: false
};

export const GrupoClaseSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "GrupoClase",
  description: "Contrato JSON para el catálogo de Grupos de Clase [id, numero de grupo, HORARIO, INSTRUCTOR] vinculando llaves foráneas relacionales.",
  type: "object",
  required: [
    "ID_Grupo",
    "Numero_Grupo",
    "ID_Horario",
    "ID_Instructor"
  ],
  properties: {
    ID_Grupo: {
      type: "integer",
      minimum: 1,
      description: "Identificador único autoincremental del grupo de clase."
    },
    Numero_Grupo: {
      type: "string",
      minLength: 2,
      maxLength: 100,
      description: "Código o denominación del grupo (ej: 'G-01 Introducción a la Filosofía')."
    },
    ID_Horario: {
      type: "integer",
      minimum: 1,
      description: "Llave foránea hacia el catálogo de HORARIOS (ID_Horario)."
    },
    ID_Instructor: {
      type: "integer",
      minimum: 1,
      description: "Llave foránea hacia el catálogo de INSTRUCTORES (ID_Instructor)."
    }
  },
  additionalProperties: false
};

export const CatalogoEstatusSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "CatalogoEstatus",
  description: "Contrato JSON para las insignias del catálogo institucional de estatus (regla: prefijo 9 inactivo, otros activos; colores ROYGBIV y verdes escala 11+).",
  type: "object",
  required: [
    "codigo",
    "nombre",
    "es_activo"
  ],
  properties: {
    codigo: {
      type: "string",
      pattern: "^[0-9]{2}$",
      description: "Código numérico de dos dígitos (ej: '01', '02', '03', '11', '98', '99')."
    },
    nombre: {
      type: "string",
      minLength: 3,
      description: "Denominación completa del estatus (ej: '01-J.F.', '03-Miembro', '99-Retirado')."
    },
    es_activo: {
      type: "boolean",
      description: "Indica si el estatus se considera activo (los que inician con 9 son inactivos)."
    },
    color_familia: {
      type: "string",
      description: "Familia cromática asignada: Violeta (01), Índigo/Azul/Cian (02-06), Verde descendente (10-19), Rojo (90-99)."
    }
  },
  additionalProperties: false
};

export const CentralDatabaseSyncPayloadSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "CentralDatabaseSyncPayload",
  description: "Contrato consolidado para sincronización completa de todos los módulos y catálogos de la sede con la base de datos central.",
  type: "object",
  required: [
    "version",
    "sede",
    "fecha_sincronizacion",
    "miembros",
    "cuotas",
    "materiales",
    "otros",
    "mora",
    "catalogoEstatus",
    "horarios",
    "instructores",
    "grupos"
  ],
  properties: {
    version: { type: "string", enum: ["1.0.0", "2.0.0"] },
    sede: { type: "string", default: "Nueva Acrópolis - San Salvador" },
    fecha_sincronizacion: { type: "string", format: "date-time" },
    miembros: {
      type: "array",
      items: MiembroSchema
    },
    cuotas: {
      type: "array",
      items: CuotaMembresiaSchema
    },
    materiales: {
      type: "array",
      items: MaterialClaseSchema
    },
    otros: {
      type: "array",
      items: TransaccionOtroSchema
    },
    mora: {
      type: "array",
      items: ReporteMoraSchema
    },
    catalogoEstatus: {
      type: "array",
      items: { type: "string" }
    },
    horarios: {
      type: "array",
      items: HorarioClaseSchema
    },
    instructores: {
      type: "array",
      items: InstructorSchema
    },
    grupos: {
      type: "array",
      items: GrupoClaseSchema
    }
  }
};

/**
 * REST API Endpoints Specification for Centralized Database Backend
 */
export interface EndpointDoc {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  modulo: string;
  summary: string;
  description: string;
  requestBodySchemaName?: string;
  responseSchemaName: string;
  samplePayload: any;
}

export const CENTRAL_API_ENDPOINTS: EndpointDoc[] = [
  // Módulo 0: Catálogos Relacionales (Horarios, Instructores, Grupos, Estatus)
  {
    method: 'GET',
    path: '/api/v1/catalogos/horarios',
    modulo: 'Catálogos - Horarios',
    summary: 'Listar catálogo de horarios de clase',
    description: 'Devuelve todos los horarios lectivos registrados [dia, hora inicio, hora fin] restringidos a Lunes-Sábado.',
    responseSchemaName: 'Array<HorarioClase>',
    samplePayload: {
      total: 6,
      items: [
        { ID_Horario: 1, Dia: "Martes", Hora_Inicio: "18:30", Hora_Fin: "20:30" },
        { ID_Horario: 4, Dia: "Sábado", Hora_Inicio: "09:00", Hora_Fin: "12:00" }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/v1/catalogos/horarios',
    modulo: 'Catálogos - Horarios',
    summary: 'Crear o registrar nuevo horario de clase',
    description: 'Inserta un nuevo bloque lectivo en el catálogo de horarios validando día y formato 24h de horas.',
    requestBodySchemaName: 'HorarioClaseSchema',
    responseSchemaName: '{ success: true, ID_Horario: 7 }',
    samplePayload: {
      Dia: "Lunes",
      Hora_Inicio: "19:00",
      Hora_Fin: "21:00"
    }
  },
  {
    method: 'GET',
    path: '/api/v1/catalogos/instructores',
    modulo: 'Catálogos - Instructores',
    summary: 'Listar catálogo de instructores',
    description: 'Retorna la lista de docentes e instructores con su estatus institucional vinculado.',
    responseSchemaName: 'Array<Instructor>',
    samplePayload: {
      total: 4,
      items: [
        { ID_Instructor: 1, Nombre_Completo: "Prof. Roberto Valencia", Estatus: "01-J.F." },
        { ID_Instructor: 2, Nombre_Completo: "Lic. Claudia Solórzano", Estatus: "02-F.F.V.V." }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/v1/catalogos/instructores',
    modulo: 'Catálogos - Instructores',
    summary: 'Registrar nuevo instructor',
    description: 'Crea un instructor con ID autoincremental y valida que su estatus pertenezca al catálogo institucional.',
    requestBodySchemaName: 'InstructorSchema',
    responseSchemaName: '{ success: true, ID_Instructor: 5 }',
    samplePayload: {
      Nombre_Completo: "Dr. Fernando Morales",
      Estatus: "02-F.F.V.V."
    }
  },
  {
    method: 'GET',
    path: '/api/v1/catalogos/grupos',
    modulo: 'Catálogos - Grupos',
    summary: 'Listar grupos de clase con relaciones',
    description: 'Devuelve los grupos de estudio vinculando las llaves foráneas ID_Horario e ID_Instructor.',
    responseSchemaName: 'Array<GrupoClase>',
    samplePayload: {
      total: 5,
      items: [
        { ID_Grupo: 1, Numero_Grupo: "G-01 Introducción a la Filosofía", ID_Horario: 1, ID_Instructor: 1 },
        { ID_Grupo: 2, Numero_Grupo: "G-02 Filosofía de Oriente y Occidente", ID_Horario: 3, ID_Instructor: 2 }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/v1/catalogos/grupos',
    modulo: 'Catálogos - Grupos',
    summary: 'Registrar nuevo grupo de clase',
    description: 'Inserta un nuevo grupo verificando la existencia previa de su HORARIO e INSTRUCTOR (con soporte para creación en cascada).',
    requestBodySchemaName: 'GrupoClaseSchema',
    responseSchemaName: '{ success: true, ID_Grupo: 6 }',
    samplePayload: {
      Numero_Grupo: "G-06 Historia de la Filosofía Antigua",
      ID_Horario: 2,
      ID_Instructor: 1
    }
  },
  {
    method: 'GET',
    path: '/api/v1/catalogos/estatus',
    modulo: 'Catálogos - Estatus',
    summary: 'Listar catálogo oficial de estatus',
    description: 'Devuelve los estatus institucionales con cálculo de actividad (códigos que comienzan con 9 son inactivos; colores ROYGBIV).',
    responseSchemaName: 'Array<CatalogoEstatusItem>',
    samplePayload: {
      estatus: [
        { codigo: "01", nombre: "01-J.F.", es_activo: true, color: "Violeta" },
        { codigo: "02", nombre: "02-F.F.V.V.", es_activo: true, color: "Índigo" },
        { codigo: "03", nombre: "03-Miembro", es_activo: true, color: "Azul" },
        { codigo: "99", nombre: "99-Retirado", es_activo: false, color: "Rojo" }
      ]
    }
  },
  // Módulo 1: Miembros
  {
    method: 'GET',
    path: '/api/v1/miembros',
    modulo: 'Miembros',
    summary: 'Listar miembros y aspirantes',
    description: 'Devuelve el padrón maestro de miembros con DUI, celular, correo, grupo/horario e instructores.',
    responseSchemaName: 'Array<Miembro>',
    samplePayload: {
      total: 12,
      pagina: 1,
      limite: 50
    }
  },
  {
    method: 'POST',
    path: '/api/v1/miembros',
    modulo: 'Miembros',
    summary: 'Registrar nuevo miembro o aspirante',
    description: 'Crea un miembro validando formato salvadoreño de DUI, correo y exención de grupo/instructores para estatus 01 y 02.',
    requestBodySchemaName: 'MiembroSchema',
    responseSchemaName: '{ success: true, ID_Miembro: 13 }',
    samplePayload: {
      Miembro_Aspirante: "Beatriz Elena Castaneda",
      Estatus: "01-J.F.",
      DUI: "02891234-7",
      Celular: "7123-9845",
      Correo: "beatriz.castaneda@email.com",
      Grupo_Horario: "",
      Instructores: "",
      Cuota: 30.0
    }
  },
  // Módulo 2: Cuotas de Membresía
  {
    method: 'GET',
    path: '/api/v1/cuotas',
    modulo: 'Cuotas',
    summary: 'Listar pagos de cuotas de membresía',
    description: 'Devuelve los comprobantes de cuotas con meses estandarizados en formato 01-ENERO a 12-DICIEMBRE.',
    responseSchemaName: 'Array<CuotaMembresia>',
    samplePayload: {
      filtros: { mes: '10-OCTUBRE', grupo: 'G-01 Introducción a la Filosofía' },
      limite: 50,
      pagina: 1
    }
  },
  {
    method: 'POST',
    path: '/api/v1/cuotas',
    modulo: 'Cuotas',
    summary: 'Registrar pago de cuota mensual',
    description: 'Registra un pago de cuota con cálculo automático del mes a abonar (más antiguo si hay mora o siguiente si está solvente).',
    requestBodySchemaName: 'CuotaMembresiaSchema',
    responseSchemaName: '{ success: true, ID_Registro: 101, timestamp: string }',
    samplePayload: {
      ID_Registro: 101,
      Miembro_Aspirante: "Alejandro Mendoza Ortiz",
      DUI: "03456789-2",
      Grupo_Horario: "G-01 Introducción a la Filosofía — Martes 18:30 a 20:30",
      Mes_Pagado: "10-OCTUBRE",
      Monto_Cuota: 25.0,
      Fecha_Pago: "2026-10-28",
      Metodo_Pago: "Págala",
      Referencia: "PAG-1001-2026"
    }
  },
  // Módulo 3: Materiales y Libros de Clase
  {
    method: 'GET',
    path: '/api/v1/materiales',
    modulo: 'Materiales',
    summary: 'Listar registros de materiales y libros',
    description: 'Retorna el catálogo de libros, manuales y materiales solicitados con estados de pago y entrega.',
    responseSchemaName: 'Array<MaterialClase>',
    samplePayload: {
      total: 24,
      items: [
        { ID_Material_Log: 1, Miembro_Aspirante: "Gabriela Sofía Rivas", Materia_Articulo: "Libro: El Banquete", Monto: 18.5, Estado_Pago: "Pagado", Estado_Entrega: "Entregado" }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/v1/materiales',
    modulo: 'Materiales',
    summary: 'Registrar solicitud de material / libro',
    description: 'Crea un registro de pedido de libro, uniforme o material de estudio para un miembro.',
    requestBodySchemaName: 'MaterialClaseSchema',
    responseSchemaName: '{ success: true, ID_Material_Log: 42 }',
    samplePayload: {
      ID_Material_Log: 42,
      Miembro_Aspirante: "Gabriela Sofía Rivas",
      Materia_Articulo: "Libro: El Banquete de Platón (Ed. Crítica)",
      Monto: 18.5,
      Fecha_Solicitud: "2026-02-10",
      Estado_Pago: "Pagado",
      Estado_Entrega: "Entregado"
    }
  },
  // Módulo 4: Otros (Transacciones Misceláneas con Archivos)
  {
    method: 'GET',
    path: '/api/v1/otros',
    modulo: 'Otros',
    summary: 'Listar transacciones misceláneas y adjuntos',
    description: 'Retorna bitácora de ingresos/egresos extraordinarios con lista de archivos subidos.',
    responseSchemaName: 'Array<TransaccionOtro>',
    samplePayload: {
      total: 18,
      items: [
        { ID_Transaccion: 1, Fecha: "2026-02-12", Concepto: "Taller Filosofía", Monto: 120.0, Estado: "Completado", Archivos: [] }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/v1/otros',
    modulo: 'Otros',
    summary: 'Registrar transacción miscelánea con archivos adjuntos',
    description: 'Registra un ingreso o gasto con soporte para adjuntar uno o más archivos codificados (recibos, facturas).',
    requestBodySchemaName: 'TransaccionOtroSchema',
    responseSchemaName: '{ success: true, ID_Transaccion: 88 }',
    samplePayload: {
      ID_Transaccion: 88,
      Fecha: "2026-02-12",
      Concepto: "Aporte Taller de Filosofía Oriental",
      Monto: 120.0,
      Contacto: "Prof. Roberto Valencia",
      Estado: "Completado",
      Accion_Pendiente: "Emitir constancia de participación",
      Archivos: [
        { id: "f-1", nombre: "recibo_donacion.pdf", tamano: 245000, tipo: "application/pdf", fechaSubida: "2026-02-12" }
      ]
    }
  },
  // Módulo 5: Mora
  {
    method: 'GET',
    path: '/api/v1/mora',
    modulo: 'Mora',
    summary: 'Consultar cartera de miembros en mora',
    description: 'Obtiene el tablero de miembros con cuotas atrasadas, saldo actual y detalle de meses pendientes.',
    responseSchemaName: 'Array<ReporteMora>',
    samplePayload: {
      total: 12,
      cartera_pendiente: 325.0
    }
  },
  {
    method: 'POST',
    path: '/api/v1/mora/reconciliar',
    modulo: 'Mora',
    summary: 'Reconciliar estado de mora con nuevo pago',
    description: 'Amortiza o actualiza el saldo de un estudiante en mora al registrar un pago en cuotas.',
    requestBodySchemaName: '{ Miembro_Aspirante: string, Mes_Amortizado: string, Monto_Abonado: number }',
    responseSchemaName: '{ ID_Mora: number, Nuevo_Saldo: number, Estado_Actualizado: string }',
    samplePayload: {
      Miembro_Aspirante: "Carlos Eduardo Lemus",
      Mes_Amortizado: "01-ENERO",
      Monto_Abonado: 25.0
    }
  },
  {
    method: 'GET',
    path: '/api/v1/mora/stats',
    modulo: 'Mora',
    summary: 'Cálculo en tiempo real de categorías de mora',
    description: 'Calcula en tiempo real desde el backend la distribución analítica de miembros en: Solventes, Mora Pequeña (<3 meses) y 3 Meses o Más.',
    responseSchemaName: '{ solventes: MoraCategoryStats, mora_pequena: MoraCategoryStats, mora_3_mas: MoraCategoryStats, total_miembros: number }',
    samplePayload: {
      total_miembros: 48,
      total_cartera_mora: 225.0,
      solventes: { count: 36, porcentaje: 75 },
      mora_pequena: { count: 8, porcentaje: 17, total_deuda: 110.0 },
      mora_3_mas: { count: 4, porcentaje: 8, total_deuda: 115.0 }
    }
  },
  // Sincronización Central Lote
  {
    method: 'POST',
    path: '/api/v1/sync/central-database',
    modulo: 'Sincronización Central',
    summary: 'Sincronización masiva con Base de Datos Central',
    description: 'Envía un lote consolidado de todos los módulos y catálogos de la sede para respaldar en la base de datos central.',
    requestBodySchemaName: 'CentralDatabaseSyncPayloadSchema',
    responseSchemaName: '{ status: "synced", registros_procesados: 165, hash: "a8f3b9c..." }',
    samplePayload: {
      version: "2.0.0",
      sede: "Nueva Acrópolis - San Salvador",
      fecha_sincronizacion: "2026-11-06T18:30:00Z",
      miembros_count: 12,
      cuotas_count: 100,
      materiales_count: 24,
      otros_count: 18,
      mora_count: 12,
      horarios_count: 6,
      instructores_count: 4,
      grupos_count: 5,
      catalogoEstatus_count: 8
    }
  }
];

export type SchemaValidationType =
  | 'miembros'
  | 'cuotas'
  | 'materiales'
  | 'otros'
  | 'mora'
  | 'horarios'
  | 'instructores'
  | 'grupos'
  | 'estatus';

/**
 * In-browser Schema Validator for Contract verification across all modules & catalogs
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEntityPayload(schemaType: SchemaValidationType, item: any): ValidationResult {
  const errors: string[] = [];

  if (!item || typeof item !== 'object') {
    return { valid: false, errors: ['El objeto de datos es nulo o no es un objeto válido.'] };
  }

  if (schemaType === 'horarios') {
    if (typeof item.ID_Horario !== 'number' || item.ID_Horario < 1) {
      errors.push('ID_Horario debe ser un número entero mayor o igual a 1.');
    }
    const diasValidos = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    if (!item.Dia || !diasValidos.includes(item.Dia)) {
      errors.push(`Dia inválido ("${item.Dia}"). Debe ser uno de: ${diasValidos.join(', ')}.`);
    }
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!item.Hora_Inicio || !timeRegex.test(item.Hora_Inicio)) {
      errors.push('Hora_Inicio debe tener formato válido de 24 horas (HH:mm).');
    }
    if (!item.Hora_Fin || !timeRegex.test(item.Hora_Fin)) {
      errors.push('Hora_Fin debe tener formato válido de 24 horas (HH:mm).');
    }
  } else if (schemaType === 'instructores') {
    if (typeof item.ID_Instructor !== 'number' || item.ID_Instructor < 1) {
      errors.push('ID_Instructor debe ser un número entero mayor o igual a 1.');
    }
    if (!item.Nombre_Completo || typeof item.Nombre_Completo !== 'string' || item.Nombre_Completo.trim().length < 3) {
      errors.push('Nombre_Completo es requerido y debe tener al menos 3 caracteres.');
    }
    if (!item.Estatus || typeof item.Estatus !== 'string' || item.Estatus.trim().length < 2) {
      errors.push('Estatus es requerido y debe corresponder a un código institucional del catálogo.');
    }
  } else if (schemaType === 'grupos') {
    if (typeof item.ID_Grupo !== 'number' || item.ID_Grupo < 1) {
      errors.push('ID_Grupo debe ser un número entero mayor o igual a 1.');
    }
    if (!item.Numero_Grupo || typeof item.Numero_Grupo !== 'string' || item.Numero_Grupo.trim().length < 2) {
      errors.push('Numero_Grupo es requerido (ej: "G-01 Introducción a la Filosofía").');
    }
    if (typeof item.ID_Horario !== 'number' || item.ID_Horario < 1) {
      errors.push('ID_Horario debe ser un entero válido (relación con HORARIOS).');
    }
    if (typeof item.ID_Instructor !== 'number' || item.ID_Instructor < 1) {
      errors.push('ID_Instructor debe ser un entero válido (relación con INSTRUCTORES).');
    }
  } else if (schemaType === 'estatus') {
    const raw = typeof item === 'string' ? { nombre: item } : item;
    const name = raw.nombre || raw.Estatus || '';
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('El nombre del estatus es requerido (ej. "01-J.F.", "03-Miembro").');
    }
    const codeMatch = name.trim().match(/^([0-9]{2})/);
    if (!codeMatch) {
      errors.push('El estatus institucional debe comenzar con un código de dos cifras (ej: 01-, 02-, 03-, 98-, 99-).');
    }
  } else if (schemaType === 'miembros') {
    if (typeof item.ID_Miembro !== 'number' || item.ID_Miembro < 1) {
      errors.push('ID_Miembro debe ser un número entero mayor o igual a 1.');
    }
    if (!item.Miembro_Aspirante || typeof item.Miembro_Aspirante !== 'string' || item.Miembro_Aspirante.trim().length < 3) {
      errors.push('Miembro_Aspirante es requerido y debe tener al menos 3 caracteres.');
    }
    if (!item.DUI || !/^[0-9]{8}-[0-9]$/.test(item.DUI.trim())) {
      errors.push(`DUI inválido ("${item.DUI}"). Debe cumplir el formato salvadoreño 00000000-0.`);
    }
    if (!item.Celular || typeof item.Celular !== 'string') {
      errors.push('Celular es requerido.');
    }
    if (!item.Correo || !item.Correo.includes('@')) {
      errors.push('Correo electrónico es requerido y debe ser válido.');
    }
    const isExempt = typeof item.Estatus === 'string' && (item.Estatus.trim().startsWith('01') || item.Estatus.trim().startsWith('02'));
    if (!isExempt) {
      if (!item.Grupo_Horario || typeof item.Grupo_Horario !== 'string') {
        errors.push('Grupo_Horario es requerido para este estatus.');
      }
      if (!item.Instructores || typeof item.Instructores !== 'string') {
        errors.push('Instructores es requerido para este estatus.');
      }
    }
    if (typeof item.Cuota !== 'number' || item.Cuota <= 0) {
      errors.push('Cuota debe ser un número mayor a 0.00.');
    }
  } else if (schemaType === 'cuotas') {
    if (typeof item.ID_Registro !== 'number' || item.ID_Registro < 1) {
      errors.push('ID_Registro debe ser un número entero mayor o igual a 1.');
    }
    if (!item.Miembro_Aspirante || typeof item.Miembro_Aspirante !== 'string' || item.Miembro_Aspirante.trim().length < 3) {
      errors.push('Miembro_Aspirante es requerido y debe tener al menos 3 caracteres.');
    }
    if (item.DUI && !/^[0-9]{8}-[0-9]$/.test(item.DUI.trim())) {
      errors.push(`DUI inválido ("${item.DUI}"). Debe cumplir el formato salvadoreño 00000000-0.`);
    }
    if (!item.Grupo_Horario || typeof item.Grupo_Horario !== 'string') {
      errors.push('Grupo_Horario es requerido.');
    }
    const mesesValidos = [
      "01-ENERO", "02-FEBRERO", "03-MARZO", "04-ABRIL", "05-MAYO", "06-JUNIO",
      "07-JULIO", "08-AGOSTO", "09-SEPTIEMBRE", "10-OCTUBRE", "11-NOVIEMBRE", "12-DICIEMBRE",
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    if (!item.Mes_Pagado || !mesesValidos.includes(item.Mes_Pagado)) {
      errors.push(`Mes_Pagado inválido. Debe ser uno de: ${mesesValidos.join(', ')}.`);
    }
    if (typeof item.Monto_Cuota !== 'number' || item.Monto_Cuota <= 0) {
      errors.push('Monto_Cuota debe ser un número decimal estrictamente mayor a 0.00.');
    }
    if (!item.Fecha_Pago || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(item.Fecha_Pago)) {
      errors.push('Fecha_Pago debe tener el formato YYYY-MM-DD.');
    }
    if (!item.Metodo_Pago || typeof item.Metodo_Pago !== 'string') {
      errors.push('Metodo_Pago es requerido (ej: Págala, Transferencia, Efectivo).');
    }
  } else if (schemaType === 'materiales') {
    if (typeof item.ID_Material_Log !== 'number' || item.ID_Material_Log < 1) {
      errors.push('ID_Material_Log debe ser un número entero mayor o igual a 1.');
    }
    if (!item.Miembro_Aspirante) errors.push('Miembro_Aspirante es requerido.');
    if (!item.Materia_Articulo) errors.push('Materia_Articulo es requerido.');
    if (typeof item.Monto !== 'number' || item.Monto < 0) {
      errors.push('Monto debe ser un número mayor o igual a 0.00.');
    }
    if (!item.Fecha_Solicitud || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(item.Fecha_Solicitud)) {
      errors.push('Fecha_Solicitud debe tener formato YYYY-MM-DD.');
    }
    if (!['Pagado', 'Pendiente'].includes(item.Estado_Pago)) {
      errors.push('Estado_Pago debe ser "Pagado" o "Pendiente".');
    }
    if (!['Entregado', 'En Tránsito', 'Pendiente'].includes(item.Estado_Entrega)) {
      errors.push('Estado_Entrega debe ser "Entregado", "En Tránsito" o "Pendiente".');
    }
  } else if (schemaType === 'otros') {
    if (typeof item.ID_Transaccion !== 'number' || item.ID_Transaccion < 1) {
      errors.push('ID_Transaccion debe ser un número entero mayor o igual a 1.');
    }
    if (!item.Fecha || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(item.Fecha)) {
      errors.push('Fecha debe tener formato YYYY-MM-DD.');
    }
    if (!item.Concepto || typeof item.Concepto !== 'string') {
      errors.push('Concepto es requerido.');
    }
    if (typeof item.Monto !== 'number') {
      errors.push('Monto debe ser un número (positivo para ingresos, negativo para egresos).');
    }
    if (!['Completado', 'Pendiente', 'Anulado'].includes(item.Estado)) {
      errors.push('Estado debe ser "Completado", "Pendiente" o "Anulado".');
    }
  } else if (schemaType === 'mora') {
    if (typeof item.ID_Mora !== 'number' || item.ID_Mora < 1) {
      errors.push('ID_Mora debe ser un número entero mayor o igual a 1.');
    }
    if (!item.Miembro_Aspirante) errors.push('Miembro_Aspirante es requerido.');
    if (typeof item.Saldo_Anterior !== 'number' || item.Saldo_Anterior < 0) {
      errors.push('Saldo_Anterior debe ser un número mayor o igual a 0.00.');
    }
    if (typeof item.Saldo_Actual !== 'number' || item.Saldo_Actual < 0) {
      errors.push('Saldo_Actual debe ser un número mayor o igual a 0.00.');
    }
    if (typeof item.Meses_En_Mora !== 'number' || item.Meses_En_Mora < 1) {
      errors.push('Meses_En_Mora debe ser un número entero mayor o igual a 1.');
    }
    if (!item.Detalle_Meses) errors.push('Detalle_Meses es requerido (ej: "01-ENERO, 02-FEBRERO").');
    if (!['Notificado', 'En Negociación', 'Sin Respuesta'].includes(item.Estado_Gestion)) {
      errors.push('Estado_Gestion debe ser "Notificado", "En Negociación" o "Sin Respuesta".');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
