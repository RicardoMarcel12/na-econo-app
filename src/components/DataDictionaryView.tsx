import React, { useState } from 'react';
import { BookOpen, FileSpreadsheet, Search } from 'lucide-react';

export const DataDictionaryView: React.FC = () => {
  const [filterQuery, setFilterQuery] = useState('');

  const datasets = [
    {
      id: '1',
      file: '1-Registro-cuotas-membresia.csv',
      title: 'Registro de Cuotas de Membresía',
      description: 'Registro principal del pago de cuotas mensuales de los miembros o aspirantes de la Escuela de Filosofía.',
      fields: [
        { name: 'ID_Registro', type: 'Integer', req: 'Y', desc: 'Identificador único del pago.', rules: 'Llave primaria (Autoincremental).' },
        { name: 'Miembro_Aspirante', type: 'String', req: 'Y', desc: 'Nombre completo del estudiante.', rules: 'Sin caracteres especiales.' },
        { name: 'DUI', type: 'String', req: 'N', desc: 'Documento Único de Identidad.', rules: 'Formato estándar de El Salvador (00000000-0).' },
        { name: 'Grupo_Horario', type: 'String', req: 'Y', desc: 'Grupo asignado al miembro.', rules: 'Valores de lista predefinida.' },
        { name: 'Mes_Pagado', type: 'String', req: 'Y', desc: 'Mes que cubre la cuota.', rules: "Formato: '01-ENERO', '02-FEBRERO', etc." },
        { name: 'Monto_Cuota', type: 'Decimal', req: 'Y', desc: 'Cantidad abonada en la transacción.', rules: 'Mayor a 0.00.' },
        { name: 'Fecha_Pago', type: 'Date', req: 'Y', desc: 'Fecha en que se realizó el abono.', rules: 'Formato: YYYY-MM-DD.' },
        { name: 'Metodo_Pago', type: 'String', req: 'Y', desc: 'Plataforma o método de pago.', rules: "Ej: 'Págala', 'Transferencia', 'Efectivo'." },
        { name: 'Referencia', type: 'String', req: 'N', desc: 'Número de comprobante o ticket.', rules: 'Único por método de pago.' }
      ]
    },
    {
      id: '2',
      file: '2-Registro-materiales-clase.csv',
      title: 'Registro de Materiales y Libros de Clase',
      description: 'Seguimiento de adquisición y pago de libros de filosofía, manuales, equipos o uniformes para las clases.',
      fields: [
        { name: 'ID_Material_Log', type: 'Integer', req: 'Y', desc: 'Identificador único del registro.', rules: 'Llave primaria.' },
        { name: 'Miembro_Aspirante', type: 'String', req: 'Y', desc: 'Nombre completo del estudiante.', rules: 'Coincidir con registro de membresía.' },
        { name: 'Materia_Articulo', type: 'String', req: 'Y', desc: 'Nombre del material o artículo.', rules: 'Texto libre corto.' },
        { name: 'Monto', type: 'Decimal', req: 'Y', desc: 'Costo del material.', rules: 'Mayor o igual a 0.00.' },
        { name: 'Fecha_Solicitud', type: 'Date', req: 'Y', desc: 'Fecha en la que se requirió.', rules: 'Formato: YYYY-MM-DD.' },
        { name: 'Estado_Pago', type: 'String', req: 'Y', desc: 'Estatus financiero del material.', rules: "Valores: 'Pagado', 'Pendiente'." },
        { name: 'Estado_Entrega', type: 'String', req: 'Y', desc: 'Estatus físico del material.', rules: "Valores: 'Entregado', 'En Tránsito', 'Pendiente'." }
      ]
    },
    {
      id: '3',
      file: '3-registro-otros.csv',
      title: 'Bitácora de Otras Transacciones',
      description: 'Bitácora de transacciones misceláneas, conferencias extraordinarias, donaciones o gastos no tipificados en mensualidades y materiales.',
      fields: [
        { name: 'ID_Transaccion', type: 'Integer', req: 'Y', desc: 'Identificador de la transacción.', rules: 'Llave primaria.' },
        { name: 'Fecha', type: 'Date', req: 'Y', desc: 'Fecha del evento o transacción.', rules: 'Formato: YYYY-MM-DD.' },
        { name: 'Concepto', type: 'String', req: 'Y', desc: 'Motivo del ingreso o gasto.', rules: 'Texto descriptivo.' },
        { name: 'Monto', type: 'Decimal', req: 'Y', desc: 'Cantidad monetaria asociada.', rules: 'Permite valores positivos y negativos.' },
        { name: 'Contacto', type: 'String', req: 'N', desc: 'Persona responsable o involucrada.', rules: 'Referencia del tercero.' },
        { name: 'Estado', type: 'String', req: 'Y', desc: 'Estatus de la transacción.', rules: "Valores: 'Completado', 'Pendiente', 'Anulado'." },
        { name: 'Accion_Pendiente', type: 'String', req: 'N', desc: 'Siguiente paso a realizar.', rules: "Texto libre (Ej. 'Enviar recibo')." }
      ]
    },
    {
      id: '4',
      file: '4-reporte-mora.csv',
      title: 'Reporte y Tablero de Mora',
      description: 'Tablero de seguimiento para miembros con cuotas atrasadas y cálculo de saldos pendientes.',
      fields: [
        { name: 'ID_Mora', type: 'Integer', req: 'Y', desc: 'Identificador del reporte.', rules: 'Llave primaria.' },
        { name: 'Miembro_Aspirante', type: 'String', req: 'Y', desc: 'Nombre del miembro en atraso.', rules: 'Coincidir con membresías.' },
        { name: 'Saldo_Anterior', type: 'Decimal', req: 'Y', desc: 'Deuda acumulada de periodos previos.', rules: 'Por defecto 0.00.' },
        { name: 'Saldo_Actual', type: 'Decimal', req: 'Y', desc: 'Deuda total al momento del corte.', rules: 'Calculado automáticamente.' },
        { name: 'Meses_En_Mora', type: 'Integer', req: 'Y', desc: 'Cantidad de meses sin pago.', rules: 'Entero mayor a 0.' },
        { name: 'Detalle_Meses', type: 'String', req: 'Y', desc: 'Meses específicos adeudados.', rules: "Ej: 'Enero, Febrero'." },
        { name: 'Ultimo_Contacto', type: 'Date', req: 'N', desc: 'Fecha de última gestión de cobro.', rules: 'Formato: YYYY-MM-DD.' },
        { name: 'Estado_Gestion', type: 'String', req: 'Y', desc: 'Estatus del cobro.', rules: "Valores: 'Notificado', 'En Negociación', 'Sin Respuesta'." }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Diccionario de Definición de Datos (PRD)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Estructuras oficiales, tipos, obligatoriedad y reglas de negocio extraídas de <span className="font-mono text-slate-700">data_dictionary_8d3f0ef8.md</span>
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar campos o reglas..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-white"
          />
        </div>
      </div>

      <div className="space-y-8">
        {datasets.map((dataset) => {
          const matchingFields = dataset.fields.filter(
            (f) =>
              !filterQuery ||
              f.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
              f.desc.toLowerCase().includes(filterQuery.toLowerCase()) ||
              f.rules.toLowerCase().includes(filterQuery.toLowerCase())
          );

          if (matchingFields.length === 0) return null;

          return (
            <div key={dataset.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
              <div className="p-4 bg-slate-50/80 border-b border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                    <h2 className="text-sm font-bold text-slate-900">{dataset.title}</h2>
                  </div>
                  <span className="font-mono text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {dataset.file}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{dataset.description}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Nombre del Campo</th>
                      <th className="py-2.5 px-3">Tipo de Dato</th>
                      <th className="py-2.5 px-3 text-center">Requerido</th>
                      <th className="py-2.5 px-3">Descripción</th>
                      <th className="py-2.5 px-3">Reglas de Negocio / Restricciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {matchingFields.map((field) => (
                      <tr key={field.name} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                          {field.name}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">
                          {field.type}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`font-mono font-bold ${field.req === 'Y' ? 'text-slate-900' : 'text-slate-400'}`}>
                            {field.req}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {field.desc}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                          {field.rules}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
