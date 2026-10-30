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

export const CentralDatabaseSyncPayloadSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "CentralDatabaseSyncPayload",
  description: "Contrato consolidado para sincronización completa o lote entre la sede local y la base de datos centralizada.",
  type: "object",
  required: ["version", "sede", "fecha_sincronizacion", "miembros", "cuotas", "materiales", "otros", "mora"],
  properties: {
    version: { type: "string", enum: ["1.0.0"] },
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
    }
  }
};

/**
 * REST API Endpoints Specification for Centralized Database Backend
 */
export interface EndpointDoc {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  requestBodySchemaName?: string;
  responseSchemaName: string;
  samplePayload: any;
}

export const CENTRAL_API_ENDPOINTS: EndpointDoc[] = [
  {
    method: 'GET',
    path: '/api/v1/cuotas',
    summary: 'Listar cuotas de membresía',
    description: 'Devuelve la lista paginada o filtrada de pagos de cuotas mensuales de miembros y aspirantes.',
    responseSchemaName: 'Array<CuotaMembresia>',
    samplePayload: {
      filtros: { mes: 'Febrero', grupo: 'Filosofía Clásica' },
      limite: 50,
      pagina: 1
    }
  },
  {
    method: 'POST',
    path: '/api/v1/cuotas',
    summary: 'Registrar pago de cuota',
    description: 'Inserta un nuevo pago de cuota validando el formato del DUI salvadoreño y monto positivo.',
    requestBodySchemaName: 'CuotaMembresiaSchema',
    responseSchemaName: '{ success: true, ID_Registro: 104, timestamp: string }',
    samplePayload: {
      ID_Registro: 104,
      Miembro_Aspirante: "Alejandro Mendoza Ortiz",
      DUI: "03456789-2",
      Grupo_Horario: "Introducción a la Filosofía - Mar/Jue 6:30 PM",
      Mes_Pagado: "Febrero",
      Monto_Cuota: 25.0,
      Fecha_Pago: "2026-02-14",
      Metodo_Pago: "Págala",
      Referencia: "PAG-2026-8841"
    }
  },
  {
    method: 'POST',
    path: '/api/v1/materiales',
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
  {
    method: 'POST',
    path: '/api/v1/otros',
    summary: 'Registrar transacción miscelánea',
    description: 'Registra un ingreso o gasto no tipificado en cuotas (conferencias, talleres o mantenimiento de sede).',
    requestBodySchemaName: 'TransaccionOtroSchema',
    responseSchemaName: '{ success: true, ID_Transaccion: 88 }',
    samplePayload: {
      ID_Transaccion: 88,
      Fecha: "2026-02-12",
      Concepto: "Aporte Taller de Filosofía Oriental",
      Monto: 120.0,
      Contacto: "Prof. Roberto Valencia",
      Estado: "Completado",
      Accion_Pendiente: "Emitir constancia de participación"
    }
  },
  {
    method: 'POST',
    path: '/api/v1/mora/reconciliar',
    summary: 'Reconciliar estado de mora con nuevo pago',
    description: 'Amortiza o actualiza el saldo de un estudiante en mora al registrar un pago en cuotas.',
    requestBodySchemaName: '{ Miembro_Aspirante: string, Mes_Amortizado: string, Monto_Abonado: number }',
    responseSchemaName: '{ ID_Mora: number, Nuevo_Saldo: number, Estado_Actualizado: string }',
    samplePayload: {
      Miembro_Aspirante: "Carlos Eduardo Lemus",
      Mes_Amortizado: "Enero",
      Monto_Abonado: 25.0
    }
  },
  {
    method: 'POST',
    path: '/api/v1/sync/central-database',
    summary: 'Sincronización masiva con Base de Datos Central',
    description: 'Envía un lote consolidado de los 4 registros para sincronizar o respaldar en la base de datos central.',
    requestBodySchemaName: 'CentralDatabaseSyncPayloadSchema',
    responseSchemaName: '{ status: "synced", registros_procesados: 156, hash: "a8f3b9c..." }',
    samplePayload: {
      version: "1.0.0",
      sede: "Nueva Acrópolis - San Salvador",
      fecha_sincronizacion: "2026-02-24T18:30:00Z",
      cuotas_count: 50,
      materiales_count: 24,
      otros_count: 18,
      mora_count: 12
    }
  },
  {
    method: 'GET',
    path: '/api/v1/mora/stats',
    summary: 'Cálculo en tiempo real de categorías de mora',
    description: 'Calcula en tiempo real desde el backend la distribución analítica de los miembros en tres categorías: Solventes, Mora Pequeña (< 3 meses) y 3 Meses o Más.',
    responseSchemaName: '{ solventes: MoraCategoryStats, mora_pequena: MoraCategoryStats, mora_3_mas: MoraCategoryStats, total_miembros: number }',
    samplePayload: {
      total_miembros: 48,
      total_cartera_mora: 225.0,
      solventes: { count: 36, porcentaje: 75 },
      mora_pequena: { count: 8, porcentaje: 17, total_deuda: 110.0 },
      mora_3_mas: { count: 4, porcentaje: 8, total_deuda: 115.0 }
    }
  }
];

/**
 * In-browser Schema Validator for Contract verification
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEntityPayload(schemaType: 'miembros' | 'cuotas' | 'materiales' | 'otros' | 'mora', item: any): ValidationResult {
  const errors: string[] = [];

  if (!item || typeof item !== 'object') {
    return { valid: false, errors: ['El objeto de datos es nulo o no es un objeto válido.'] };
  }

  if (schemaType === 'miembros') {
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
    if (!item.Detalle_Meses) errors.push('Detalle_Meses es requerido (ej: "Enero, Febrero").');
    if (!['Notificado', 'En Negociación', 'Sin Respuesta'].includes(item.Estado_Gestion)) {
      errors.push('Estado_Gestion debe ser "Notificado", "En Negociación" o "Sin Respuesta".');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
