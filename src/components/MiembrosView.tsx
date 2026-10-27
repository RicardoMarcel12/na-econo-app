import React, { useState, useMemo } from 'react';
import { Miembro } from '../types/models';
import { GRUPOS_HORARIOS_DEFAULT, INSTRUCTORES_DEFAULT, CONCEPTOS_PAGO_DEFAULT, CATALOGO_ESTATUS_DEFAULT } from '../data/seedData';
import { exportMiembrosCSV, parseCSV, downloadFile } from '../utils/csvEngine';
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
  Users,
  CreditCard,
  Tag,
  Settings2,
  RotateCcw,
  Check,
  AlertTriangle,
} from 'lucide-react';

import { TableSortHeader, cycleSort, sortRows, SortDirection } from './TableSortHeader';

interface MiembrosViewProps {
  miembros: Miembro[];
  catalogoEstatus?: string[];
  onAddEstatus?: (newStatus: string) => void;
  onUpdateEstatus?: (oldStatus: string, newStatus: string) => void;
  onDeleteEstatus?: (statusToDelete: string, fallbackStatus?: string) => void;
  onResetEstatus?: () => void;
  onAddMiembro: (item: Omit<Miembro, 'ID_Miembro'>) => void;
  onUpdateMiembro: (item: Miembro) => void;
  onDeleteMiembro: (id: number) => void;
  onImportMiembros: (items: Miembro[]) => void;
  onNavigateToCuotasWithMember?: (nombre: string) => void;
}

export function isEstatusInactivo(estatus?: string): boolean {
  if (!estatus) return false;
  return estatus.trim().startsWith('9');
}

export function isEstatusActivo(estatus?: string): boolean {
  if (!estatus) return true;
  return !estatus.trim().startsWith('9');
}

export interface EstatusBadgeStyle {
  bg: string;
  text: string;
  border: string;
  dot: string;
  colorName: string;
  isActivo: boolean;
}

/**
 * Insignias según el espectro ROYGBIV en orden descendente (01 con Violeta y así progresivamente).
 * Los estatus que comienzan con 9 son inactivos y tienen reservado el rojo en diferentes tonalidades.
 */
export function getEstatusBadgeStyle(estatus: string): EstatusBadgeStyle {
  if (!estatus) {
    return {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
      colorName: 'Neutro',
      isActivo: true,
    };
  }

  const trimmed = estatus.trim();

  // Códigos que comienzan con 9: INACTIVOS (reservados para el Rojo en sus diferentes tonalidades)
  if (trimmed.startsWith('9')) {
    if (trimmed.startsWith('99')) {
      // 99-Retirado: Rojo intenso / carmesí profundo
      return {
        bg: 'bg-red-100',
        text: 'text-red-950',
        border: 'border-red-300',
        dot: 'bg-red-700',
        colorName: 'Rojo Intenso',
        isActivo: false,
      };
    }
    if (trimmed.startsWith('98')) {
      // 98-Sospecha de retiro: Rojo suave / alerta coral
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-900',
        border: 'border-rose-300',
        dot: 'bg-rose-500',
        colorName: 'Rojo Suave / Alerta',
        isActivo: false,
      };
    }
    // Cualquier otro código 9x
    return {
      bg: 'bg-red-50',
      text: 'text-red-900',
      border: 'border-red-200',
      dot: 'bg-red-600',
      colorName: 'Rojo',
      isActivo: false,
    };
  }

  // Espectro ROYGBIV en orden descendente desde Violeta:
  // V (01) -> I (02) -> B (03) -> G (04) -> Y (05) -> O (06)
  if (trimmed.startsWith('01')) {
    // 01-J.F.: Violeta (V)
    return {
      bg: 'bg-purple-50',
      text: 'text-purple-900',
      border: 'border-purple-300',
      dot: 'bg-purple-600',
      colorName: 'Violeta (V)',
      isActivo: true,
    };
  }
  if (trimmed.startsWith('02')) {
    // 02-F.F.V.V.: Índigo (I)
    return {
      bg: 'bg-indigo-50',
      text: 'text-indigo-900',
      border: 'border-indigo-300',
      dot: 'bg-indigo-600',
      colorName: 'Índigo (I)',
      isActivo: true,
    };
  }
  if (trimmed.startsWith('03')) {
    // 03-Miembro: Azul (B)
    return {
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      border: 'border-blue-300',
      dot: 'bg-blue-600',
      colorName: 'Azul (B)',
      isActivo: true,
    };
  }
  if (trimmed.startsWith('04')) {
    // 04-Probacionista: Verde (G)
    return {
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-300',
      dot: 'bg-emerald-600',
      colorName: 'Verde (G)',
      isActivo: true,
    };
  }
  if (trimmed.startsWith('05')) {
    // 05-Inscrito: Amarillo (Y)
    return {
      bg: 'bg-yellow-50',
      text: 'text-yellow-950',
      border: 'border-yellow-300',
      dot: 'bg-yellow-500',
      colorName: 'Amarillo (Y)',
      isActivo: true,
    };
  }
  if (trimmed.startsWith('06')) {
    // 06-Ficha llena: Naranja (O)
    return {
      bg: 'bg-orange-50',
      text: 'text-orange-950',
      border: 'border-orange-300',
      dot: 'bg-orange-500',
      colorName: 'Naranja (O)',
      isActivo: true,
    };
  }
  if (trimmed.startsWith('07')) {
    // 07: Ámbar / Dorado
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-300',
      dot: 'bg-amber-500',
      colorName: 'Ámbar',
      isActivo: true,
    };
  }
  if (trimmed.startsWith('08')) {
    // 08: Lima
    return {
      bg: 'bg-lime-50',
      text: 'text-lime-900',
      border: 'border-lime-300',
      dot: 'bg-lime-500',
      colorName: 'Lima',
      isActivo: true,
    };
  }

  // Insignias que comienzan con número 1: Paleta activa distintiva y de alta legibilidad
  if (trimmed.startsWith('1')) {
    if (trimmed.startsWith('10')) {
      // 10: Cian / Celeste Eléctrico
      return {
        bg: 'bg-cyan-50',
        text: 'text-cyan-900',
        border: 'border-cyan-300',
        dot: 'bg-cyan-600',
        colorName: 'Cian / Celeste (10)',
        isActivo: true,
      };
    }
    if (trimmed.startsWith('11')) {
      // 11: Turquesa / Menta Profundo
      return {
        bg: 'bg-teal-50',
        text: 'text-teal-900',
        border: 'border-teal-300',
        dot: 'bg-teal-600',
        colorName: 'Turquesa / Teal (11)',
        isActivo: true,
      };
    }
    if (trimmed.startsWith('12')) {
      // 12: Magenta / Fucsia Vibrante
      return {
        bg: 'bg-fuchsia-50',
        text: 'text-fuchsia-900',
        border: 'border-fuchsia-300',
        dot: 'bg-fuchsia-600',
        colorName: 'Magenta / Fucsia (12)',
        isActivo: true,
      };
    }
    if (trimmed.startsWith('13')) {
      // 13: Orquídea / Púrpura Real
      return {
        bg: 'bg-violet-50',
        text: 'text-violet-900',
        border: 'border-violet-300',
        dot: 'bg-violet-600',
        colorName: 'Orquídea / Violeta (13)',
        isActivo: true,
      };
    }
    if (trimmed.startsWith('14')) {
      // 14: Lima / Menta Ácida
      return {
        bg: 'bg-lime-50',
        text: 'text-lime-950',
        border: 'border-lime-300',
        dot: 'bg-lime-600',
        colorName: 'Lima Fresco (14)',
        isActivo: true,
      };
    }
    if (trimmed.startsWith('15')) {
      // 15: Ámbar Miel / Cobre Cálido
      return {
        bg: 'bg-amber-100/70',
        text: 'text-amber-950',
        border: 'border-amber-400',
        dot: 'bg-amber-600',
        colorName: 'Ámbar Miel (15)',
        isActivo: true,
      };
    }
    if (trimmed.startsWith('16')) {
      // 16: Coral Cálido / Melocotón
      return {
        bg: 'bg-orange-100/70',
        text: 'text-orange-950',
        border: 'border-orange-300',
        dot: 'bg-orange-600',
        colorName: 'Melocotón / Coral (16)',
        isActivo: true,
      };
    }
    if (trimmed.startsWith('17')) {
      // 17: Rosa Rubí / Rose
      return {
        bg: 'bg-pink-50',
        text: 'text-pink-900',
        border: 'border-pink-300',
        dot: 'bg-pink-600',
        colorName: 'Rosa Rubí (17)',
        isActivo: true,
      };
    }
    if (trimmed.startsWith('18')) {
      // 18: Azul Acero / Sky Blue
      return {
        bg: 'bg-sky-100/70',
        text: 'text-sky-950',
        border: 'border-sky-300',
        dot: 'bg-sky-600',
        colorName: 'Azul Acero (18)',
        isActivo: true,
      };
    }
    if (trimmed.startsWith('19')) {
      // 19: Zafiro / Índigo Profundo
      return {
        bg: 'bg-indigo-100/70',
        text: 'text-indigo-950',
        border: 'border-indigo-400',
        dot: 'bg-indigo-700',
        colorName: 'Zafiro / Índigo Marino (19)',
        isActivo: true,
      };
    }
    // Cualquier otro estatus que comience con 1 (e.g. 1-Honorario, 100, etc.)
    return {
      bg: 'bg-teal-50',
      text: 'text-teal-900',
      border: 'border-teal-300',
      dot: 'bg-teal-600',
      colorName: 'Turquesa / Teal (Serie 1)',
      isActivo: true,
    };
  }

  // Cualquier otro estatus activo que no comience con 9
  return {
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300',
    dot: 'bg-slate-500',
    colorName: 'Activo',
    isActivo: true,
  };
}

export const MiembrosView: React.FC<MiembrosViewProps> = ({
  miembros,
  catalogoEstatus = CATALOGO_ESTATUS_DEFAULT,
  onAddEstatus,
  onUpdateEstatus,
  onDeleteEstatus,
  onResetEstatus,
  onAddMiembro,
  onUpdateMiembro,
  onDeleteMiembro,
  onImportMiembros,
  onNavigateToCuotasWithMember,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstatus, setFilterEstatus] = useState<string>('ALL');
  const [filterGrupo, setFilterGrupo] = useState<string>('ALL');

  // Table Sorting state (3-state toggle: default ID, asc, desc)
  const [sortKey, setSortKey] = useState<string>('default');
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: string) => {
    const next = cycleSort(sortKey, key, sortDirection);
    setSortKey(next.key);
    setSortDirection(next.direction);
  };

  // Member Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Miembro | null>(null);

  // Status Catalog Modal
  const [isStatusCatalogModalOpen, setIsStatusCatalogModalOpen] = useState(false);
  const [newStatusInput, setNewStatusInput] = useState('');
  const [editingStatusName, setEditingStatusName] = useState<string | null>(null);
  const [editingStatusValue, setEditingStatusValue] = useState('');
  const [deletingStatusName, setDeletingStatusName] = useState<string | null>(null);
  const [deleteFallbackStatus, setDeleteFallbackStatus] = useState<string>('');

  const [formData, setFormData] = useState({
    Miembro_Aspirante: '',
    Estatus: catalogoEstatus[2] || '03-Miembro',
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

  // Status member count map
  const memberCountByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const status of catalogoEstatus) {
      counts[status] = 0;
    }
    for (const m of miembros) {
      const st = m.Estatus || '03-Miembro';
      counts[st] = (counts[st] || 0) + 1;
    }
    return counts;
  }, [catalogoEstatus, miembros]);

  const filteredMiembros = useMemo(() => {
    return miembros.filter((m) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        m.Miembro_Aspirante.toLowerCase().includes(q) ||
        m.DUI.includes(q) ||
        m.Celular.includes(q) ||
        m.Correo.toLowerCase().includes(q) ||
        (m.Estatus && m.Estatus.toLowerCase().includes(q)) ||
        m.Instructores.toLowerCase().includes(q) ||
        m.Grupo_Horario.toLowerCase().includes(q);

      const matchesEstatus = filterEstatus === 'ALL' || (m.Estatus || '03-Miembro') === filterEstatus;
      const matchesGrupo = filterGrupo === 'ALL' || m.Grupo_Horario === filterGrupo;

      return matchesSearch && matchesEstatus && matchesGrupo;
    });
  }, [miembros, searchTerm, filterEstatus, filterGrupo]);

  const sortedMiembros = useMemo(() => {
    return sortRows(filteredMiembros, sortKey, sortDirection, 'ID_Miembro');
  }, [filteredMiembros, sortKey, sortDirection]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      Miembro_Aspirante: '',
      Estatus: catalogoEstatus[2] || '03-Miembro',
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
      Estatus: item.Estatus || '03-Miembro',
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
    if (!formData.Estatus?.trim()) {
      errors.push('El estatus institucional es requerido.');
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
        Estatus: formData.Estatus.trim(),
        DUI: formData.DUI.trim(),
        Celular: formData.Celular.trim(),
        Correo: formData.Correo.trim(),
        Grupo_Horario: formData.Grupo_Horario,
        Instructores: formData.Instructores.trim(),
        Concepto_Pago: formData.Concepto_Pago.trim(),
        Cuota: Number(formData.Cuota),
      });
      setNotification({ message: `Datos de ${formData.Miembro_Aspirante.trim()} actualizados correctamente.`, type: 'success' });
    } else {
      onAddMiembro({
        Miembro_Aspirante: formData.Miembro_Aspirante.trim(),
        Estatus: formData.Estatus.trim(),
        DUI: formData.DUI.trim(),
        Celular: formData.Celular.trim(),
        Correo: formData.Correo.trim(),
        Grupo_Horario: formData.Grupo_Horario,
        Instructores: formData.Instructores.trim(),
        Concepto_Pago: formData.Concepto_Pago.trim(),
        Cuota: Number(formData.Cuota),
        Fecha_Ingreso: new Date().toISOString().split('T')[0],
      });
      setNotification({ message: `Miembro ${formData.Miembro_Aspirante.trim()} ingresado exitosamente.`, type: 'success' });
    }

    handleCloseModal();
  };

  // Status Catalog Handlers
  const handleAddNewStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newStatusInput.trim();
    if (!val) return;
    if (onAddEstatus) {
      onAddEstatus(val);
      setNewStatusInput('');
      setNotification({ message: `Estatus "${val}" agregado al catálogo.`, type: 'success' });
    }
  };

  const handleStartEditStatus = (statusName: string) => {
    setEditingStatusName(statusName);
    setEditingStatusValue(statusName);
  };

  const handleSaveEditStatus = (oldName: string) => {
    const val = editingStatusValue.trim();
    if (!val || val === oldName) {
      setEditingStatusName(null);
      return;
    }
    if (onUpdateEstatus) {
      onUpdateEstatus(oldName, val);
      setEditingStatusName(null);
      setNotification({ message: `Estatus actualizado de "${oldName}" a "${val}".`, type: 'success' });
    }
  };

  const handleStartDeleteStatus = (statusName: string) => {
    const count = memberCountByStatus[statusName] || 0;
    const remaining = catalogoEstatus.filter((s) => s !== statusName);
    setDeletingStatusName(statusName);
    setDeleteFallbackStatus(remaining[0] || '03-Miembro');
    if (count === 0 && onDeleteEstatus) {
      if (confirm(`¿Desea eliminar el estatus "${statusName}" del catálogo?`)) {
        onDeleteEstatus(statusName);
        setDeletingStatusName(null);
        setNotification({ message: `Estatus "${statusName}" eliminado del catálogo.`, type: 'success' });
      }
    }
  };

  const handleConfirmDeleteWithReassignment = () => {
    if (!deletingStatusName || !onDeleteEstatus) return;
    onDeleteEstatus(deletingStatusName, deleteFallbackStatus);
    const deleted = deletingStatusName;
    setDeletingStatusName(null);
    setNotification({
      message: `Estatus "${deleted}" eliminado y miembros reasignados a "${deleteFallbackStatus}".`,
      type: 'success',
    });
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

        const headers = rows[0].map((h) => h.trim().toLowerCase());
        const idIdx = headers.findIndex((h) => h.includes('id_miembro'));
        const nameIdx = headers.findIndex((h) => h.includes('miembro_aspirante'));
        const estatusIdx = headers.findIndex((h) => h.includes('estatus'));
        const duiIdx = headers.findIndex((h) => h.includes('dui'));
        const celIdx = headers.findIndex((h) => h.includes('celular') || h.includes('telefono'));
        const corIdx = headers.findIndex((h) => h.includes('correo') || h.includes('email'));
        const grupIdx = headers.findIndex((h) => h.includes('grupo'));
        const instIdx = headers.findIndex((h) => h.includes('instructor'));
        const concIdx = headers.findIndex((h) => h.includes('concepto'));
        const cuotIdx = headers.findIndex((h) => h.includes('cuota'));

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
          const estatusVal =
            estatusIdx !== -1 && row[estatusIdx]
              ? row[estatusIdx].trim()
              : '03-Miembro';

          const item: Miembro = {
            ID_Miembro: idIdx !== -1 && row[idIdx] ? parseInt(row[idIdx], 10) : Date.now() + i,
            Miembro_Aspirante: row[nameIdx],
            Estatus: estatusVal,
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

  // Stats calculation: Los estatus que comienzan con 9 son inactivos; los demás son activos
  const totalMiembros = miembros.length;
  const activosCount = miembros.filter((m) => isEstatusActivo(m.Estatus)).length;
  const inactivosCount = miembros.filter((m) => isEstatusInactivo(m.Estatus)).length;
  const sospechaRetiroCount = miembros.filter((m) => m.Estatus?.startsWith('98')).length;
  const retiradosCount = miembros.filter((m) => m.Estatus?.startsWith('99')).length;
  const recaudacionProyectada = miembros
    .filter((m) => isEstatusActivo(m.Estatus))
    .reduce((acc, m) => acc + m.Cuota, 0);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Administración y Registro Maestro de Miembros</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de miembros, estatus institucional, régimen de cuotas y asignación académica · Escuela de Filosofía Nueva Acrópolis
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsStatusCatalogModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
            title="Administrar catálogo de estatus institucionales"
          >
            <Settings2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Administrador del Catálogo de Estatus</span>
          </button>
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
          <span className="text-slate-500 block">Miembros Activos (No 9x):</span>
          <span className="text-xl font-bold font-mono tabular-nums text-emerald-800">{activosCount}</span>
        </div>
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-500 block">Inactivos (Códigos 9):</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tabular-nums text-red-700">{inactivosCount}</span>
            <span className="text-[10px] text-slate-400">({sospechaRetiroCount} alerta / {retiradosCount} retirados)</span>
          </div>
        </div>
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-500 block">Proyección Mensual Cuotas:</span>
          <span className="text-xl font-bold font-mono tabular-nums text-emerald-700">
            ${recaudacionProyectada.toFixed(2)}
          </span>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-md text-xs flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filters and Search Bar (Condición removed; Estatus is primary) */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, DUI, celular, correo, estatus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-slate-50/50"
          />
        </div>

        <div>
          <select
            value={filterEstatus}
            onChange={(e) => setFilterEstatus(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-white"
          >
            <option value="ALL">Todos los estatus</option>
            {catalogoEstatus.map((st) => (
              <option key={st} value={st}>
                {st} ({memberCountByStatus[st] || 0})
              </option>
            ))}
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
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* High-density Table with Estatus (No Condición) */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <TableSortHeader
                  columnKey="ID_Miembro"
                  label="ID"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-16 font-mono"
                />
                <TableSortHeader
                  columnKey="Miembro_Aspirante"
                  label="Miembro / Aspirante"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  columnKey="Estatus"
                  label="Estatus"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  columnKey="DUI"
                  label="DUI"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  columnKey="Celular"
                  label="Celular"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  columnKey="Correo"
                  label="Correo"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  columnKey="Grupo_Horario"
                  label="Grupo y Horario"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  columnKey="Instructores"
                  label="Instructores"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  columnKey="Concepto_Pago"
                  label="Concepto Pago"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableSortHeader
                  columnKey="Cuota"
                  label="Cuota"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <th className="py-2.5 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedMiembros.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    No se encontraron miembros con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                sortedMiembros.map((item) => {
                  const estatus = item.Estatus || '03-Miembro';
                  const badgeStyle = getEstatusBadgeStyle(estatus);

                  return (
                    <tr key={item.ID_Miembro} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400 tabular-nums">
                        #{item.ID_Miembro}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                        {item.Miembro_Aspirante}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                          <span>{estatus}</span>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>{sortedMiembros.length} miembros visualizados</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400">
              Orden: {sortDirection === null || sortKey === 'default' ? 'Por defecto (ID)' : `${sortKey} (${sortDirection === 'asc' ? 'ascendente' : 'descendente'})`}
            </span>
          </div>
          <span className="font-mono tabular-nums font-semibold text-slate-800">
            Cuota proyectada en vista: ${sortedMiembros.reduce((acc, m) => acc + m.Cuota, 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Add / Edit Member Modal (Condición field removed, replaced with Estatus) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-700" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingItem ? 'Editar Datos del Miembro' : 'Ingresar Nuevo Miembro'}
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

              {/* Estatus Institucional & DUI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-medium text-slate-700">
                      Estatus Institucional *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsStatusCatalogModalOpen(true)}
                      className="text-[10px] text-blue-700 hover:underline cursor-pointer"
                    >
                      Gestionar catálogo...
                    </button>
                  </div>
                  <select
                    value={formData.Estatus}
                    onChange={(e) => setFormData({ ...formData, Estatus: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden bg-white font-medium"
                  >
                    {catalogoEstatus.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      {/* Administrador del Catálogo de Estatus Modal */}
      {isStatusCatalogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Administrador del Catálogo de Estatus
                  </h3>
                  <p className="text-xs text-slate-500">
                    Regla de Estatus: Los códigos que comienzan con 9 son inactivos (tonalidades rojas). Los activos siguen el espectro ROYGBIV descendente desde 01 Violeta.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsStatusCatalogModalOpen(false);
                  setEditingStatusName(null);
                  setDeletingStatusName(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddNewStatus} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Agregar Nuevo Estatus al Catálogo
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej. 07-Colaborador o 08-Instructor en prueba"
                  value={newStatusInput}
                  onChange={(e) => setNewStatusInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!newStatusInput.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 block">
                Se recomienda mantener el prefijo numérico ordenado (ej. 01-, 02-, 98-, 99-).
              </span>
            </form>

            {/* Reassignment Warning Box if deleting a status in use */}
            {deletingStatusName && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-3">
                <div className="flex items-start gap-2 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">
                      Reasignación requerida para eliminar &quot;{deletingStatusName}&quot;
                    </span>
                    <span className="text-amber-800">
                      Hay <strong>{memberCountByStatus[deletingStatusName] || 0}</strong> miembro(s) con este estatus.
                      Seleccione a qué estatus reasignarlos antes de borrarlo:
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={deleteFallbackStatus}
                    onChange={(e) => setDeleteFallbackStatus(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-md text-xs font-medium text-slate-900"
                  >
                    {catalogoEstatus
                      .filter((s) => s !== deletingStatusName)
                      .map((s) => (
                        <option key={s} value={s}>
                          Reasignar a: {s}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleConfirmDeleteWithReassignment}
                    className="px-3 py-1.5 bg-rose-700 text-white font-semibold rounded-md hover:bg-rose-800 cursor-pointer shadow-xs text-xs"
                  >
                    Confirmar y Reasignar
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingStatusName(null)}
                    className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 cursor-pointer text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Status Catalog List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  Estatus Actuales en Catálogo ({catalogoEstatus.length})
                </span>
                <span>Miembros Asignados</span>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
                {catalogoEstatus.map((statusName) => {
                  const count = memberCountByStatus[statusName] || 0;
                  const isEditing = editingStatusName === statusName;
                  const badgeStyle = getEstatusBadgeStyle(statusName);

                  return (
                    <div
                      key={statusName}
                      className="p-2.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-xs"
                    >
                      {isEditing ? (
                        <div className="flex-1 flex items-center gap-2 pr-3">
                          <input
                            type="text"
                            value={editingStatusValue}
                            onChange={(e) => setEditingStatusValue(e.target.value)}
                            className="flex-1 px-2.5 py-1 text-xs border border-indigo-400 rounded-md focus:outline-hidden bg-white"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditStatus(statusName)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                            title="Guardar nombre"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingStatusName(null)}
                            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                            title="Cancelar edición"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                            <span>{statusName}</span>
                          </span>
                          <span className="text-[10px] font-medium text-slate-500">
                            {badgeStyle.isActivo ? (
                              <span className="text-emerald-700 font-semibold">Activo</span>
                            ) : (
                              <span className="text-red-700 font-semibold">Inactivo (9x)</span>
                            )}{' '}
                            · {badgeStyle.colorName}
                          </span>
                        </div>
                      )}

                      {!isEditing && (
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono text-xs font-medium tabular-nums px-2 py-0.5 rounded ${
                              count > 0 ? 'bg-slate-100 text-slate-700 font-bold' : 'text-slate-400'
                            }`}
                          >
                            {count} {count === 1 ? 'miembro' : 'miembros'}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStartEditStatus(statusName)}
                              title="Editar nombre del estatus"
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartDeleteStatus(statusName)}
                              title="Eliminar del catálogo"
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer with Reset */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={onResetEstatus}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Restaurar la lista original de 8 estatus de Nueva Acrópolis"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Catálogo Predeterminado (8 Estatus)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsStatusCatalogModalOpen(false);
                  setEditingStatusName(null);
                  setDeletingStatusName(null);
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 font-semibold cursor-pointer shadow-xs"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
