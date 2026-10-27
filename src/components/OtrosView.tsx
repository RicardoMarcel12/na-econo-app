import React, { useState, useMemo } from 'react';
import { TransaccionOtro, EstadoTransaccionOtro, ArchivoAdjunto } from '../types/models';
import { exportOtrosCSV, parseCSV, downloadFile } from '../utils/csvEngine';
import {
  Search,
  Plus,
  Download,
  Upload,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowUpCircle,
  ArrowDownCircle,
  Paperclip,
  FileText,
  Image as ImageIcon,
  File,
  Eye,
} from 'lucide-react';
import { TableSortHeader, cycleSort, sortRows, SortDirection } from './TableSortHeader';

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

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

  // Modal para ver y gestionar archivos adjuntos de una fila específica
  const [attachmentTransaction, setAttachmentTransaction] = useState<TransaccionOtro | null>(null);
  // Modal lightbox para previsualización de imagen
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  const [tipoMovimiento, setTipoMovimiento] = useState<'ingreso' | 'egreso'>('ingreso');
  const [formData, setFormData] = useState({
    Fecha: new Date().toISOString().split('T')[0],
    Concepto: '',
    MontoAbsoluto: 50.00,
    Contacto: '',
    Estado: 'Completado' as EstadoTransaccionOtro,
    Accion_Pendiente: '',
  });
  const [formArchivos, setFormArchivos] = useState<ArchivoAdjunto[]>([]);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Manejo de carga de archivos en el formulario Add/Edit
  const handleFormFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newAdjuntos: ArchivoAdjunto[] = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newAdjuntos.push({
          id: `arch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          nombre: file.name,
          tamano: file.size,
          tipo: file.type || 'application/octet-stream',
          dataUrl: e.target?.result as string,
          fechaSubida: new Date().toISOString().split('T')[0],
        });
        processed++;
        if (processed === files.length) {
          setFormArchivos((prev) => [...prev, ...newAdjuntos]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFormFile = (id: string) => {
    setFormArchivos((prev) => prev.filter((a) => a.id !== id));
  };

  // Manejo de carga directa desde el modal de adjuntos de fila
  const handleAddFilesToTransaction = (item: TransaccionOtro, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newAdjuntos: ArchivoAdjunto[] = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newAdjuntos.push({
          id: `arch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          nombre: file.name,
          tamano: file.size,
          tipo: file.type || 'application/octet-stream',
          dataUrl: e.target?.result as string,
          fechaSubida: new Date().toISOString().split('T')[0],
        });
        processed++;
        if (processed === files.length) {
          const updated: TransaccionOtro = {
            ...item,
            Archivos: [...(item.Archivos || []), ...newAdjuntos],
          };
          onUpdateTransaccion(updated);
          setAttachmentTransaction(updated);
          setNotification({
            message: `Se adjuntaron ${newAdjuntos.length} archivo(s) a la transacción #${item.ID_Transaccion}.`,
            type: 'success',
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFileFromTransaction = (item: TransaccionOtro, fileId: string) => {
    const updatedArchivos = (item.Archivos || []).filter((a) => a.id !== fileId);
    const updated: TransaccionOtro = {
      ...item,
      Archivos: updatedArchivos,
    };
    onUpdateTransaccion(updated);
    setAttachmentTransaction(updated);
    setNotification({
      message: 'Archivo eliminado de la transacción.',
      type: 'success',
    });
  };

  const handleDownloadFile = (archivo: ArchivoAdjunto) => {
    if (!archivo.dataUrl) {
      // Si es un archivo de prueba sin binario, generar un placeholder descargable
      const blob = new Blob([`Contenido de archivo de respaldo: ${archivo.nombre}\nRegistrado en Sistema de Economía`], {
        type: 'text/plain;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = archivo.nombre;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }
    const link = document.createElement('a');
    link.href = archivo.dataUrl;
    link.download = archivo.nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    setFormArchivos([]);
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
    setFormArchivos(item.Archivos || []);
    setFormErrors([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormArchivos([]);
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
        Archivos: formArchivos,
      });
    } else {
      onAddTransaccion({
        Fecha: formData.Fecha,
        Concepto: formData.Concepto.trim(),
        Monto: finalMonto,
        Contacto: formData.Contacto.trim() || undefined,
        Estado: formData.Estado,
        Accion_Pendiente: formData.Accion_Pendiente.trim() || undefined,
        Archivos: formArchivos,
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
                <th className="py-2.5 px-3">Archivos / Comprobantes</th>
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
                  <td colSpan={9} className="py-8 text-center text-slate-400">
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
                      <td className="py-2.5 px-3">
                        {item.Archivos && item.Archivos.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => setAttachmentTransaction(item)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer shadow-2xs"
                            title="Ver, descargar o gestionar archivos adjuntos"
                          >
                            <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                            <span>
                              {item.Archivos.length} {item.Archivos.length === 1 ? 'archivo' : 'archivos'}
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAttachmentTransaction(item)}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 px-2 py-0.5 rounded border border-dashed border-slate-300 transition-colors cursor-pointer"
                            title="Subir archivo(s) a esta transacción"
                          >
                            <Paperclip className="w-3 h-3" />
                            <span>+ Adjuntar</span>
                          </button>
                        )}
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

              {/* Subir Archivos Adjuntos (Facturas, Recibos, Comprobantes) */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-700 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                    <span>Archivos Adjuntos (Comprobantes, Facturas, Fotos)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {formArchivos.length} {formArchivos.length === 1 ? 'archivo' : 'archivos'}
                  </span>
                </div>

                <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="font-semibold text-slate-700 text-xs">
                    Haga clic o arrastre archivos aquí para adjuntar
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    PDF, imágenes (PNG, JPG), documentos (múltiples permitidos)
                  </span>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFormFilesSelected(e.target.files)}
                    className="hidden"
                  />
                </label>

                {formArchivos.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {formArchivos.map((arch) => (
                      <div
                        key={arch.id}
                        className="flex items-center justify-between p-2 rounded-md bg-white border border-slate-200 shadow-2xs text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {arch.tipo.startsWith('image/') ? (
                            <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : arch.tipo.includes('pdf') ? (
                            <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                          ) : (
                            <File className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <div className="min-w-0 truncate">
                            <span className="font-medium text-slate-800 block truncate" title={arch.nombre}>
                              {arch.nombre}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {formatFileSize(arch.tamano)} · {arch.fechaSubida}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {arch.tipo.startsWith('image/') && arch.dataUrl && (
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ url: arch.dataUrl!, title: arch.nombre })}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                              title="Previsualizar imagen"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {arch.dataUrl && (
                            <button
                              type="button"
                              onClick={() => handleDownloadFile(arch)}
                              className="p-1 text-slate-400 hover:text-emerald-600 rounded transition-colors cursor-pointer"
                              title="Descargar archivo"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveFormFile(arch.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                            title="Quitar archivo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* Modal de Gestión de Archivos Adjuntos por Registro */}
      {attachmentTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-md">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Archivos Adjuntos de la Transacción
                  </h3>
                  <p className="text-xs text-slate-500">
                    #{attachmentTransaction.ID_Transaccion} · {attachmentTransaction.Fecha} · <strong className="text-slate-800">{attachmentTransaction.Concepto}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAttachmentTransaction(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Zona de subida rápida */}
            <div className="space-y-2">
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50/40 hover:bg-blue-50 hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-blue-600 mb-1" />
                <span className="font-semibold text-slate-800 text-xs">
                  Subir uno o más archivos para este registro
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Facturas, recibos de caja, cotizaciones, fotos o comprobantes
                </span>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleAddFilesToTransaction(attachmentTransaction, e.target.files)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Lista de archivos adjuntos */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 text-xs flex items-center justify-between">
                <span>Archivos Guardados ({(attachmentTransaction.Archivos || []).length})</span>
              </h4>

              {(!attachmentTransaction.Archivos || attachmentTransaction.Archivos.length === 0) ? (
                <div className="py-6 text-center text-slate-400 text-xs border border-slate-100 rounded-lg bg-slate-50">
                  <Paperclip className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
                  <p>Aún no hay archivos adjuntos en esta transacción.</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Use el recuadro superior para cargar comprobantes.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {attachmentTransaction.Archivos.map((arch) => (
                    <div
                      key={arch.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded bg-slate-100 text-slate-600 shrink-0">
                          {arch.tipo.startsWith('image/') ? (
                            <ImageIcon className="w-4 h-4 text-emerald-600" />
                          ) : arch.tipo.includes('pdf') ? (
                            <FileText className="w-4 h-4 text-rose-600" />
                          ) : (
                            <File className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <div className="min-w-0 truncate">
                          <span className="font-semibold text-slate-900 block truncate" title={arch.nombre}>
                            {arch.nombre}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {formatFileSize(arch.tamano)} · Subido el {arch.fechaSubida}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {arch.tipo.startsWith('image/') && arch.dataUrl && (
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ url: arch.dataUrl!, title: arch.nombre })}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                            title="Previsualizar"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Ver</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(arch)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors cursor-pointer"
                          title="Descargar archivo a su equipo"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Descargar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFileFromTransaction(attachmentTransaction, arch.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                          title="Eliminar archivo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setAttachmentTransaction(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 text-xs font-semibold cursor-pointer shadow-xs"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal de Previsualización de Imagen */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-semibold text-slate-900 text-xs truncate max-w-md">
                {previewImage.title}
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-50 rounded-md p-2">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[65vh] max-w-full object-contain rounded"
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = previewImage.url;
                  link.download = previewImage.title;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Imagen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
