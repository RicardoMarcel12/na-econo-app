import React, { useState, useMemo } from 'react';
import { TransaccionOtro, EstadoTransaccionOtro } from '../types/models';
import { exportOtrosCSV, parseCSV, downloadFile } from '../utils/csvEngine';
import { Search, Plus, Download, Upload, Trash2, Edit2, CheckCircle2, AlertCircle, X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { TableSortHeader, cycleSort, sortRows, SortDirection } from './TableSortHeader';

interface OtrosViewProps {
  otros: TransaccionOtro[];
  onAddTransaccion: (item: Omit<TransaccionOtro, 'ID_Transaccion'>) => void;
  onUpdateTransaccion: (item: TransaccionOtro) => void;
  onDeleteTransaccion: (id: number) => void;
  onImportOtros: (items: TransaccionOtro[]) => void;
}

export const OtrosView: React.FC<OtrosViewProps> = ({
  otros,
  onAddTransaccion,
  onUpdateTransaccion,
  onDeleteTransaccion,
  onImportOtros,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('ALL');
  const [filterTipo, setFilterTipo] = useState<'ALL' | 'ingreso' | 'egreso'>('ALL');

  // Table Sorting state (3-state toggle: default ID, asc, desc)
  const [sortKey, setSortKey] = useState<string>('default');
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: string) => {
    const next = cycleSort(sortKey, key, sortDirection);
    setSortKey(next.key);
    setSortDirection(next.direction);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TransaccionOtro | null>(null);

  const [tipoMovimiento, setTipoMovimiento] = useState<'ingreso' | 'egreso'>('ingreso');
  const [formData, setFormData] = useState({
    Fecha: new Date().toISOString().split('T')[0],
    Concepto: '',
    MontoAbsoluto: 50.00,
    Contacto: '',
    Estado: 'Completado' as EstadoTransaccionOtro,
    Accion_Pendiente: '',
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredOtros = useMemo(() => {
    return otros.filter((t) => {
      const matchesSearch =
        t.Concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.Contacto && t.Contacto.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.Accion_Pendiente && t.Accion_Pendiente.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesEstado = filterEstado === 'ALL' || t.Estado === filterEstado;
      const matchesTipo =
        filterTipo === 'ALL' ||
        (filterTipo === 'ingreso' && t.Monto >= 0) ||
        (filterTipo === 'egreso' && t.Monto < 0);

      return matchesSearch && matchesEstado && matchesTipo;
    });
  }, [otros, searchTerm, filterEstado, filterTipo]);

  const sortedOtros = useMemo(() => {
    return sortRows(filteredOtros, sortKey, sortDirection, 'ID_Transaccion');
  }, [filteredOtros, sortKey, sortDirection]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTipoMovimiento('ingreso');
    setFormData({
      Fecha: new Date().toISOString().split('T')[0],
      Concepto: '',
      MontoAbsoluto: 50.00,
      Contacto: '',
      Estado: 'Completado',
      Accion_Pendiente: '',
    });
    setFormErrors([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TransaccionOtro) => {
    setEditingItem(item);
    setTipoMovimiento(item.Monto >= 0 ? 'ingreso' : 'egreso');
    setFormData({
      Fecha: item.Fecha,
      Concepto: item.Concepto,
      MontoAbsoluto: Math.abs(item.Monto),
      Contacto: item.Contacto || '',
      Estado: item.Estado,
      Accion_Pendiente: item.Accion_Pendiente || '',
    });
    setFormErrors([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!formData.Concepto.trim()) {
      errors.push('El concepto descriptivo es requerido.');
    }
    if (formData.MontoAbsoluto === undefined || isNaN(formData.MontoAbsoluto)) {
      errors.push('El monto es requerido y debe ser un valor numérico.');
    }
    if (!formData.Fecha) {
      errors.push('La fecha de la transacción es requerida.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const finalMonto = tipoMovimiento === 'egreso' ? -Math.abs(formData.MontoAbsoluto) : Math.abs(formData.MontoAbsoluto);

    if (editingItem) {
      onUpdateTransaccion({
        ...editingItem,
        Fecha: formData.Fecha,
        Concepto: formData.Concepto.trim(),
        Monto: finalMonto,
        Contacto: formData.Contacto.trim() || undefined,
        Estado: formData.Estado,
        Accion_Pendiente: formData.Accion_Pendiente.trim() || undefined,
      });
    } else {
      onAddTransaccion({
        Fecha: formData.Fecha,
        Concepto: formData.Concepto.trim(),
        Monto: finalMonto,
        Contacto: formData.Contacto.trim() || undefined,
        Estado: formData.Estado,
        Accion_Pendiente: formData.Accion_Pendiente.trim() || undefined,
      });
    }

    handleCloseModal();
  };

  // CSV Import
  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length < 2) {
          setNotification({ message: 'El archivo CSV está vacío.', type: 'error' });
          return;
        }

        const headers = rows[0].map(h => h.trim().toLowerCase());
        const idIdx = headers.findIndex(h => h.includes('id_transaccion'));
        const fechaIdx = headers.findIndex(h => h.includes('fecha'));
        const conceptoIdx = headers.findIndex(h => h.includes('concepto'));
        const montoIdx = headers.findIndex(h => h.includes('monto'));
        const contactoIdx = headers.findIndex(h => h.includes('contacto'));
        const estadoIdx = headers.findIndex(h => h.includes('estado'));
        const accionIdx = headers.findIndex(h => h.includes('accion_pendiente'));

        if (conceptoIdx === -1 || montoIdx === -1) {
          setNotification({
            message: 'Estructura CSV no coincide con 3-registro-otros.csv (columnas Concepto y Monto requeridas).',
            type: 'error',
          });
          return;
        }

        const newItems: TransaccionOtro[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row[conceptoIdx]) continue;

          const rawMonto = parseFloat(row[montoIdx]?.replace('$', '') || '0');
          const estadoRaw = row[estadoIdx]?.trim().toLowerCase();
          const estado: EstadoTransaccionOtro =
            estadoRaw === 'pendiente' ? 'Pendiente' : estadoRaw === 'anulado' ? 'Anulado' : 'Completado';

          const item: TransaccionOtro = {
            ID_Transaccion: idIdx !== -1 && row[idIdx] ? parseInt(row[idIdx], 10) : Date.now() + i,
            Fecha: fechaIdx !== -1 && row[fechaIdx] ? row[fechaIdx] : new Date().toISOString().split('T')[0],
            Concepto: row[conceptoIdx],
            Monto: isNaN(rawMonto) ? 0.0 : rawMonto,
            Contacto: contactoIdx !== -1 ? row[contactoIdx] : undefined,
            Estado: estado,
            Accion_Pendiente: accionIdx !== -1 ? row[accionIdx] : undefined,
          };
          newItems.push(item);
        }

        if (newItems.length > 0) {
          onImportOtros(newItems);
          setNotification({ message: `Se importaron ${newItems.length} transacciones exitosamente.`, type: 'success' });
        }
      } catch (err) {
        setNotification({ message: 'Error al procesar el archivo CSV de transacciones.', type: 'error' });
      }
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  const handleExportCSV = () => {
    const csv = exportOtrosCSV(filteredOtros);
    downloadFile(csv, '3-registro-otros.csv');
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(filteredOtros, null, 2);
    downloadFile(jsonStr, 'otros_transacciones_contrato.json', 'application/json');
  };

  const balanceTotal = filteredOtros.reduce((acc, t) => (t.Estado !== 'Anulado' ? acc + t.Monto : acc), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Registro de Otros Ingresos y Gastos Misceláneos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Archivo de referencia: <span className="font-mono text-slate-700">3-registro-otros.csv</span> · Talleres, conferencias, donaciones y gastos de sede
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer shadow-xs">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Importar CSV</span>
            <input type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
          </label>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
          >
            <span>JSON Contrato</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Transacción</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-3 rounded-md text-xs flex items-center justify-between ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por concepto o contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-slate-50/50"
          />
        </div>

        <div>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value as any)}
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-white"
          >
            <option value="ALL">Todos los flujos (ingresos y gastos)</option>
            <option value="ingreso">Solo Ingresos (+)</option>
            <option value="egreso">Solo Gastos (-)</option>
          </select>
        </div>

        <div>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-white"
          >
            <option value="ALL">Todos los estados</option>
            <option value="Completado">Completado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Anulado">Anulado</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <TableSortHeader
                  columnKey="ID_Transaccion"
                  label="ID"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-16 font-mono"
                />
                <TableSortHeader
                  columnKey="Fecha"
                  label="Fecha"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  columnKey="Concepto"
                  label="Concepto"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  columnKey="Monto"
                  label="Monto"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <TableSortHeader
                  columnKey="Contacto"
                  label="Contacto / Proveedor"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  columnKey="Estado"
                  label="Estado"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  columnKey="Accion_Pendiente"
                  label="Acción Pendiente"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <th className="py-2.5 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedOtros.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No se encontraron transacciones registradas.
                  </td>
                </tr>
              ) : (
                sortedOtros.map((item) => {
                  const isPositive = item.Monto >= 0;
                  return (
                    <tr key={item.ID_Transaccion} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400 tabular-nums">
                        #{item.ID_Transaccion}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 tabular-nums">
                        {item.Fecha}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 max-w-sm">
                        {item.Concepto}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums">
                        <span className={`inline-flex items-center gap-1 ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {isPositive ? <ArrowUpCircle className="w-3 h-3 shrink-0" /> : <ArrowDownCircle className="w-3 h-3 shrink-0" />}
                          {isPositive ? `+$${item.Monto.toFixed(2)}` : `-$${Math.abs(item.Monto).toFixed(2)}`}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {item.Contacto || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`font-medium ${
                          item.Estado === 'Completado'
                            ? 'text-slate-700'
                            : item.Estado === 'Pendiente'
                            ? 'text-amber-700'
                            : 'text-slate-400 line-through'
                        }`}>
                          {item.Estado}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-xs truncate" title={item.Accion_Pendiente}>
                        {item.Accion_Pendiente || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Editar"
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaccion(item.ID_Transaccion)}
                          title="Eliminar"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>{sortedOtros.length} registros listados</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400">
              Orden: {sortDirection === null || sortKey === 'default' ? 'Por defecto (ID)' : `${sortKey} (${sortDirection === 'asc' ? 'ascendente' : 'descendente'})`}
            </span>
          </div>
          <span className="font-mono tabular-nums font-semibold text-slate-800">
            Balance neto en vista: <span className={balanceTotal >= 0 ? 'text-emerald-700' : 'text-rose-700'}>${balanceTotal.toFixed(2)}</span>
          </span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Editar Transacción' : 'Registrar Transacción Miscelánea'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {formErrors.length > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 space-y-1">
                {formErrors.map((err, i) => (
                  <p key={i}>· {err}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              {/* Tipo de movimiento */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Tipo de Flujo Financiero *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTipoMovimiento('ingreso')}
                    className={`py-2 px-3 border rounded-md font-medium text-center transition-colors cursor-pointer ${
                      tipoMovimiento === 'ingreso'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    + Ingreso (Aporte / Taller / Donación)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoMovimiento('egreso')}
                    className={`py-2 px-3 border rounded-md font-medium text-center transition-colors cursor-pointer ${
                      tipoMovimiento === 'egreso'
                        ? 'border-rose-600 bg-rose-50 text-rose-800 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    - Gasto (Mantenimiento / Suministros)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Concepto / Motivo de la Transacción *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Taller de Filosofía Práctica / Suministros de Café"
                  value={formData.Concepto}
                  onChange={(e) => setFormData({ ...formData, Concepto: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Monto ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.MontoAbsoluto}
                    onChange={(e) => setFormData({ ...formData, MontoAbsoluto: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Fecha del Evento *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.Fecha}
                    onChange={(e) => setFormData({ ...formData, Fecha: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Contacto / Responsable / Proveedor
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Técnico Manuel Ayala / Donante"
                    value={formData.Contacto}
                    onChange={(e) => setFormData({ ...formData, Contacto: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Estado *
                  </label>
                  <select
                    value={formData.Estado}
                    onChange={(e) => setFormData({ ...formData, Estado: e.target.value as EstadoTransaccionOtro })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden bg-white"
                  >
                    <option value="Completado">Completado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Anulado">Anulado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Acción Pendiente (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Enviar recibo a donante / Archivar factura"
                  value={formData.Accion_Pendiente}
                  onChange={(e) => setFormData({ ...formData, Accion_Pendiente: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3.5 py-2 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 font-semibold cursor-pointer shadow-xs"
                >
                  {editingItem ? 'Guardar Cambios' : 'Registrar Transacción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
