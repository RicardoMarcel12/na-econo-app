import React, { useState, useMemo } from 'react';
import { MaterialClase, EstadoPagoMaterial, EstadoEntregaMaterial } from '../types/models';
import { exportMaterialesCSV, parseCSV, downloadFile } from '../utils/csvEngine';
import { validateEntityPayload } from '../contracts/jsonContracts';
import { Search, Plus, Download, Upload, Trash2, Edit2, CheckCircle2, AlertCircle, X, BookOpen } from 'lucide-react';

interface MaterialesViewProps {
  materiales: MaterialClase[];
  onAddMaterial: (item: Omit<MaterialClase, 'ID_Material_Log'>) => void;
  onUpdateMaterial: (item: MaterialClase) => void;
  onDeleteMaterial: (id: number) => void;
  onImportMateriales: (items: MaterialClase[]) => void;
}

export const MaterialesView: React.FC<MaterialesViewProps> = ({
  materiales,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
  onImportMateriales,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPago, setFilterPago] = useState<string>('ALL');
  const [filterEntrega, setFilterEntrega] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MaterialClase | null>(null);

  const [formData, setFormData] = useState({
    Miembro_Aspirante: '',
    Materia_Articulo: '',
    Monto: 15.00,
    Fecha_Solicitud: new Date().toISOString().split('T')[0],
    Estado_Pago: 'Pagado' as EstadoPagoMaterial,
    Estado_Entrega: 'Pendiente' as EstadoEntregaMaterial,
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredMateriales = useMemo(() => {
    return materiales.filter((m) => {
      const matchesSearch =
        m.Miembro_Aspirante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.Materia_Articulo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPago = filterPago === 'ALL' || m.Estado_Pago === filterPago;
      const matchesEntrega = filterEntrega === 'ALL' || m.Estado_Entrega === filterEntrega;

      return matchesSearch && matchesPago && matchesEntrega;
    });
  }, [materiales, searchTerm, filterPago, filterEntrega]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      Miembro_Aspirante: '',
      Materia_Articulo: '',
      Monto: 15.00,
      Fecha_Solicitud: new Date().toISOString().split('T')[0],
      Estado_Pago: 'Pagado',
      Estado_Entrega: 'Pendiente',
    });
    setFormErrors([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MaterialClase) => {
    setEditingItem(item);
    setFormData({
      Miembro_Aspirante: item.Miembro_Aspirante,
      Materia_Articulo: item.Materia_Articulo,
      Monto: item.Monto,
      Fecha_Solicitud: item.Fecha_Solicitud,
      Estado_Pago: item.Estado_Pago,
      Estado_Entrega: item.Estado_Entrega,
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

    if (!formData.Miembro_Aspirante.trim()) {
      errors.push('El nombre del estudiante es requerido.');
    }
    if (!formData.Materia_Articulo.trim()) {
      errors.push('El nombre o descripción del material/libro es requerido.');
    }
    if (formData.Monto === undefined || formData.Monto < 0) {
      errors.push('El monto debe ser mayor o igual a 0.00.');
    }
    if (!formData.Fecha_Solicitud) {
      errors.push('La fecha de solicitud es requerida.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingItem) {
      onUpdateMaterial({
        ...editingItem,
        Miembro_Aspirante: formData.Miembro_Aspirante.trim(),
        Materia_Articulo: formData.Materia_Articulo.trim(),
        Monto: Number(formData.Monto),
        Fecha_Solicitud: formData.Fecha_Solicitud,
        Estado_Pago: formData.Estado_Pago,
        Estado_Entrega: formData.Estado_Entrega,
      });
    } else {
      onAddMaterial({
        Miembro_Aspirante: formData.Miembro_Aspirante.trim(),
        Materia_Articulo: formData.Materia_Articulo.trim(),
        Monto: Number(formData.Monto),
        Fecha_Solicitud: formData.Fecha_Solicitud,
        Estado_Pago: formData.Estado_Pago,
        Estado_Entrega: formData.Estado_Entrega,
      });
    }

    handleCloseModal();
  };

  const handleTogglePago = (item: MaterialClase) => {
    const nextPago: EstadoPagoMaterial = item.Estado_Pago === 'Pagado' ? 'Pendiente' : 'Pagado';
    onUpdateMaterial({ ...item, Estado_Pago: nextPago });
  };

  const handleChangeEntrega = (item: MaterialClase, newEntrega: EstadoEntregaMaterial) => {
    onUpdateMaterial({ ...item, Estado_Entrega: newEntrega });
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
        const idIdx = headers.findIndex(h => h.includes('id_material_log'));
        const nameIdx = headers.findIndex(h => h.includes('miembro_aspirante'));
        const matIdx = headers.findIndex(h => h.includes('materia_articulo'));
        const montoIdx = headers.findIndex(h => h.includes('monto'));
        const fechaIdx = headers.findIndex(h => h.includes('fecha_solicitud'));
        const pagoIdx = headers.findIndex(h => h.includes('estado_pago'));
        const entregaIdx = headers.findIndex(h => h.includes('estado_entrega'));

        if (nameIdx === -1 || matIdx === -1) {
          setNotification({
            message: 'Estructura CSV no coincide con 2-Registro-materiales-clase.csv.',
            type: 'error',
          });
          return;
        }

        const newItems: MaterialClase[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row[nameIdx]) continue;

          const monto = parseFloat(row[montoIdx]?.replace('$', '') || '0');
          const item: MaterialClase = {
            ID_Material_Log: idIdx !== -1 && row[idIdx] ? parseInt(row[idIdx], 10) : Date.now() + i,
            Miembro_Aspirante: row[nameIdx],
            Materia_Articulo: row[matIdx] || 'Libro de estudio',
            Monto: isNaN(monto) || monto < 0 ? 0.0 : monto,
            Fecha_Solicitud: fechaIdx !== -1 && row[fechaIdx] ? row[fechaIdx] : new Date().toISOString().split('T')[0],
            Estado_Pago: pagoIdx !== -1 && row[pagoIdx]?.toLowerCase().includes('pagado') ? 'Pagado' : 'Pendiente',
            Estado_Entrega: entregaIdx !== -1 && row[entregaIdx]?.toLowerCase().includes('entregado')
              ? 'Entregado'
              : row[entregaIdx]?.toLowerCase().includes('tránsito') || row[entregaIdx]?.toLowerCase().includes('transito')
              ? 'En Tránsito'
              : 'Pendiente',
          };
          newItems.push(item);
        }

        if (newItems.length > 0) {
          onImportMateriales(newItems);
          setNotification({ message: `Se importaron ${newItems.length} materiales exitosamente.`, type: 'success' });
        }
      } catch (err) {
        setNotification({ message: 'Error al procesar el archivo CSV de materiales.', type: 'error' });
      }
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  const handleExportCSV = () => {
    const csv = exportMaterialesCSV(filteredMateriales);
    downloadFile(csv, '2-Registro-materiales-clase.csv');
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(filteredMateriales, null, 2);
    downloadFile(jsonStr, 'materiales_clase_contrato.json', 'application/json');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Registro de Libros y Materiales de Clase
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Archivo de referencia: <span className="font-mono text-slate-700">2-Registro-materiales-clase.csv</span> · Textos, manuales y suministros para miembros
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
            <span>Nuevo Material</span>
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
            placeholder="Buscar por estudiante o libro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-slate-50/50"
          />
        </div>

        <div>
          <select
            value={filterPago}
            onChange={(e) => setFilterPago(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-white"
          >
            <option value="ALL">Todos los estados de pago</option>
            <option value="Pagado">Pagado</option>
            <option value="Pendiente">Pendiente de pago</option>
          </select>
        </div>

        <div>
          <select
            value={filterEntrega}
            onChange={(e) => setFilterEntrega(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-white"
          >
            <option value="ALL">Todos los estados de entrega</option>
            <option value="Entregado">Entregado</option>
            <option value="En Tránsito">En Tránsito</option>
            <option value="Pendiente">Pendiente de entrega</option>
          </select>
        </div>
      </div>

      {/* High-density Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-14">ID</th>
                <th className="py-2.5 px-3">Miembro / Aspirante</th>
                <th className="py-2.5 px-3">Materia / Artículo</th>
                <th className="py-2.5 px-3 text-right">Monto</th>
                <th className="py-2.5 px-3">Fecha Solicitud</th>
                <th className="py-2.5 px-3">Estado Pago</th>
                <th className="py-2.5 px-3">Estado Entrega</th>
                <th className="py-2.5 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMateriales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No se encontraron materiales registrados.
                  </td>
                </tr>
              ) : (
                filteredMateriales.map((item) => (
                  <tr key={item.ID_Material_Log} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-400 tabular-nums">
                      #{item.ID_Material_Log}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {item.Miembro_Aspirante}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.Materia_Articulo}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      ${item.Monto.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 tabular-nums">
                      {item.Fecha_Solicitud}
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => handleTogglePago(item)}
                        title="Clic para cambiar estado financiero"
                        className={`text-xs font-medium cursor-pointer transition-colors ${
                          item.Estado_Pago === 'Pagado'
                            ? 'text-emerald-700 hover:text-emerald-900'
                            : 'text-amber-700 hover:text-amber-900 font-semibold'
                        }`}
                      >
                        {item.Estado_Pago}
                      </button>
                    </td>
                    <td className="py-2.5 px-3">
                      <select
                        value={item.Estado_Entrega}
                        onChange={(e) => handleChangeEntrega(item, e.target.value as EstadoEntregaMaterial)}
                        className={`text-xs border-0 bg-transparent font-medium cursor-pointer focus:outline-hidden ${
                          item.Estado_Entrega === 'Entregado'
                            ? 'text-slate-800'
                            : item.Estado_Entrega === 'En Tránsito'
                            ? 'text-blue-700 font-semibold'
                            : 'text-rose-700 font-semibold'
                        }`}
                      >
                        <option value="Entregado">Entregado</option>
                        <option value="En Tránsito">En Tránsito</option>
                        <option value="Pendiente">Pendiente</option>
                      </select>
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
                        onClick={() => onDeleteMaterial(item.ID_Material_Log)}
                        title="Eliminar"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{filteredMateriales.length} artículos listados</span>
          <span className="font-mono tabular-nums font-semibold text-slate-800">
            Total en vista: ${filteredMateriales.reduce((acc, m) => acc + m.Monto, 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Editar Registro de Material' : 'Registrar Solicitud de Material / Libro'}
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
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nombre Completo del Miembro o Aspirante *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Gabriela Sofía Rivas"
                  value={formData.Miembro_Aspirante}
                  onChange={(e) => setFormData({ ...formData, Miembro_Aspirante: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Materia / Artículo / Libro *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Libro: Diálogos de Platón / Manual de Ética"
                  value={formData.Materia_Articulo}
                  onChange={(e) => setFormData({ ...formData, Materia_Articulo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Costo / Monto ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.Monto}
                    onChange={(e) => setFormData({ ...formData, Monto: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Fecha de Solicitud *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.Fecha_Solicitud}
                    onChange={(e) => setFormData({ ...formData, Fecha_Solicitud: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Estado de Pago *
                  </label>
                  <select
                    value={formData.Estado_Pago}
                    onChange={(e) => setFormData({ ...formData, Estado_Pago: e.target.value as EstadoPagoMaterial })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden bg-white"
                  >
                    <option value="Pagado">Pagado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Estado de Entrega Física *
                  </label>
                  <select
                    value={formData.Estado_Entrega}
                    onChange={(e) => setFormData({ ...formData, Estado_Entrega: e.target.value as EstadoEntregaMaterial })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden bg-white"
                  >
                    <option value="Entregado">Entregado</option>
                    <option value="En Tránsito">En Tránsito</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
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
                  {editingItem ? 'Guardar Cambios' : 'Registrar Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
