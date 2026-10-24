import React, { useState, useMemo } from 'react';
import { CuotaMembresia, ReporteMora, Miembro } from '../types/models';
import { GRUPOS_HORARIOS_DEFAULT, MESES_CALENDARIO, METODOS_PAGO_DEFAULT } from '../data/seedData';
import { exportCuotasCSV, parseCSV, downloadFile } from '../utils/csvEngine';
import { validateEntityPayload } from '../contracts/jsonContracts';
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
  AlertTriangle,
  Info,
  UserCheck,
  Calendar,
  Percent,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Sysdate local al lugar de registro (garantiza la fecha del sistema en timezone local)
const getLocalSysdate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Obtiene el nombre del mes en español a partir de una fecha YYYY-MM-DD
const getMonthNameFromDate = (dateStr: string): string => {
  if (!dateStr) return MESES_CALENDARIO[new Date().getMonth()];
  const parts = dateStr.split('-');
  if (parts.length >= 2) {
    const mIdx = parseInt(parts[1], 10) - 1;
    if (mIdx >= 0 && mIdx < MESES_CALENDARIO.length) {
      return MESES_CALENDARIO[mIdx];
    }
  }
  return MESES_CALENDARIO[new Date().getMonth()];
};

interface CuotasViewProps {
  cuotas: CuotaMembresia[];
  moraList?: ReporteMora[];
  miembros?: Miembro[];
  onAddCuota: (item: Omit<CuotaMembresia, 'ID_Registro'>) => void;
  onUpdateCuota: (item: CuotaMembresia) => void;
  onDeleteCuota: (id: number) => void;
  onImportCuotas: (newItems: CuotaMembresia[]) => void;
  isAddModalOpenInitially?: boolean;
  initialMemberNamePreset?: string;
  onCloseInitialModal?: () => void;
}

export const CuotasView: React.FC<CuotasViewProps> = ({
  cuotas,
  moraList = [],
  miembros = [],
  onAddCuota,
  onUpdateCuota,
  onDeleteCuota,
  onImportCuotas,
  isAddModalOpenInitially = false,
  initialMemberNamePreset,
  onCloseInitialModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrupo, setFilterGrupo] = useState('ALL');
  const [filterMes, setFilterMes] = useState('ALL');
  const [filterMetodo, setFilterMetodo] = useState('ALL');
  const [onlyMoraFilter, setOnlyMoraFilter] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);
  const [editingItem, setEditingItem] = useState<CuotaMembresia | null>(null);

  // Form State (DUI, Grupo y Mes que cubre la cuota se derivan automáticamente)
  const [formData, setFormData] = useState({
    Miembro_Aspirante: initialMemberNamePreset || '',
    Monto_Cuota: 25.00,
    Fecha_Pago: getLocalSysdate(),
    Metodo_Pago: 'Págala',
    Referencia: '',
  });
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [importNotification, setImportNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Map of members with active mora
  const moraMap = useMemo(() => {
    const map = new Map<string, ReporteMora>();
    moraList.forEach((m) => {
      if (m.Saldo_Actual > 0) {
        map.set(m.Miembro_Aspirante.trim().toLowerCase(), m);
      }
    });
    return map;
  }, [moraList]);

  // Check if current form student has active mora
  const currentMemberMora = useMemo(() => {
    if (!formData.Miembro_Aspirante.trim()) return null;
    return moraMap.get(formData.Miembro_Aspirante.trim().toLowerCase()) || null;
  }, [formData.Miembro_Aspirante, moraMap]);

  // Matched member from master catalogue
  const selectedMember = useMemo(() => {
    if (!formData.Miembro_Aspirante.trim()) return null;
    return (
      miembros.find(
        (m) => m.Miembro_Aspirante.trim().toLowerCase() === formData.Miembro_Aspirante.trim().toLowerCase()
      ) || null
    );
  }, [formData.Miembro_Aspirante, miembros]);

  const filteredCuotas = useMemo(() => {
    return cuotas.filter((item) => {
      const matchesSearch =
        item.Miembro_Aspirante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.DUI && item.DUI.includes(searchTerm)) ||
        (item.Referencia && item.Referencia.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesGrupo = filterGrupo === 'ALL' || item.Grupo_Horario === filterGrupo;
      const matchesMes = filterMes === 'ALL' || item.Mes_Pagado === filterMes;
      const matchesMetodo = filterMetodo === 'ALL' || item.Metodo_Pago === filterMetodo;
      const matchesMora = !onlyMoraFilter || moraMap.has(item.Miembro_Aspirante.trim().toLowerCase());

      return matchesSearch && matchesGrupo && matchesMes && matchesMetodo && matchesMora;
    });
  }, [cuotas, searchTerm, filterGrupo, filterMes, filterMetodo, onlyMoraFilter, moraMap]);

  // Estado para desplegar el listado de miembros activos pagados / pendientes al pie de la tabla
  const [showActiveMembersBreakdown, setShowActiveMembersBreakdown] = useState(false);

  // Miembros en estado activo (registrados en catálogo con cuota asignada, excluyendo honorarios)
  const activeMembers = useMemo(() => {
    return miembros.filter((m) => m.Condicion !== 'Honorario');
  }, [miembros]);

  // Miembros activos que ya tienen registrado al menos un pago en el mes filtrado
  const activeMembersPaidInMonth = useMemo(() => {
    if (filterMes === 'ALL') return [];
    const paidNames = new Set(
      cuotas
        .filter((c) => c.Mes_Pagado.toLowerCase() === filterMes.toLowerCase())
        .map((c) => c.Miembro_Aspirante.trim().toLowerCase())
    );
    return activeMembers.filter((m) => paidNames.has(m.Miembro_Aspirante.trim().toLowerCase()));
  }, [cuotas, activeMembers, filterMes]);

  // Miembros activos que aún no han pagado en el mes filtrado
  const activeMembersPendingInMonth = useMemo(() => {
    if (filterMes === 'ALL') return [];
    const paidIds = new Set(activeMembersPaidInMonth.map((m) => m.ID_Miembro));
    return activeMembers.filter((m) => !paidIds.has(m.ID_Miembro));
  }, [activeMembers, activeMembersPaidInMonth, filterMes]);

  // Porcentaje calculado en tiempo real de cuántos miembros activos ya pagaron en el mes
  const activePaidPercentage = useMemo(() => {
    if (filterMes === 'ALL' || activeMembers.length === 0) return 0;
    return Math.round((activeMembersPaidInMonth.length / activeMembers.length) * 100);
  }, [activeMembers.length, activeMembersPaidInMonth.length, filterMes]);

  // Autocomplete & sync member selection
  const handleMemberChange = (nameVal: string) => {
    const matched = miembros.find((m) => m.Miembro_Aspirante.toLowerCase() === nameVal.trim().toLowerCase());
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        Miembro_Aspirante: matched.Miembro_Aspirante,
        Monto_Cuota: matched.Cuota || prev.Monto_Cuota,
      }));
    } else {
      setFormData((prev) => ({ ...prev, Miembro_Aspirante: nameVal }));
    }
  };

  const handleOpenAdd = (presetMember?: string) => {
    setEditingItem(null);
    const targetMember = presetMember || initialMemberNamePreset || '';
    const matched = targetMember
      ? miembros.find((m) => m.Miembro_Aspirante.toLowerCase() === targetMember.toLowerCase())
      : null;

    setFormData({
      Miembro_Aspirante: targetMember,
      Monto_Cuota: matched ? matched.Cuota : 25.00,
      Fecha_Pago: getLocalSysdate(),
      Metodo_Pago: 'Págala',
      Referencia: '',
    });
    setShowMemberDetails(false);
    setFormErrors([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CuotaMembresia) => {
    setEditingItem(item);
    setFormData({
      Miembro_Aspirante: item.Miembro_Aspirante,
      Monto_Cuota: item.Monto_Cuota,
      Fecha_Pago: item.Fecha_Pago || getLocalSysdate(),
      Metodo_Pago: item.Metodo_Pago,
      Referencia: item.Referencia || '',
    });
    setShowMemberDetails(false);
    setFormErrors([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setShowMemberDetails(false);
    if (onCloseInitialModal) onCloseInitialModal();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!formData.Miembro_Aspirante.trim()) {
      errors.push('El miembro es requerido.');
    }
    if (!formData.Monto_Cuota || formData.Monto_Cuota <= 0) {
      errors.push('El monto de la cuota debe ser mayor a 0.00.');
    }
    if (!formData.Fecha_Pago) {
      errors.push('La fecha de abono es requerida.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    // Se derivan automáticamente DUI, Grupo y Mes que cubre la cuota
    const matched = miembros.find(
      (m) => m.Miembro_Aspirante.trim().toLowerCase() === formData.Miembro_Aspirante.trim().toLowerCase()
    );

    const derivedDUI = matched?.DUI || editingItem?.DUI || undefined;
    const derivedGrupo = matched?.Grupo_Horario || editingItem?.Grupo_Horario || GRUPOS_HORARIOS_DEFAULT[0];
    const derivedMes = editingItem?.Mes_Pagado || getMonthNameFromDate(formData.Fecha_Pago);

    if (editingItem) {
      onUpdateCuota({
        ...editingItem,
        Miembro_Aspirante: formData.Miembro_Aspirante.trim(),
        DUI: derivedDUI,
        Grupo_Horario: derivedGrupo,
        Mes_Pagado: derivedMes,
        Monto_Cuota: Number(formData.Monto_Cuota),
        Fecha_Pago: formData.Fecha_Pago,
        Metodo_Pago: formData.Metodo_Pago,
        Referencia: formData.Referencia.trim() || undefined,
      });
    } else {
      onAddCuota({
        Miembro_Aspirante: formData.Miembro_Aspirante.trim(),
        DUI: derivedDUI,
        Grupo_Horario: derivedGrupo,
        Mes_Pagado: derivedMes,
        Monto_Cuota: Number(formData.Monto_Cuota),
        Fecha_Pago: formData.Fecha_Pago,
        Metodo_Pago: formData.Metodo_Pago,
        Referencia: formData.Referencia.trim() || undefined,
      });
    }

    handleCloseModal();
  };

  // CSV Import handler
  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length < 2) {
          setImportNotification({ message: 'El archivo CSV está vacío o carece de registros.', type: 'error' });
          return;
        }

        const headers = rows[0].map(h => h.trim().toLowerCase());
        const idIdx = headers.findIndex(h => h.includes('id_registro'));
        const nameIdx = headers.findIndex(h => h.includes('miembro_aspirante'));
        const duiIdx = headers.findIndex(h => h.includes('dui'));
        const grupoIdx = headers.findIndex(h => h.includes('grupo_horario'));
        const mesIdx = headers.findIndex(h => h.includes('mes_pagado'));
        const montoIdx = headers.findIndex(h => h.includes('monto_cuota'));
        const fechaIdx = headers.findIndex(h => h.includes('fecha_pago'));
        const metodoIdx = headers.findIndex(h => h.includes('metodo_pago'));
        const refIdx = headers.findIndex(h => h.includes('referencia'));

        if (nameIdx === -1 || montoIdx === -1) {
          setImportNotification({
            message: 'Estructura CSV no coincide con 1-Registro-cuotas-membresia.csv (columnas Miembro_Aspirante y Monto_Cuota requeridas).',
            type: 'error',
          });
          return;
        }

        const newCuotas: CuotaMembresia[] = [];
        let validationErrorsCount = 0;

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row[nameIdx]) continue;

          const monto = parseFloat(row[montoIdx]?.replace('$', '') || '0');
          const cuota: CuotaMembresia = {
            ID_Registro: idIdx !== -1 && row[idIdx] ? parseInt(row[idIdx], 10) : Date.now() + i,
            Miembro_Aspirante: row[nameIdx] || 'Estudiante',
            DUI: duiIdx !== -1 ? row[duiIdx] : undefined,
            Grupo_Horario: grupoIdx !== -1 && row[grupoIdx] ? row[grupoIdx] : GRUPOS_HORARIOS_DEFAULT[0],
            Mes_Pagado: mesIdx !== -1 && row[mesIdx] ? row[mesIdx] : 'Febrero',
            Monto_Cuota: isNaN(monto) || monto <= 0 ? 25.0 : monto,
            Fecha_Pago: fechaIdx !== -1 && row[fechaIdx] ? row[fechaIdx] : new Date().toISOString().split('T')[0],
            Metodo_Pago: metodoIdx !== -1 && row[metodoIdx] ? row[metodoIdx] : 'Págala',
            Referencia: refIdx !== -1 ? row[refIdx] : undefined,
          };

          const val = validateEntityPayload('cuotas', cuota);
          if (!val.valid) validationErrorsCount++;
          newCuotas.push(cuota);
        }

        if (newCuotas.length > 0) {
          onImportCuotas(newCuotas);
          setImportNotification({
            message: `Se importaron ${newCuotas.length} registros exitosamente${validationErrorsCount > 0 ? ` (${validationErrorsCount} requirieron ajuste)` : ''}.`,
            type: 'success',
          });
        }
      } catch (err) {
        setImportNotification({ message: 'Error al procesar el archivo CSV.', type: 'error' });
      }
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  const handleExportCSV = () => {
    const csvContent = exportCuotasCSV(filteredCuotas);
    downloadFile(csvContent, '1-Registro-cuotas-membresia.csv');
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(filteredCuotas, null, 2);
    downloadFile(jsonStr, 'cuotas_membresia_contrato.json', 'application/json');
  };

  const membersInMoraCount = moraMap.size;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Registro y Gestión de Cuotas de Membresía
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Archivo de referencia: <span className="font-mono text-slate-700">1-Registro-cuotas-membresia.csv</span> · Gestión operativa de cobros, amortización y mora
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
            onClick={() => handleOpenAdd()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Nuevo Pago de Cuota</span>
          </button>
        </div>
      </div>

      {/* Mora Management Banner */}
      {membersInMoraCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="text-amber-900 font-medium">
              Hay <strong className="font-bold">{membersInMoraCount} miembros</strong> con cuotas en mora en el sistema. Los pagos registrados en esta vista amortizan su deuda en tiempo real.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setOnlyMoraFilter(!onlyMoraFilter)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                onlyMoraFilter
                  ? 'bg-amber-800 text-white'
                  : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              {onlyMoraFilter ? 'Mostrando solo miembros con mora' : 'Filtrar miembros con mora'}
            </button>
          </div>
        </div>
      )}

      {/* Notification Banner if any */}
      {importNotification && (
        <div className={`p-3 rounded-md text-xs flex items-center justify-between ${importNotification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
          <div className="flex items-center gap-2">
            {importNotification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{importNotification.message}</span>
          </div>
          <button onClick={() => setImportNotification(null)} className="cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, DUI o referencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-slate-50/50"
          />
        </div>

        <div>
          <select
            value={filterGrupo}
            onChange={(e) => setFilterGrupo(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-white"
          >
            <option value="ALL">Todos los grupos horarios</option>
            {GRUPOS_HORARIOS_DEFAULT.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterMes}
            onChange={(e) => setFilterMes(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-white"
          >
            <option value="ALL">Todos los meses</option>
            {MESES_CALENDARIO.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterMetodo}
            onChange={(e) => setFilterMetodo(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-white"
          >
            <option value="ALL">Todos los métodos de pago</option>
            {METODOS_PAGO_DEFAULT.map((mp) => (
              <option key={mp} value={mp}>{mp}</option>
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
                <th className="py-2.5 px-3 w-14">ID</th>
                <th className="py-2.5 px-3">Miembro / Aspirante</th>
                <th className="py-2.5 px-3">DUI</th>
                <th className="py-2.5 px-3">Grupo Horario</th>
                <th className="py-2.5 px-3">Mes</th>
                <th className="py-2.5 px-3 text-right">Monto</th>
                <th className="py-2.5 px-3">Fecha Pago</th>
                <th className="py-2.5 px-3">Método</th>
                <th className="py-2.5 px-3">Referencia</th>
                <th className="py-2.5 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCuotas.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No se encontraron pagos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredCuotas.map((item: CuotaMembresia) => {
                  const memberMora = moraMap.get(item.Miembro_Aspirante.trim().toLowerCase());
                  return (
                    <tr key={item.ID_Registro} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400 tabular-nums">
                        #{item.ID_Registro}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{item.Miembro_Aspirante}</span>
                          {memberMora && (
                            <span
                              title={`Mora activa: $${memberMora.Saldo_Actual.toFixed(2)} (${memberMora.Meses_En_Mora} meses)`}
                              className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200"
                            >
                              Mora: ${memberMora.Saldo_Actual.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 tabular-nums">
                        {item.DUI || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={item.Grupo_Horario}>
                        {item.Grupo_Horario}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {item.Mes_Pagado}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                        ${item.Monto_Cuota.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 tabular-nums">
                        {item.Fecha_Pago}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {item.Metodo_Pago}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px] truncate max-w-[120px]" title={item.Referencia}>
                        {item.Referencia || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Editar registro"
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteCuota(item.ID_Registro)}
                          title="Eliminar registro"
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
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span>{filteredCuotas.length} registros visualizados en tabla</span>
          <span className="font-mono tabular-nums font-semibold text-slate-800">
            Total recaudado en vista: ${filteredCuotas.reduce((acc: number, c: CuotaMembresia) => acc + c.Monto_Cuota, 0).toFixed(2)}
          </span>
        </div>

        {/* Pie de tabla: Porcentaje de miembros en estado activo que ya pagaron al filtrar un mes */}
        <div className="border-t border-slate-200 bg-linear-to-r from-slate-50 via-slate-50/80 to-slate-100 p-4">
          {filterMes !== 'ALL' ? (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">
                        Cumplimiento de Miembros Activos · {filterMes}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {activePaidPercentage}% pagado
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      <strong className="text-slate-900 font-semibold">{activeMembersPaidInMonth.length}</strong> de <strong className="text-slate-900 font-semibold">{activeMembers.length}</strong> miembros en estado activo han pagado su cuota correspondiente al mes de {filterMes}.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowActiveMembersBreakdown(!showActiveMembersBreakdown)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{showActiveMembersBreakdown ? 'Ocultar Detalle' : 'Ver Detalle de Miembros'}</span>
                    {showActiveMembersBreakdown ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Barra de progreso visual */}
              <div className="space-y-1">
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      activePaidPercentage >= 80
                        ? 'bg-emerald-600'
                        : activePaidPercentage >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(activePaidPercentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {activeMembersPaidInMonth.length} solventes ({activePaidPercentage}%)
                  </span>
                  <span className="flex items-center gap-1 text-amber-700 font-medium">
                    <Clock className="w-3 h-3 text-amber-600" />
                    {activeMembersPendingInMonth.length} pendientes ({100 - activePaidPercentage}%)
                  </span>
                </div>
              </div>

              {/* Desglose desplegable de solventes y pendientes */}
              {showActiveMembersBreakdown && (
                <div className="pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Miembros que ya pagaron */}
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-100">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Ya Pagaron en {filterMes} ({activeMembersPaidInMonth.length})
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {activePaidPercentage}%
                      </span>
                    </div>
                    {activeMembersPaidInMonth.length === 0 ? (
                      <p className="text-slate-400 text-[11px] py-2 text-center">Ningún miembro activo ha registrado pago en {filterMes}.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {activeMembersPaidInMonth.map((m) => (
                          <div key={m.ID_Miembro} className="flex items-center justify-between py-1.5 px-2 rounded bg-emerald-50/60 text-[11px]">
                            <div>
                              <span className="font-semibold text-slate-800 block">{m.Miembro_Aspirante}</span>
                              <span className="text-[10px] text-slate-400">{m.Condicion} · {m.Grupo_Horario}</span>
                            </div>
                            <span className="font-mono font-bold text-emerald-700">${m.Cuota.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Miembros pendientes */}
                  <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-100">
                      <span className="font-bold text-amber-950 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Pendientes de Pago en {filterMes} ({activeMembersPendingInMonth.length})
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {100 - activePaidPercentage}%
                      </span>
                    </div>
                    {activeMembersPendingInMonth.length === 0 ? (
                      <p className="text-emerald-700 font-medium text-[11px] py-2 text-center">¡Todos los miembros activos están al día en {filterMes}!</p>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {activeMembersPendingInMonth.map((m) => (
                          <div key={m.ID_Miembro} className="flex items-center justify-between py-1.5 px-2 rounded bg-amber-50/60 text-[11px]">
                            <div>
                              <span className="font-semibold text-slate-800 block">{m.Miembro_Aspirante}</span>
                              <span className="text-[10px] text-slate-400">{m.Condicion} · Tel: {m.Celular}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-700">${m.Cuota.toFixed(2)}</span>
                              <button
                                type="button"
                                onClick={() => handleOpenAdd(m.Miembro_Aspirante)}
                                className="px-2 py-1 bg-slate-900 text-white rounded text-[10px] font-semibold hover:bg-slate-800 cursor-pointer shadow-2xs transition-colors"
                                title="Cobrar cuota de este miembro"
                              >
                                Cobrar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-200 text-slate-700 shrink-0">
                  <Percent className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">
                    Porcentaje de Miembros Activos con Cuota Pagada
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Seleccione un mes en el filtro de la tabla para calcular el porcentaje de cumplimiento y ver quiénes ya pagaron.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400">Filtrar mes rápido:</span>
                {['Enero', 'Febrero', 'Marzo'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFilterMes(m)}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shadow-2xs"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Editar Pago de Cuota' : 'Registrar Nuevo Pago de Cuota'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* In-modal Mora alert if member is in mora */}
            {currentMemberMora && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Amortización Automática de Mora</span>
                </div>
                <p>
                  <strong>{formData.Miembro_Aspirante}</strong> registra una deuda actual de{' '}
                  <span className="font-mono font-bold">${currentMemberMora.Saldo_Actual.toFixed(2)}</span> ({currentMemberMora.Meses_En_Mora} meses pendientes: {currentMemberMora.Detalle_Meses}).
                </p>
                <p className="text-amber-800 text-[11px]">
                  Al registrar este abono de <strong>${formData.Monto_Cuota}</strong>, el saldo de mora se recalculará automáticamente en tiempo real.
                </p>
              </div>
            )}

            {formErrors.length > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 space-y-1">
                {formErrors.map((err: string, i: number) => (
                  <p key={i}>· {err}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Campo Miembro con Autocompletado e Info */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium text-slate-700">
                    Miembro *
                  </label>
                  {selectedMember && (
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{selectedMember.Condicion} · Cuota: ${selectedMember.Cuota.toFixed(2)}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      list="miembros-autocomplete-list"
                      required
                      placeholder="Escriba o seleccione un miembro..."
                      value={formData.Miembro_Aspirante}
                      onChange={(e) => handleMemberChange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden text-slate-900 bg-white"
                    />
                    <datalist id="miembros-autocomplete-list">
                      {miembros.map((m) => (
                        <option key={m.ID_Miembro} value={m.Miembro_Aspirante}>
                          {m.Condicion} · {m.Grupo_Horario} (Cuota: ${m.Cuota})
                        </option>
                      ))}
                    </datalist>
                  </div>

                  {/* Botón de Info al final del Miembro */}
                  <button
                    type="button"
                    onClick={() => setShowMemberDetails(!showMemberDetails)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                      showMemberDetails
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                    }`}
                    title="Ver detalle y ficha completa de datos inmutables del miembro"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Info</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Autocompletable con los datos del catálogo de miembros. Pulse &quot;Info&quot; para consultar su ficha.
                </span>

                {/* Panel desplegable con el detalle inmutable del miembro */}
                {showMemberDetails && (
                  <div className="mt-2.5 p-3.5 bg-blue-50/80 border border-blue-200 rounded-lg text-xs space-y-2.5 animate-fadeIn">
                    {selectedMember ? (
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-blue-200/80">
                          <div className="flex items-center gap-1.5 font-bold text-blue-950">
                            <UserCheck className="w-4 h-4 text-blue-600" />
                            <span>Ficha del Miembro: {selectedMember.Miembro_Aspirante}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-blue-100 text-blue-800 border border-blue-200">
                            {selectedMember.Condicion}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2.5 text-slate-700">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">DUI</span>
                            <span className="font-mono text-slate-900 font-medium">{selectedMember.DUI || 'No registrado'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Celular</span>
                            <span className="font-mono text-slate-900">{selectedMember.Celular || '—'}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Correo Electrónico</span>
                            <span className="text-slate-900 break-all">{selectedMember.Correo || '—'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Grupo y Horario</span>
                            <span className="font-medium text-slate-900">{selectedMember.Grupo_Horario}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Instructores</span>
                            <span className="font-medium text-slate-900">{selectedMember.Instructores}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Concepto Pago</span>
                            <span className="text-slate-900">{selectedMember.Concepto_Pago}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Cuota Asignada</span>
                            <span className="font-mono font-bold text-slate-900">${selectedMember.Cuota.toFixed(2)}</span>
                          </div>
                        </div>

                        {currentMemberMora && (
                          <div className="mt-2.5 pt-2 border-t border-blue-200/80 flex items-center justify-between text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
                            <span className="font-semibold text-[11px]">Deuda en Mora Activa:</span>
                            <span className="font-mono font-bold text-xs">
                              ${currentMemberMora.Saldo_Actual.toFixed(2)} ({currentMemberMora.Meses_En_Mora} meses pendientes)
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-2 text-center text-slate-600">
                        <p className="font-medium text-slate-800">Miembro no seleccionado</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Seleccione un miembro de la lista para visualizar su ficha técnica completa.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Monto de la Cuota */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Monto Cuota ($ USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-mono">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.Monto_Cuota}
                    onChange={(e) => setFormData({ ...formData, Monto_Cuota: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden font-mono text-sm"
                  />
                </div>
              </div>

              {/* Fecha en que se realizó el abono: Sysdate local al lugar de registro */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium text-slate-700">
                    Fecha en que se Realizó el Abono *
                  </label>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    Sysdate local: {formData.Fecha_Pago}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={formData.Fecha_Pago}
                    onChange={(e) => setFormData({ ...formData, Fecha_Pago: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden font-mono bg-white"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Establecido automáticamente con el Sysdate local del sistema al lugar de registro ({formData.Fecha_Pago}).
                </p>
              </div>

              {/* Método de Pago y Referencia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Método de Pago *
                  </label>
                  <select
                    value={formData.Metodo_Pago}
                    onChange={(e) => setFormData({ ...formData, Metodo_Pago: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden bg-white"
                  >
                    {METODOS_PAGO_DEFAULT.map((mp) => (
                      <option key={mp} value={mp}>{mp}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Referencia / Comprobante
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. PAG-2026-9041 / TRF-889"
                    value={formData.Referencia}
                    onChange={(e) => setFormData({ ...formData, Referencia: e.target.value })}
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
                  {editingItem ? 'Guardar Cambios' : 'Registrar Pago de Cuota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
