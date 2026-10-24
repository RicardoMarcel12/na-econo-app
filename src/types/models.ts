/**
 * Model definitions strictly adhering to:
 * - 1-Registro-cuotas-membresia.csv
 * - 2-Registro-materiales-clase.csv
 * - 3-registro-otros.csv
 * - 4-reporte-mora.csv
 * - Registro Maestro de Miembros y Aspirantes
 * Defined in public/assets/aistudio/data_dictionary_8d3f0ef8.md
 */

export type CondicionMiembro = 'Miembro' | 'Aspirante' | 'Miembro Activo' | 'Honorario';

export interface Miembro {
  ID_Miembro: number;
  Miembro_Aspirante: string; // Nombre completo
  Condicion: CondicionMiembro; // Condición
  DUI: string; // Formato estándar El Salvador: 00000000-0
  Celular: string; // Teléfono / WhatsApp
  Correo: string; // Correo electrónico
  Grupo_Horario: string; // Grupo y horario asignado
  Instructores: string; // Nombre del instructor o instructores
  Concepto_Pago: string; // Concepto Pago
  Cuota: number; // Monto base de cuota mensual en USD
  Fecha_Ingreso?: string; // YYYY-MM-DD
}

export interface CuotaMembresia {
  ID_Registro: number;
  Miembro_Aspirante: string;
  DUI?: string; // Formato estándar El Salvador: 00000000-0
  Grupo_Horario: string;
  Mes_Pagado: string;
  Monto_Cuota: number; // Mayor a 0.00
  Fecha_Pago: string; // YYYY-MM-DD
  Metodo_Pago: string; // Ej: 'Págala', 'Transferencia', 'Efectivo', 'Tarjeta'
  Referencia?: string;
}

export type EstadoPagoMaterial = 'Pagado' | 'Pendiente';
export type EstadoEntregaMaterial = 'Entregado' | 'En Tránsito' | 'Pendiente';

export interface MaterialClase {
  ID_Material_Log: number;
  Miembro_Aspirante: string;
  Materia_Articulo: string;
  Monto: number; // Mayor o igual a 0.00
  Fecha_Solicitud: string; // YYYY-MM-DD
  Estado_Pago: EstadoPagoMaterial;
  Estado_Entrega: EstadoEntregaMaterial;
}

export type EstadoTransaccionOtro = 'Completado' | 'Pendiente' | 'Anulado';

export interface TransaccionOtro {
  ID_Transaccion: number;
  Fecha: string; // YYYY-MM-DD
  Concepto: string;
  Monto: number; // Permite valores positivos (ingresos) y negativos (gastos)
  Contacto?: string;
  Estado: EstadoTransaccionOtro;
  Accion_Pendiente?: string;
}

export type EstadoGestionMora = 'Notificado' | 'En Negociación' | 'Sin Respuesta';

export interface ReporteMora {
  ID_Mora: number;
  Miembro_Aspirante: string;
  Saldo_Anterior: number; // Default 0.00
  Saldo_Actual: number; // Calculado
  Meses_En_Mora: number; // Entero > 0
  Detalle_Meses: string; // Ej: 'Enero, Febrero'
  Ultimo_Contacto?: string; // YYYY-MM-DD
  Estado_Gestion: EstadoGestionMora;
}

export type ActiveTab = 'dashboard' | 'miembros' | 'cuotas' | 'materiales' | 'otros' | 'mora' | 'contratos' | 'diccionario';

export interface DatabaseState {
  miembros: Miembro[];
  cuotas: CuotaMembresia[];
  materiales: MaterialClase[];
  otros: TransaccionOtro[];
  mora: ReporteMora[];
}
