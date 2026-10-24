import React, { useState, useMemo } from 'react';
import { Miembro, CondicionMiembro } from '../types/models';
import { GRUPOS_HORARIOS_DEFAULT, INSTRUCTORES_DEFAULT, CONCEPTOS_PAGO_DEFAULT } from '../data/seedData';
import { exportMiembrosCSV, parseCSV, downloadFile } from '../utils/csvEngine';
import { Search, Plus, Download, Upload, Trash2, Edit2, CheckCircle2, AlertCircle, X, Users, CreditCard, ShieldCheck } from 'lucide-react';

interface MiembrosViewProps {
  miembros: Miembro[];
  onAddMiembro: (item: Omit<Miembro, 'ID_Miembro'>) => void;
  onUpdateMiembro: (item: Miembro) => void;
  onDeleteMiembro: (id: number) => void;
  onImportMiembros: (items: Miembro[]) => void;
  onNavigateToCuotasWithMember?: (nombre: string) => void;
}

export const MiembrosView: React.FC<MiembrosViewProps> = ({
  miembros,
  onAddMiembro,
  onUpdateMiembro,
  onDeleteMiembro,
  onImportMiembros,
  onNavigateToCuotasWithMember,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondicion, setFilterCondicion] = useState<string>('ALL');
  const [filterGrupo, setFilterGrupo] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Miembro | null>(null);

  const [formData, setFormData] = useState({
    Miembro_Aspirante: '',
    Condicion: 'Miembro' as CondicionMiembro,
    DUI: '',
    Celular: '',
    Correo: '',
    Grupo_Horario: GRUPOS_HORARIOS_DEFAULT[0],
    Instructores: INSTRUCTORES_DEFAULT[0],
    Concepto_Pago: CONCEPTOS_PAGO_DEFAULT[0],
    Cuota: 25.00,
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredMiembros = useMemo(() => {
    return miembros.filter((m) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        m.Miembro_Aspirante.toLowerCase().includes(q) ||
        m.DUI.includes(q) ||
        m.Celular.includes(q) ||
        m.Correo.toLowerCase().includes(q) ||
        m.Instructores.toLowerCase().includes(q) ||
        m.Grupo_Horario.toLowerCase().includes(q);

      const matchesCondicion = filterCondicion === 'ALL' || m.Condicion === filterCondicion;
      const matchesGrupo = filterGrupo === 'ALL' || m.Grupo_Horario === filterGrupo;

      return matchesSearch && matchesCondicion && matchesGrupo;
    });
  }, [miembros, searchTerm, filterCondicion, filterGrupo]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      Miembro_Aspirante: '',
      Condicion: 'Miembro',
      DUI: '',
      Celular: '',
      Correo: '',
      Grupo_Horario: GRUPOS_HORARIOS_DEFAULT[0],
      Instructores: INSTRUCTORES_DEFAULT[0],
      Concepto_Pago: CONCEPTOS_PAGO_DEFAULT[0],
      Cuota: 25.00,
    });
    setFormErrors([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Miembro) => {
    setEditingItem(item);
    setFormData({
      Miembro_Aspirante: item.Miembro_Aspirante,
      Condicion: item.Condicion,
      DUI: item.DUI,
      Celular: item.Celular,
      Correo: item.Correo,
      Grupo_Horario: item.Grupo_Horario,
      Instructores: item.Instructores,
      Concepto_Pago: item.Concepto_Pago,
      Cuota: item.Cuota,
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
      errors.push('El nombre del miembro o aspirante es requerido.');
    }
    if (!formData.DUI.trim()) {
      errors.push('El DUI es requerido.');
    } else if (!/^[0-9]{8}-[0-9]$/.test(formData.DUI.trim())) {
      errors.push('El DUI debe cumplir con el formato salvadoreño 00000000-0.');
    }
    if (!formData.Celular.trim()) {
      errors.push('El número de celular es requerido.');
    }
    if (!formData.Correo.trim() || !formData.Correo.includes('@')) {
      errors.push('Ingrese un correo electrónico válido.');
    }
    if (!formData.Grupo_Horario) {
      errors.push('El grupo y horario es requerido.');
    }
    if (!formData.Instructores.trim()) {
      errors.push('El instructor o instructores son requeridos.');
    }
    if (!formData.Concepto_Pago.trim()) {
      errors.push('El concepto de pago es requerido.');
    }
    if (!formData.Cuota || formData.Cuota <= 0) {
      errors.push('La cuota debe ser un valor mayor a $0.00.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingItem) {
      onUpdateMiembro({
        ...editingItem,
        Miembro_Aspirante: formData.Miembro_Aspirante.trim(),
        Condicion: formData.Condicion,
        DUI: formData.DUI.trim(),
        Celular: formData.Celular.trim(),
        Correo: formData.Correo.trim(),
        Grupo_Horario: formData.Grupo_Horario,
        Instructores: formData.Instructores.trim(),
        Concepto_Pago: formData.Concepto_Pago.trim(),
        Cuota: Number(formData.Cuota),
      });
    } else {
      onAddMiembro({
        Miembro_Aspirante: formData.Miembro_Aspirante.trim(),
        Condicion: formData.Condicion,
        DUI: formData.DUI.trim(),
        Celular: formData.Celular.trim(),
        Correo: formData.Correo.trim(),
        Grupo_Horario: formData.Grupo_Horario,
        Instructores: formData.Instructores.trim(),
        Concepto_Pago: formData.Concepto_Pago.trim(),
        Cuota: Number(formData.Cuota),
        Fecha_Ingreso: new Date().toISOString().split('T')[0],
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
        const idIdx = headers.findIndex(h => h.includes('id_miembro'));
        const nameIdx = headers.findIndex(h => h.includes('miembro_aspirante'));
        const condIdx = headers.findIndex(h => h.includes('condicion'));
        const duiIdx = headers.findIndex(h => h.includes('dui'));
        const celIdx = headers.findIndex(h => h.includes('celular') || h.includes('telefono'));
        const corIdx = headers.findIndex(h => h.includes('correo') || h.includes('email'));
        const grupIdx = headers.findIndex(h => h.includes('grupo'));
        const instIdx = headers.findIndex(h => h.includes('instructor'));
        const concIdx = headers.findIndex(h => h.includes('concepto'));
        const cuotIdx = headers.findIndex(h => h.includes('cuota'));

        if (nameIdx === -1 || duiIdx === -1) {
          setNotification({
            message: 'Estructura CSV no coincide (columnas Miembro_Aspirante y DUI requeridas).',
            type: 'error',
          });
          return;
        }

        const newItems: Miembro[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row[nameIdx]) continue;

          const rawCuota = parseFloat(row[cuotIdx]?.replace('$', '') || '25.00');
          const condRaw = row[condIdx]?.trim();
          let cond: CondicionMiembro = 'Miembro';
          if (condRaw?.toLowerCase().includes('aspirante')) cond = 'Aspirante';
          else if (condRaw?.toLowerCase().includes('activo')) cond = 'Miembro Activo';
          else if (condRaw?.toLowerCase().includes('honorario')) cond = 'Honorario';

          const item: Miembro = {
            ID_Miembro: idIdx !== -1 && row[idIdx] ? parseInt(row[idIdx], 10) : Date.now() + i,
            Miembro_Aspirante: row[nameIdx],
            Condicion: cond,
            DUI: row[duiIdx] || '00000000-0',
            Celular: celIdx !== -1 && row[celIdx] ? row[celIdx] : '7000-0000',
            Correo: corIdx !== -1 && row[corIdx] ? row[corIdx] : 'estudiante@email.com',
            Grupo_Horario: grupIdx !== -1 && row[grupIdx] ? row[grupIdx] : GRUPOS_HORARIOS_DEFAULT[0],
            Instructores: instIdx !== -1 && row[instIdx] ? row[instIdx] : INSTRUCTORES_DEFAULT[0],
            Concepto_Pago: concIdx !== -1 && row[concIdx] ? row[concIdx] : CONCEPTOS_PAGO_DEFAULT[0],
            Cuota: isNaN(rawCuota) || rawCuota <= 0 ? 25.00 : rawCuota,
            Fecha_Ingreso: new Date().toISOString().split('T')[0],
          };
          newItems.push(item);
        }

        if (newItems.length > 0) {
          onImportMiembros(newItems);
          setNotification({ message: `Se importaron ${newItems.length} miembros exitosamente.`, type: 'success' });
        }
      } catch (err) {
        setNotification({ message: 'Error al procesar el archivo CSV de miembros.', type: 'error' });
      }
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  const handleExportCSV = () => {
    const csv = exportMiembrosCSV(filteredMiembros);
    downloadFile(csv, 'registro-miembros.csv');
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(filteredMiembros, null, 2);
    downloadFile(jsonStr, 'miembros_contrato.json', 'application/json');
  };

  // Stats calculation
  const totalMiembros = miembros.length;
  const aspirantesCount = miembros.filter(m => m.Condicion === 'Aspirante').length;
  const miembrosPlenosCount = totalMiembros - aspirantesCount;
  const recaudacionProyectada = miembros.reduce((acc, m) => acc + m.Cuota, 0);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Administración y Registro Maestro de Miembros
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Datos inmutables de identificación, régimen de cuotas y asignación académica · Escuela de Filosofía Nueva Acrópolis
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
            <span>Nuevo Miembro</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-500 block">Total Estudiantes Registrados:</span>
          <span className="text-xl font-bold font-mono tabular-nums text-slate-900">{totalMiembros}</span>
        </div>
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-500 block">Miembros Plenos:</span>
          <span className="text-xl font-bold font-mono tabular-nums text-slate-900">{miembrosPlenosCount}</span>
        </div>
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-500 block">Aspirantes de Ingreso:</span>
          <span className="text-xl font-bold font-mono tabular-nums text-slate-900">{aspirantesCount}</span>
        </div>
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-500 block">Proyección Mensual Cuotas:</span>
          <span className="text-xl font-bold font-mono tabular-nums text-emerald-700">${recaudacionProyectada.toFixed(2)}</span>
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

      {/* Filters and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, DUI, celular, correo o instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-slate-50/50"
          />
        </div>

        <div>
          <select
            value={filterCondicion}
            onChange={(e) => setFilterCondicion(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-white"
          >
            <option value="ALL">Todas las condiciones</option>
            <option value="Miembro">Miembro</option>
            <option value="Aspirante">Aspirante</option>
            <option value="Miembro Activo">Miembro Activo</option>
            <option value="Honorario">Honorario</option>
          </select>
        </div>

        <div>
          <select
            value={filterGrupo}
            onChange={(e) => setFilterGrupo(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-white"
          >
            <option value="ALL">Todos los grupos y horarios</option>
            {GRUPOS_HORARIOS_DEFAULT.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* High-density Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-12">ID</th>
                <th className="py-2.5 px-3">Miembro / Aspirante</th>
                <th className="py-2.5 px-3">Condición</th>
                <th className="py-2.5 px-3">DUI</th>
                <th className="py-2.5 px-3">Celular</th>
                <th className="py-2.5 px-3">Correo</th>
                <th className="py-2.5 px-3">Grupo y Horario</th>
                <th className="py-2.5 px-3">Instructores</th>
                <th className="py-2.5 px-3">Concepto Pago</th>
                <th className="py-2.5 px-3 text-right">Cuota</th>
                <th className="py-2.5 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMiembros.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    No se encontraron miembros con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredMiembros.map((item) => (
                  <tr key={item.ID_Miembro} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-400 tabular-nums">
                      #{item.ID_Miembro}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                      {item.Miembro_Aspirante}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`font-semibold ${
                        item.Condicion === 'Aspirante'
                          ? 'text-amber-800'
                          : item.Condicion === 'Miembro Activo'
                          ? 'text-emerald-800'
                          : 'text-slate-800'
                      }`}>
                        {item.Condicion}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 tabular-nums whitespace-nowrap">
                      {item.DUI}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 tabular-nums whitespace-nowrap">
                      {item.Celular}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-[150px] truncate" title={item.Correo}>
                      {item.Correo}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={item.Grupo_Horario}>
                      {item.Grupo_Horario}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      {item.Instructores}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px] truncate max-w-[140px]" title={item.Concepto_Pago}>
                      {item.Concepto_Pago}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      ${item.Cuota.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                      {onNavigateToCuotasWithMember && (
                        <button
                          onClick={() => onNavigateToCuotasWithMember(item.Miembro_Aspirante)}
                          title="Cobrar cuota en módulo de Cuotas"
                          className="p-1 text-slate-400 hover:text-emerald-700 rounded transition-colors cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(item)}
                        title="Editar datos del miembro"
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteMiembro(item.ID_Miembro)}
                        title="Eliminar miembro"
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
          <span>{filteredMiembros.length} miembros visualizados</span>
          <span className="font-mono tabular-nums font-semibold text-slate-800">
            Cuota proyectada en vista: ${filteredMiembros.reduce((acc, m) => acc + m.Cuota, 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-700" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingItem ? 'Editar Datos del Miembro' : 'Ingresar Nuevo Miembro (Datos Inmutables)'}
                </h3>
              </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Miembro / Aspirante (Nombre Completo) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Roberto Alexander Martínez"
                    value={formData.Miembro_Aspirante}
                    onChange={(e) => setFormData({ ...formData, Miembro_Aspirante: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Condición *
                  </label>
                  <select
                    value={formData.Condicion}
                    onChange={(e) => setFormData({ ...formData, Condicion: e.target.value as CondicionMiembro })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden bg-white"
                  >
                    <option value="Miembro">Miembro</option>
                    <option value="Aspirante">Aspirante</option>
                    <option value="Miembro Activo">Miembro Activo</option>
                    <option value="Honorario">Honorario</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    DUI (00000000-0) *
                  </label>
                  <input
                    type="text"
                    placeholder="01234567-8"
                    maxLength={10}
                    required
                    value={formData.DUI}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^0-9-]/g, '');
                      if (val.length === 8 && !val.includes('-')) {
                        val = val + '-';
                      }
                      setFormData({ ...formData, DUI: val });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Celular / WhatsApp *
                  </label>
                  <input
                    type="text"
                    placeholder="7890-1234"
                    required
                    value={formData.Celular}
                    onChange={(e) => setFormData({ ...formData, Celular: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    placeholder="estudiante@email.com"
                    required
                    value={formData.Correo}
                    onChange={(e) => setFormData({ ...formData, Correo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Grupo y Horario *
                </label>
                <select
                  value={formData.Grupo_Horario}
                  onChange={(e) => setFormData({ ...formData, Grupo_Horario: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden bg-white"
                >
                  {GRUPOS_HORARIOS_DEFAULT.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Instructores Asignados *
                </label>
                <select
                  value={formData.Instructores}
                  onChange={(e) => setFormData({ ...formData, Instructores: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden bg-white"
                >
                  {INSTRUCTORES_DEFAULT.map((inst) => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Concepto Pago *
                  </label>
                  <select
                    value={formData.Concepto_Pago}
                    onChange={(e) => setFormData({ ...formData, Concepto_Pago: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden bg-white"
                  >
                    {CONCEPTOS_PAGO_DEFAULT.map((cp) => (
                      <option key={cp} value={cp}>{cp}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Cuota Mensual Base ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.Cuota}
                    onChange={(e) => setFormData({ ...formData, Cuota: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden font-mono"
                  />
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
                  {editingItem ? 'Guardar Cambios' : 'Ingresar Miembro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
