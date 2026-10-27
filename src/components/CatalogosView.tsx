import React, { useState, useMemo } from 'react';
import {
  HorarioClase,
  Instructor,
  GrupoClase,
  DiaSemana,
  Miembro,
} from '../types/models';
import { DIAS_SEMANA_DEFAULT } from '../data/seedData';
import { TableSortHeader, cycleSort, sortRows, SortDirection } from './TableSortHeader';
import { getEstatusBadgeStyle, MiembrosView } from './MiembrosView';
import {
  Layers,
  Clock,
  UserCheck,
  FolderKanban,
  Tag,
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Check,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CatalogosViewProps {
  // Horarios
  horarios: HorarioClase[];
  onAddHorario: (horario: Omit<HorarioClase, 'ID_Horario'>) => HorarioClase;
  onUpdateHorario: (horario: HorarioClase) => void;
  onDeleteHorario: (id: number) => void;

  // Instructores
  instructores: Instructor[];
  onAddInstructor: (instructor: Omit<Instructor, 'ID_Instructor'>) => Instructor;
  onUpdateInstructor: (instructor: Instructor) => void;
  onDeleteInstructor: (id: number) => void;

  // Grupos
  grupos: GrupoClase[];
  onAddGrupo: (grupo: Omit<GrupoClase, 'ID_Grupo'>) => GrupoClase;
  onUpdateGrupo: (grupo: GrupoClase) => void;
  onDeleteGrupo: (id: number) => void;

  // Estatus
  catalogoEstatus: string[];
  onAddEstatus: (newStatus: string) => void;
  onUpdateEstatus: (oldStatus: string, newStatus: string) => void;
  onDeleteEstatus: (statusToDelete: string, fallbackStatus?: string) => void;
  onResetEstatus: () => void;

  // Miembros
  miembros: Miembro[];
  onAddMiembro: (item: Omit<Miembro, 'ID_Miembro'>) => void;
  onUpdateMiembro: (item: Miembro) => void;
  onDeleteMiembro: (id: number) => void;
  onImportMiembros: (items: Miembro[]) => void;
  onNavigateToCuotasWithMember?: (nombre: string) => void;
}

type CatalogoSubTab = 'grupos' | 'horarios' | 'instructores' | 'estatus' | 'miembros';

export const CatalogosView: React.FC<CatalogosViewProps> = ({
  horarios,
  onAddHorario,
  onUpdateHorario,
  onDeleteHorario,
  instructores,
  onAddInstructor,
  onUpdateInstructor,
  onDeleteInstructor,
  grupos,
  onAddGrupo,
  onUpdateGrupo,
  onDeleteGrupo,
  catalogoEstatus,
  onAddEstatus,
  onUpdateEstatus,
  onDeleteEstatus,
  onResetEstatus,
  miembros,
  onAddMiembro,
  onUpdateMiembro,
  onDeleteMiembro,
  onImportMiembros,
  onNavigateToCuotasWithMember,
}) => {
  const [subTab, setSubTab] = useState<CatalogoSubTab>('grupos');
  const [searchTerm, setSearchTerm] = useState('');

  // ----------------------------------------------------
  // SORTING STATES
  // ----------------------------------------------------
  const [sortKeyGrupos, setSortKeyGrupos] = useState<string>('default');
  const [sortDirGrupos, setSortDirGrupos] = useState<SortDirection>(null);

  const [sortKeyHorarios, setSortKeyHorarios] = useState<string>('default');
  const [sortDirHorarios, setSortDirHorarios] = useState<SortDirection>(null);

  const [sortKeyInstructores, setSortKeyInstructores] = useState<string>('default');
  const [sortDirInstructores, setSortDirInstructores] = useState<SortDirection>(null);

  const [sortKeyEstatus, setSortKeyEstatus] = useState<string>('default');
  const [sortDirEstatus, setSortDirEstatus] = useState<SortDirection>(null);

  // ----------------------------------------------------
  // MODAL STATES
  // ----------------------------------------------------
  // Grupo Modal
  const [isGrupoModalOpen, setIsGrupoModalOpen] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<GrupoClase | null>(null);
  const [grupoForm, setGrupoForm] = useState<{
    Numero_Grupo: string;
    ID_Horario: number;
    ID_Instructor: number;
  }>({
    Numero_Grupo: '',
    ID_Horario: horarios[0]?.ID_Horario || 1,
    ID_Instructor: instructores[0]?.ID_Instructor || 1,
  });

  // Quick Create Modal inside Grupo flow
  const [isQuickHorarioOpen, setIsQuickHorarioOpen] = useState(false);
  const [isQuickInstructorOpen, setIsQuickInstructorOpen] = useState(false);

  // Standalone Horario Modal
  const [isHorarioModalOpen, setIsHorarioModalOpen] = useState(false);
  const [editingHorario, setEditingHorario] = useState<HorarioClase | null>(null);
  const [horarioForm, setHorarioForm] = useState<{
    Dia: DiaSemana;
    Hora_Inicio: string;
    Hora_Fin: string;
  }>({
    Dia: 'Lunes',
    Hora_Inicio: '18:30',
    Hora_Fin: '20:30',
  });

  // Standalone Instructor Modal
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [instructorForm, setInstructorForm] = useState<{
    Nombre_Completo: string;
    Estatus: string;
  }>({
    Nombre_Completo: '',
    Estatus: catalogoEstatus[2] || '03-Miembro',
  });

  // Estatus Management Modal
  const [newStatusInput, setNewStatusInput] = useState('');
  const [editingStatusName, setEditingStatusName] = useState<string | null>(null);
  const [editingStatusValue, setEditingStatusValue] = useState('');
  const [deletingStatusName, setDeletingStatusName] = useState<string | null>(null);
  const [deleteFallbackStatus, setDeleteFallbackStatus] = useState<string>('');

  // ----------------------------------------------------
  // HELPERS
  // ----------------------------------------------------
  const findHorario = (id: number): HorarioClase | undefined => {
    return horarios.find((h) => h.ID_Horario === id);
  };

  const findInstructor = (id: number): Instructor | undefined => {
    return instructores.find((i) => i.ID_Instructor === id);
  };

  const formatHorarioText = (h?: HorarioClase): string => {
    if (!h) return 'Sin horario asignado';
    return `${h.Dia} ${h.Hora_Inicio} - ${h.Hora_Fin}`;
  };

  // ----------------------------------------------------
  // FILTERED & SORTED DATA
  // ----------------------------------------------------
  // Grupos enriched
  const enrichedGrupos = useMemo(() => {
    return grupos.map((g) => {
      const h = findHorario(g.ID_Horario);
      const inst = findInstructor(g.ID_Instructor);
      return {
        ...g,
        _horarioDisplay: formatHorarioText(h),
        _dia: h?.Dia || '',
        _instructorDisplay: inst?.Nombre_Completo || 'Sin instructor',
        _instructorEstatus: inst?.Estatus || '',
      };
    });
  }, [grupos, horarios, instructores]);

  const filteredGrupos = useMemo(() => {
    return enrichedGrupos.filter((g) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        g.Numero_Grupo.toLowerCase().includes(term) ||
        g._horarioDisplay.toLowerCase().includes(term) ||
        g._instructorDisplay.toLowerCase().includes(term) ||
        g._instructorEstatus.toLowerCase().includes(term)
      );
    });
  }, [enrichedGrupos, searchTerm]);

  const sortedGrupos = useMemo(() => {
    return sortRows(filteredGrupos, sortKeyGrupos, sortDirGrupos, 'ID_Grupo');
  }, [filteredGrupos, sortKeyGrupos, sortDirGrupos]);

  // Horarios
  const filteredHorarios = useMemo(() => {
    return horarios.filter((h) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        h.Dia.toLowerCase().includes(term) ||
        h.Hora_Inicio.includes(term) ||
        h.Hora_Fin.includes(term)
      );
    });
  }, [horarios, searchTerm]);

  const sortedHorarios = useMemo(() => {
    return sortRows(filteredHorarios, sortKeyHorarios, sortDirHorarios, 'ID_Horario');
  }, [filteredHorarios, sortKeyHorarios, sortDirHorarios]);

  // Instructores
  const filteredInstructores = useMemo(() => {
    return instructores.filter((i) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        i.Nombre_Completo.toLowerCase().includes(term) ||
        i.Estatus.toLowerCase().includes(term)
      );
    });
  }, [instructores, searchTerm]);

  const sortedInstructores = useMemo(() => {
    return sortRows(filteredInstructores, sortKeyInstructores, sortDirInstructores, 'ID_Instructor');
  }, [filteredInstructores, sortKeyInstructores, sortDirInstructores]);

  // Estatus rows
  const estatusStats = useMemo(() => {
    return catalogoEstatus.map((st, idx) => {
      const countMembers = miembros.filter((m) => m.Estatus === st).length;
      const countInstructors = instructores.filter((i) => i.Estatus === st).length;
      const isActivo = !st.trim().startsWith('9');
      return {
        id: idx + 1,
        codigo: st.split('-')[0] || '',
        nombre: st,
        isActivo,
        countMembers,
        countInstructors,
        total: countMembers + countInstructors,
      };
    });
  }, [catalogoEstatus, miembros, instructores]);

  const filteredEstatus = useMemo(() => {
    return estatusStats.filter((e) => {
      if (!searchTerm) return true;
      return e.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [estatusStats, searchTerm]);

  const sortedEstatus = useMemo(() => {
    return sortRows(filteredEstatus, sortKeyEstatus, sortDirEstatus, 'id');
  }, [filteredEstatus, sortKeyEstatus, sortDirEstatus]);

  // ----------------------------------------------------
  // HANDLERS FOR GRUPO
  // ----------------------------------------------------
  const handleOpenAddGrupo = () => {
    setEditingGrupo(null);
    setGrupoForm({
      Numero_Grupo: '',
      ID_Horario: horarios[0]?.ID_Horario || 1,
      ID_Instructor: instructores[0]?.ID_Instructor || 1,
    });
    setIsGrupoModalOpen(true);
  };

  const handleOpenEditGrupo = (g: GrupoClase) => {
    setEditingGrupo(g);
    setGrupoForm({
      Numero_Grupo: g.Numero_Grupo,
      ID_Horario: g.ID_Horario,
      ID_Instructor: g.ID_Instructor,
    });
    setIsGrupoModalOpen(true);
  };

  const handleSaveGrupo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grupoForm.Numero_Grupo.trim()) {
      alert('Por favor ingrese el número o nombre del grupo.');
      return;
    }
    if (!grupoForm.ID_Horario) {
      alert('Por favor seleccione un horario para el grupo.');
      return;
    }
    if (!grupoForm.ID_Instructor) {
      alert('Por favor seleccione un instructor para el grupo.');
      return;
    }

    if (editingGrupo) {
      onUpdateGrupo({
        ID_Grupo: editingGrupo.ID_Grupo,
        Numero_Grupo: grupoForm.Numero_Grupo.trim(),
        ID_Horario: Number(grupoForm.ID_Horario),
        ID_Instructor: Number(grupoForm.ID_Instructor),
      });
    } else {
      onAddGrupo({
        Numero_Grupo: grupoForm.Numero_Grupo.trim(),
        ID_Horario: Number(grupoForm.ID_Horario),
        ID_Instructor: Number(grupoForm.ID_Instructor),
      });
    }
    setIsGrupoModalOpen(false);
  };

  // ----------------------------------------------------
  // HANDLERS FOR HORARIOS
  // ----------------------------------------------------
  const handleOpenAddHorario = () => {
    setEditingHorario(null);
    setHorarioForm({
      Dia: 'Lunes',
      Hora_Inicio: '18:30',
      Hora_Fin: '20:30',
    });
    setIsHorarioModalOpen(true);
  };

  const handleOpenEditHorario = (h: HorarioClase) => {
    setEditingHorario(h);
    setHorarioForm({
      Dia: h.Dia,
      Hora_Inicio: h.Hora_Inicio,
      Hora_Fin: h.Hora_Fin,
    });
    setIsHorarioModalOpen(true);
  };

  const handleSaveHorario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!horarioForm.Hora_Inicio || !horarioForm.Hora_Fin) {
      alert('Ingrese hora de inicio y hora de fin.');
      return;
    }

    if (editingHorario) {
      onUpdateHorario({
        ID_Horario: editingHorario.ID_Horario,
        Dia: horarioForm.Dia,
        Hora_Inicio: horarioForm.Hora_Inicio,
        Hora_Fin: horarioForm.Hora_Fin,
      });
    } else {
      onAddHorario({
        Dia: horarioForm.Dia,
        Hora_Inicio: horarioForm.Hora_Inicio,
        Hora_Fin: horarioForm.Hora_Fin,
      });
    }
    setIsHorarioModalOpen(false);
  };

  // Quick Horario from Grupo modal
  const handleSaveQuickHorario = (dia: DiaSemana, inicio: string, fin: string) => {
    if (!inicio || !fin) {
      alert('Ingrese las horas de inicio y fin.');
      return;
    }
    const created = onAddHorario({ Dia: dia, Hora_Inicio: inicio, Hora_Fin: fin });
    setGrupoForm((prev) => ({ ...prev, ID_Horario: created.ID_Horario }));
    setIsQuickHorarioOpen(false);
  };

  // ----------------------------------------------------
  // HANDLERS FOR INSTRUCTORES
  // ----------------------------------------------------
  const handleOpenAddInstructor = () => {
    setEditingInstructor(null);
    setInstructorForm({
      Nombre_Completo: '',
      Estatus: catalogoEstatus[0] || '01-J.F.',
    });
    setIsInstructorModalOpen(true);
  };

  const handleOpenEditInstructor = (inst: Instructor) => {
    setEditingInstructor(inst);
    setInstructorForm({
      Nombre_Completo: inst.Nombre_Completo,
      Estatus: inst.Estatus,
    });
    setIsInstructorModalOpen(true);
  };

  const handleSaveInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructorForm.Nombre_Completo.trim()) {
      alert('Por favor ingrese el nombre completo del instructor.');
      return;
    }

    if (editingInstructor) {
      onUpdateInstructor({
        ID_Instructor: editingInstructor.ID_Instructor,
        Nombre_Completo: instructorForm.Nombre_Completo.trim(),
        Estatus: instructorForm.Estatus,
      });
    } else {
      onAddInstructor({
        Nombre_Completo: instructorForm.Nombre_Completo.trim(),
        Estatus: instructorForm.Estatus,
      });
    }
    setIsInstructorModalOpen(false);
  };

  // Quick Instructor from Grupo modal
  const handleSaveQuickInstructor = (nombre: string, estatus: string) => {
    if (!nombre.trim()) {
      alert('Ingrese el nombre completo del instructor.');
      return;
    }
    const created = onAddInstructor({ Nombre_Completo: nombre.trim(), Estatus: estatus });
    setGrupoForm((prev) => ({ ...prev, ID_Instructor: created.ID_Instructor }));
    setIsQuickInstructorOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Hero Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Módulo Central de Catálogos y Relaciones</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Catálogos del Sistema</h1>
          <p className="text-sm text-slate-500 mt-1">
            Administración unificada de Grupos de Clase, Horarios, Instructores, Estatus Institucional y Registro de Miembros.
          </p>
        </div>

        {/* Global Summary Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 font-medium">
            <strong>{grupos.length}</strong> Grupos
          </span>
          <span className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 font-medium">
            <strong>{horarios.length}</strong> Horarios
          </span>
          <span className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 font-medium">
            <strong>{instructores.length}</strong> Instructores
          </span>
          <span className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 font-medium">
            <strong>{catalogoEstatus.length}</strong> Estatus
          </span>
          <span className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 font-medium">
            <strong>{miembros.length}</strong> Miembros
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-4 pt-3 flex items-center gap-2 overflow-x-auto shadow-xs">
        <button
          onClick={() => {
            setSubTab('grupos');
            setSearchTerm('');
          }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'grupos'
              ? 'border-blue-600 text-blue-700 bg-blue-50/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Grupos de Clase</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
            {grupos.length}
          </span>
        </button>

        <button
          onClick={() => {
            setSubTab('horarios');
            setSearchTerm('');
          }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'horarios'
              ? 'border-blue-600 text-blue-700 bg-blue-50/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Horarios de Clase</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
            {horarios.length}
          </span>
        </button>

        <button
          onClick={() => {
            setSubTab('instructores');
            setSearchTerm('');
          }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'instructores'
              ? 'border-blue-600 text-blue-700 bg-blue-50/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Instructores</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
            {instructores.length}
          </span>
        </button>

        <button
          onClick={() => {
            setSubTab('estatus');
            setSearchTerm('');
          }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'estatus'
              ? 'border-blue-600 text-blue-700 bg-blue-50/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Catálogo de Estatus</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
            {catalogoEstatus.length}
          </span>
        </button>

        <button
          onClick={() => {
            setSubTab('miembros');
            setSearchTerm('');
          }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'miembros'
              ? 'border-blue-600 text-blue-700 bg-blue-50/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Catálogo de Miembros</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
            {miembros.length}
          </span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: GRUPOS DE CLASE [id, numero de grupo, HORARIO, INSTRUCTOR] */}
      {/* ============================================================ */}
      {subTab === 'grupos' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por grupo, horario, instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={handleOpenAddGrupo}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Grupo de Clase</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <TableSortHeader
                      columnKey="ID_Grupo"
                      label="ID"
                      sortKey={sortKeyGrupos}
                      sortDirection={sortDirGrupos}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyGrupos, k, sortDirGrupos);
                        setSortKeyGrupos(next.key);
                        setSortDirGrupos(next.direction);
                      }}
                      className="w-16"
                    />
                    <TableSortHeader
                      columnKey="Numero_Grupo"
                      label="Número de Grupo"
                      sortKey={sortKeyGrupos}
                      sortDirection={sortDirGrupos}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyGrupos, k, sortDirGrupos);
                        setSortKeyGrupos(next.key);
                        setSortDirGrupos(next.direction);
                      }}
                    />
                    <TableSortHeader
                      columnKey="_horarioDisplay"
                      label="HORARIO (Relación)"
                      sortKey={sortKeyGrupos}
                      sortDirection={sortDirGrupos}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyGrupos, k, sortDirGrupos);
                        setSortKeyGrupos(next.key);
                        setSortDirGrupos(next.direction);
                      }}
                    />
                    <TableSortHeader
                      columnKey="_instructorDisplay"
                      label="INSTRUCTOR (Relación)"
                      sortKey={sortKeyGrupos}
                      sortDirection={sortDirGrupos}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyGrupos, k, sortDirGrupos);
                        setSortKeyGrupos(next.key);
                        setSortDirGrupos(next.direction);
                      }}
                    />
                    <th className="py-2.5 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedGrupos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                        No se encontraron grupos de clase registrados.
                      </td>
                    </tr>
                  ) : (
                    sortedGrupos.map((g) => {
                      const badgeStyle = getEstatusBadgeStyle(g._instructorEstatus);
                      return (
                        <tr key={g.ID_Grupo} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-500">#{g.ID_Grupo}</td>
                          <td className="py-3 px-3 font-semibold text-slate-900">{g.Numero_Grupo}</td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>{g._horarioDisplay}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">{g._instructorDisplay}</span>
                              {g._instructorEstatus && (
                                <span
                                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                                  {g._instructorEstatus}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditGrupo(g)}
                                className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                                title="Editar Grupo"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar el grupo "${g.Numero_Grupo}"?`)) {
                                    onDeleteGrupo(g.ID_Grupo);
                                  }
                                }}
                                className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                title="Eliminar Grupo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Mostrando {sortedGrupos.length} de {grupos.length} grupos</span>
              <span className="italic">💡 Desde este catálogo puede crear nuevos Horarios o registrar Instructores directamente al crear/editar un Grupo.</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: HORARIOS DE CLASE [dia, hora inicio, hora fin]        */}
      {/* ============================================================ */}
      {subTab === 'horarios' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por día (Lunes...Sábado), hora..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>

            <button
              onClick={handleOpenAddHorario}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Horario</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <TableSortHeader
                      columnKey="ID_Horario"
                      label="ID"
                      sortKey={sortKeyHorarios}
                      sortDirection={sortDirHorarios}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyHorarios, k, sortDirHorarios);
                        setSortKeyHorarios(next.key);
                        setSortDirHorarios(next.direction);
                      }}
                      className="w-16"
                    />
                    <TableSortHeader
                      columnKey="Dia"
                      label="Día de la Semana"
                      sortKey={sortKeyHorarios}
                      sortDirection={sortDirHorarios}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyHorarios, k, sortDirHorarios);
                        setSortKeyHorarios(next.key);
                        setSortDirHorarios(next.direction);
                      }}
                    />
                    <TableSortHeader
                      columnKey="Hora_Inicio"
                      label="Hora Inicio"
                      sortKey={sortKeyHorarios}
                      sortDirection={sortDirHorarios}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyHorarios, k, sortDirHorarios);
                        setSortKeyHorarios(next.key);
                        setSortDirHorarios(next.direction);
                      }}
                    />
                    <TableSortHeader
                      columnKey="Hora_Fin"
                      label="Hora Fin"
                      sortKey={sortKeyHorarios}
                      sortDirection={sortDirHorarios}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyHorarios, k, sortDirHorarios);
                        setSortKeyHorarios(next.key);
                        setSortDirHorarios(next.direction);
                      }}
                    />
                    <th className="py-2.5 px-3">Rango de Clase</th>
                    <th className="py-2.5 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedHorarios.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                        No se encontraron horarios registrados.
                      </td>
                    </tr>
                  ) : (
                    sortedHorarios.map((h) => (
                      <tr key={h.ID_Horario} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-500">#{h.ID_Horario}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                            {h.Dia}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700">{h.Hora_Inicio}</td>
                        <td className="py-3 px-3 font-mono text-slate-700">{h.Hora_Fin}</td>
                        <td className="py-3 px-3 font-medium text-slate-600">
                          {h.Dia} de {h.Hora_Inicio} a {h.Hora_Fin}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditHorario(h)}
                              className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                              title="Editar Horario"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar horario ${h.Dia} (${h.Hora_Inicio} - ${h.Hora_Fin})?`)) {
                                  onDeleteHorario(h.ID_Horario);
                                }
                              }}
                              className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                              title="Eliminar Horario"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Mostrando {sortedHorarios.length} de {horarios.length} horarios</span>
              <span>Días restringidos según estatutos: Lunes a Sábado</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: INSTRUCTORES [id, nombre completo, ESTATUS]           */}
      {/* ============================================================ */}
      {subTab === 'instructores' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar instructor o estatus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>

            <button
              onClick={handleOpenAddInstructor}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Instructor</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <TableSortHeader
                      columnKey="ID_Instructor"
                      label="ID"
                      sortKey={sortKeyInstructores}
                      sortDirection={sortDirInstructores}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyInstructores, k, sortDirInstructores);
                        setSortKeyInstructores(next.key);
                        setSortDirInstructores(next.direction);
                      }}
                      className="w-16"
                    />
                    <TableSortHeader
                      columnKey="Nombre_Completo"
                      label="Nombre Completo"
                      sortKey={sortKeyInstructores}
                      sortDirection={sortDirInstructores}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyInstructores, k, sortDirInstructores);
                        setSortKeyInstructores(next.key);
                        setSortDirInstructores(next.direction);
                      }}
                    />
                    <TableSortHeader
                      columnKey="Estatus"
                      label="ESTATUS (Relación Institucional)"
                      sortKey={sortKeyInstructores}
                      sortDirection={sortDirInstructores}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyInstructores, k, sortDirInstructores);
                        setSortKeyInstructores(next.key);
                        setSortDirInstructores(next.direction);
                      }}
                    />
                    <th className="py-2.5 px-3">Grupos Asignados</th>
                    <th className="py-2.5 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedInstructores.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                        No se encontraron instructores registrados.
                      </td>
                    </tr>
                  ) : (
                    sortedInstructores.map((i) => {
                      const badgeStyle = getEstatusBadgeStyle(i.Estatus);
                      const assignedGrupos = grupos.filter((g) => g.ID_Instructor === i.ID_Instructor);
                      return (
                        <tr key={i.ID_Instructor} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-500">#{i.ID_Instructor}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{i.Nombre_Completo}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                            >
                              <span className={`w-2 h-2 rounded-full ${badgeStyle.dot}`} />
                              {i.Estatus}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {assignedGrupos.length === 0 ? (
                              <span className="text-slate-400 italic text-[11px]">Sin grupos activos</span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {assignedGrupos.map((ag) => (
                                  <span
                                    key={ag.ID_Grupo}
                                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                                  >
                                    {ag.Numero_Grupo}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditInstructor(i)}
                                className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                                title="Editar Instructor"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar al instructor "${i.Nombre_Completo}"?`)) {
                                    onDeleteInstructor(i.ID_Instructor);
                                  }
                                }}
                                className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                title="Eliminar Instructor"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Mostrando {sortedInstructores.length} de {instructores.length} instructores</span>
              <span>El campo Estatus está directamente relacionado con el Catálogo Oficial</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: CATÁLOGO DE ESTATUS                                    */}
      {/* ============================================================ */}
      {subTab === 'estatus' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Catálogo Oficial de Estatus Institucional</h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <strong>Regla de Estatus:</strong> Los estatus que comienzan con <strong>9</strong> son <strong>inactivos</strong> (reservados para el rojo en sus diferentes tonalidades). Los que comienzan con <strong>01 a 06</strong> siguen el espectro <strong>ROYGBIV</strong> descendente (01 Violeta, 02 Índigo, 03 Azul, 04 Verde, 05 Amarillo, 06 Naranja). Los estatus que comienzan con número <strong>1</strong> cuentan con colores activos dedicados (Cian, Turquesa, Magenta, Violeta Imperial, Lima, Ámbar, Melocotón, Rosa, Azul Acero, Índigo Profundo).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onResetEstatus}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Restaurar a los 8 estatus por defecto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar 8 Predeterminados</span>
                </button>
              </div>
            </div>

            {/* Quick Add Status Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newStatusInput.trim()) return;
                onAddEstatus(newStatusInput.trim());
                setNewStatusInput('');
              }}
              className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
            >
              <input
                type="text"
                placeholder="Ejemplo: 10-Emérito, 11-Docente, 07-Colaborador o 97-Pausa temporal"
                value={newStatusInput}
                onChange={(e) => setNewStatusInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Estatus</span>
              </button>
            </form>

            {/* Estatus Table with Sorting */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <TableSortHeader
                      columnKey="id"
                      label="#"
                      sortKey={sortKeyEstatus}
                      sortDirection={sortDirEstatus}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyEstatus, k, sortDirEstatus);
                        setSortKeyEstatus(next.key);
                        setSortDirEstatus(next.direction);
                      }}
                      className="w-12"
                    />
                    <TableSortHeader
                      columnKey="nombre"
                      label="Nombre / Código del Estatus"
                      sortKey={sortKeyEstatus}
                      sortDirection={sortDirEstatus}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyEstatus, k, sortDirEstatus);
                        setSortKeyEstatus(next.key);
                        setSortDirEstatus(next.direction);
                      }}
                    />
                    <th className="py-2.5 px-3">Insignia</th>
                    <th className="py-2.5 px-3">Condición / Regla</th>
                    <th className="py-2.5 px-3">Color Asignado</th>
                    <TableSortHeader
                      columnKey="countMembers"
                      label="Miembros"
                      sortKey={sortKeyEstatus}
                      sortDirection={sortDirEstatus}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyEstatus, k, sortDirEstatus);
                        setSortKeyEstatus(next.key);
                        setSortDirEstatus(next.direction);
                      }}
                    />
                    <TableSortHeader
                      columnKey="countInstructors"
                      label="Instructores"
                      sortKey={sortKeyEstatus}
                      sortDirection={sortDirEstatus}
                      onSort={(k) => {
                        const next = cycleSort(sortKeyEstatus, k, sortDirEstatus);
                        setSortKeyEstatus(next.key);
                        setSortDirEstatus(next.direction);
                      }}
                    />
                    <th className="py-2.5 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedEstatus.map((item) => {
                    const badge = getEstatusBadgeStyle(item.nombre);
                    const isEditing = editingStatusName === item.nombre;
                    const isDeleting = deletingStatusName === item.nombre;

                    return (
                      <tr key={item.nombre} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-400">{item.id}</td>
                        <td className="py-3 px-3">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editingStatusValue}
                                onChange={(e) => setEditingStatusValue(e.target.value)}
                                className="px-2 py-1 text-xs border border-blue-400 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500 bg-white"
                                autoFocus
                              />
                              <button
                                onClick={() => {
                                  onUpdateEstatus(item.nombre, editingStatusValue);
                                  setEditingStatusName(null);
                                }}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                title="Guardar cambios"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingStatusName(null)}
                                className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                                title="Cancelar"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-semibold text-slate-900">{item.nombre}</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                            {item.nombre}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {item.isActivo ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-900 border border-red-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                              Inactivo (Código 9)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] font-medium text-slate-600">
                            {badge.colorName}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-700">{item.countMembers}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-700">{item.countInstructors}</span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {!isEditing && (
                              <button
                                onClick={() => {
                                  setEditingStatusName(item.nombre);
                                  setEditingStatusValue(item.nombre);
                                }}
                                className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                                title="Editar nombre de estatus"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {isDeleting ? (
                              <div className="flex items-center gap-1.5 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                                <span className="text-[11px] text-rose-800">Reasignar a:</span>
                                <select
                                  value={deleteFallbackStatus}
                                  onChange={(e) => setDeleteFallbackStatus(e.target.value)}
                                  className="text-xs px-2 py-0.5 border border-rose-300 rounded bg-white text-slate-800"
                                >
                                  {catalogoEstatus
                                    .filter((s) => s !== item.nombre)
                                    .map((s) => (
                                      <option key={s} value={s}>
                                        {s}
                                      </option>
                                    ))}
                                </select>
                                <button
                                  onClick={() => {
                                    onDeleteEstatus(item.nombre, deleteFallbackStatus);
                                    setDeletingStatusName(null);
                                  }}
                                  className="px-2 py-0.5 bg-rose-600 text-white rounded text-[11px] font-bold hover:bg-rose-700"
                                >
                                  Confirmar
                                </button>
                                <button
                                  onClick={() => setDeletingStatusName(null)}
                                  className="p-1 text-slate-500 hover:bg-slate-200 rounded"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  const fallback = catalogoEstatus.find((s) => s !== item.nombre) || '03-Miembro';
                                  setDeleteFallbackStatus(fallback);
                                  setDeletingStatusName(item.nombre);
                                }}
                                disabled={catalogoEstatus.length <= 1}
                                className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer disabled:opacity-30"
                                title="Eliminar estatus y reasignar dependientes"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: CATÁLOGO DE MIEMBROS                                   */}
      {/* ============================================================ */}
      {subTab === 'miembros' && (
        <MiembrosView
          miembros={miembros}
          catalogoEstatus={catalogoEstatus}
          grupos={grupos}
          horarios={horarios}
          instructores={instructores}
          onAddEstatus={onAddEstatus}
          onUpdateEstatus={onUpdateEstatus}
          onDeleteEstatus={onDeleteEstatus}
          onResetEstatus={onResetEstatus}
          onAddMiembro={onAddMiembro}
          onUpdateMiembro={onUpdateMiembro}
          onDeleteMiembro={onDeleteMiembro}
          onImportMiembros={onImportMiembros}
          onNavigateToCuotasWithMember={onNavigateToCuotasWithMember}
        />
      )}

      {/* ============================================================ */}
      {/* MODAL: NUEVO / EDITAR GRUPO DE CLASE                          */}
      {/* ============================================================ */}
      {isGrupoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingGrupo ? 'Editar Grupo de Clase' : 'Registrar Nuevo Grupo de Clase'}
                </h3>
              </div>
              <button
                onClick={() => setIsGrupoModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrupo} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número o Nombre de Grupo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Grupo 1, G-01 Filosofía de Oriente..."
                  value={grupoForm.Numero_Grupo}
                  onChange={(e) => setGrupoForm({ ...grupoForm, Numero_Grupo: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* HORARIO (Relational Select + Quick Create Button) */}
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-amber-950">
                    HORARIO (Relación) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsQuickHorarioOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Crear Nuevo Horario</span>
                  </button>
                </div>

                <select
                  required
                  value={grupoForm.ID_Horario}
                  onChange={(e) => setGrupoForm({ ...grupoForm, ID_Horario: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-amber-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {horarios.map((h) => (
                    <option key={h.ID_Horario} value={h.ID_Horario}>
                      #{h.ID_Horario} — {h.Dia} de {h.Hora_Inicio} a {h.Hora_Fin}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-amber-800">
                  Asigna el horario recurrente de impartición de clases para este grupo.
                </p>
              </div>

              {/* INSTRUCTOR (Relational Select + Quick Register Button) */}
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-blue-950">
                    INSTRUCTOR (Relación) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsQuickInstructorOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Registrar Nuevo Instructor</span>
                  </button>
                </div>

                <select
                  required
                  value={grupoForm.ID_Instructor}
                  onChange={(e) => setGrupoForm({ ...grupoForm, ID_Instructor: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-blue-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {instructores.map((i) => (
                    <option key={i.ID_Instructor} value={i.ID_Instructor}>
                      #{i.ID_Instructor} — {i.Nombre_Completo} ({i.Estatus})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-blue-800">
                  Selecciona el instructor titular responsable de este grupo de clase.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGrupoModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  {editingGrupo ? 'Actualizar Grupo' : 'Guardar Grupo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUBMODAL: QUICK HORARIO INSIDE GRUPO                          */}
      {/* ============================================================ */}
      {isQuickHorarioOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-slate-900 text-sm">Crear Horario Inmediato</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickHorarioOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <QuickHorarioForm
              onSave={(dia, ini, fin) => handleSaveQuickHorario(dia, ini, fin)}
              onCancel={() => setIsQuickHorarioOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUBMODAL: QUICK INSTRUCTOR INSIDE GRUPO                      */}
      {/* ============================================================ */}
      {isQuickInstructorOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-sm">Registrar Instructor Inmediato</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickInstructorOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <QuickInstructorForm
              catalogoEstatus={catalogoEstatus}
              onSave={(nombre, estatus) => handleSaveQuickInstructor(nombre, estatus)}
              onCancel={() => setIsQuickInstructorOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STANDALONE MODAL: HORARIO DE CLASE                            */}
      {/* ============================================================ */}
      {isHorarioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingHorario ? 'Editar Horario de Clase' : 'Nuevo Horario de Clase'}
                </h3>
              </div>
              <button
                onClick={() => setIsHorarioModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHorario} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Día de la Semana (Lunes a Sábado) *
                </label>
                <select
                  value={horarioForm.Dia}
                  onChange={(e) => setHorarioForm({ ...horarioForm, Dia: e.target.value as DiaSemana })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {DIAS_SEMANA_DEFAULT.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hora Inicio (HH:mm) *
                  </label>
                  <input
                    type="time"
                    required
                    value={horarioForm.Hora_Inicio}
                    onChange={(e) => setHorarioForm({ ...horarioForm, Hora_Inicio: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hora Fin (HH:mm) *
                  </label>
                  <input
                    type="time"
                    required
                    value={horarioForm.Hora_Fin}
                    onChange={(e) => setHorarioForm({ ...horarioForm, Hora_Fin: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Vista previa:</span> {horarioForm.Dia} de {horarioForm.Hora_Inicio} a {horarioForm.Hora_Fin}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsHorarioModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  {editingHorario ? 'Actualizar Horario' : 'Guardar Horario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STANDALONE MODAL: INSTRUCTOR                                  */}
      {/* ============================================================ */}
      {isInstructorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingInstructor ? 'Editar Instructor' : 'Registrar Nuevo Instructor'}
                </h3>
              </div>
              <button
                onClick={() => setIsInstructorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInstructor} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Lic. Claudia Solórzano"
                  value={instructorForm.Nombre_Completo}
                  onChange={(e) => setInstructorForm({ ...instructorForm, Nombre_Completo: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ESTATUS (Catálogo Institucional) *
                </label>
                <select
                  value={instructorForm.Estatus}
                  onChange={(e) => setInstructorForm({ ...instructorForm, Estatus: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {catalogoEstatus.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Seleccione el estatus oficial asignado al instructor en la institución.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInstructorModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  {editingInstructor ? 'Actualizar Instructor' : 'Guardar Instructor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// QUICK SUB-COMPONENTS
// ============================================================
const QuickHorarioForm: React.FC<{
  onSave: (dia: DiaSemana, inicio: string, fin: string) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [dia, setDia] = useState<DiaSemana>('Lunes');
  const [inicio, setInicio] = useState('18:30');
  const [fin, setFin] = useState('20:30');

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          Día de la Semana
        </label>
        <select
          value={dia}
          onChange={(e) => setDia(e.target.value as DiaSemana)}
          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
        >
          {DIAS_SEMANA_DEFAULT.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Hora Inicio
          </label>
          <input
            type="time"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Hora Fin
          </label>
          <input
            type="time"
            value={fin}
            onChange={(e) => setFin(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md font-mono"
          />
        </div>
      </div>

      <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onSave(dia, inicio, fin)}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md shadow-xs cursor-pointer"
        >
          Guardar y Seleccionar
        </button>
      </div>
    </div>
  );
};

const QuickInstructorForm: React.FC<{
  catalogoEstatus: string[];
  onSave: (nombre: string, estatus: string) => void;
  onCancel: () => void;
}> = ({ catalogoEstatus, onSave, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [estatus, setEstatus] = useState(catalogoEstatus[0] || '01-J.F.');

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          Nombre Completo
        </label>
        <input
          type="text"
          placeholder="Ej: Lic. Claudia Solórzano"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          Estatus Institucional
        </label>
        <select
          value={estatus}
          onChange={(e) => setEstatus(e.target.value)}
          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
        >
          {catalogoEstatus.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onSave(nombre, estatus)}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs cursor-pointer"
        >
          Guardar y Seleccionar
        </button>
      </div>
    </div>
  );
};
