import { Miembro, CuotaMembresia, MaterialClase, TransaccionOtro, ReporteMora } from '../types/models';

/**
 * Escapes and formats a field for RFC 4180 CSV compliance
 */
function escapeCSVField(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Parses RFC 4180 compliant CSV string into a 2D array of strings
 */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  // Clean UTF-8 BOM if present
  let cleanText = text;
  if (cleanText.charCodeAt(0) === 0xFEFF) {
    cleanText = cleanText.slice(1);
  }

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // Skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField.trim());
        if (currentRow.some(col => col.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some(col => col.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(col => col.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Downloads a string as a file using UTF-8 BOM
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;') {
  const blob = new Blob(['\uFEFF' + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 1. Registro-cuotas-membresia.csv
export function exportCuotasCSV(data: CuotaMembresia[]): string {
  const headers = [
    'ID_Registro',
    'Miembro_Aspirante',
    'DUI',
    'Grupo_Horario',
    'Mes_Pagado',
    'Monto_Cuota',
    'Fecha_Pago',
    'Metodo_Pago',
    'Referencia'
  ];

  const lines = [headers.join(',')];
  for (const item of data) {
    lines.push([
      escapeCSVField(item.ID_Registro),
      escapeCSVField(item.Miembro_Aspirante),
      escapeCSVField(item.DUI || ''),
      escapeCSVField(item.Grupo_Horario),
      escapeCSVField(item.Mes_Pagado),
      escapeCSVField(item.Monto_Cuota.toFixed(2)),
      escapeCSVField(item.Fecha_Pago),
      escapeCSVField(item.Metodo_Pago),
      escapeCSVField(item.Referencia || '')
    ].join(','));
  }
  return lines.join('\r\n');
}

// 2. Registro-materiales-clase.csv
export function exportMaterialesCSV(data: MaterialClase[]): string {
  const headers = [
    'ID_Material_Log',
    'Miembro_Aspirante',
    'Materia_Articulo',
    'Monto',
    'Fecha_Solicitud',
    'Estado_Pago',
    'Estado_Entrega'
  ];

  const lines = [headers.join(',')];
  for (const item of data) {
    lines.push([
      escapeCSVField(item.ID_Material_Log),
      escapeCSVField(item.Miembro_Aspirante),
      escapeCSVField(item.Materia_Articulo),
      escapeCSVField(item.Monto.toFixed(2)),
      escapeCSVField(item.Fecha_Solicitud),
      escapeCSVField(item.Estado_Pago),
      escapeCSVField(item.Estado_Entrega)
    ].join(','));
  }
  return lines.join('\r\n');
}

// 3. registro-otros.csv
export function exportOtrosCSV(data: TransaccionOtro[]): string {
  const headers = [
    'ID_Transaccion',
    'Fecha',
    'Concepto',
    'Monto',
    'Contacto',
    'Estado',
    'Accion_Pendiente'
  ];

  const lines = [headers.join(',')];
  for (const item of data) {
    lines.push([
      escapeCSVField(item.ID_Transaccion),
      escapeCSVField(item.Fecha),
      escapeCSVField(item.Concepto),
      escapeCSVField(item.Monto.toFixed(2)),
      escapeCSVField(item.Contacto || ''),
      escapeCSVField(item.Estado),
      escapeCSVField(item.Accion_Pendiente || '')
    ].join(','));
  }
  return lines.join('\r\n');
}

// 4. reporte-mora.csv
export function exportMoraCSV(data: ReporteMora[]): string {
  const headers = [
    'ID_Mora',
    'Miembro_Aspirante',
    'Saldo_Anterior',
    'Saldo_Actual',
    'Meses_En_Mora',
    'Detalle_Meses',
    'Ultimo_Contacto',
    'Estado_Gestion'
  ];

  const lines = [headers.join(',')];
  for (const item of data) {
    lines.push([
      escapeCSVField(item.ID_Mora),
      escapeCSVField(item.Miembro_Aspirante),
      escapeCSVField(item.Saldo_Anterior.toFixed(2)),
      escapeCSVField(item.Saldo_Actual.toFixed(2)),
      escapeCSVField(item.Meses_En_Mora),
      escapeCSVField(item.Detalle_Meses),
      escapeCSVField(item.Ultimo_Contacto || ''),
      escapeCSVField(item.Estado_Gestion)
    ].join(','));
  }
  return lines.join('\r\n');
}

// 0. Registro-miembros.csv
export function exportMiembrosCSV(data: Miembro[]): string {
  const headers = [
    'ID_Miembro',
    'Miembro_Aspirante',
    'Condicion',
    'DUI',
    'Celular',
    'Correo',
    'Grupo_Horario',
    'Instructores',
    'Concepto_Pago',
    'Cuota'
  ];

  const lines = [headers.join(',')];
  for (const item of data) {
    lines.push([
      escapeCSVField(item.ID_Miembro),
      escapeCSVField(item.Miembro_Aspirante),
      escapeCSVField(item.Condicion),
      escapeCSVField(item.DUI),
      escapeCSVField(item.Celular),
      escapeCSVField(item.Correo),
      escapeCSVField(item.Grupo_Horario),
      escapeCSVField(item.Instructores),
      escapeCSVField(item.Concepto_Pago),
      escapeCSVField(item.Cuota.toFixed(2))
    ].join(','));
  }
  return lines.join('\r\n');
}

/**
 * Detects dataset type from CSV header row
 */
export function detectCSVType(headerRow: string[]): 'miembros' | 'cuotas' | 'materiales' | 'otros' | 'mora' | 'unknown' {
  const cleanHeaders = headerRow.map(h => h.trim().toLowerCase());
  if (cleanHeaders.includes('id_miembro') || cleanHeaders.includes('condicion') || cleanHeaders.includes('celular')) {
    return 'miembros';
  }
  if (cleanHeaders.includes('id_registro') || cleanHeaders.includes('monto_cuota')) {
    return 'cuotas';
  }
  if (cleanHeaders.includes('id_material_log') || cleanHeaders.includes('materia_articulo')) {
    return 'materiales';
  }
  if (cleanHeaders.includes('id_transaccion') || cleanHeaders.includes('concepto')) {
    return 'otros';
  }
  if (cleanHeaders.includes('id_mora') || cleanHeaders.includes('meses_en_mora')) {
    return 'mora';
  }
  return 'unknown';
}
