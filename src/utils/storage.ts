import { DatabaseState, Miembro, HorarioClase, Instructor, GrupoClase } from '../types/models';
import {
  INITIAL_MIEMBROS,
  INITIAL_CUOTAS,
  INITIAL_MATERIALES,
  INITIAL_OTROS,
  INITIAL_MORA,
  CATALOGO_ESTATUS_DEFAULT,
  INITIAL_HORARIOS,
  INITIAL_INSTRUCTORES,
  INITIAL_GRUPOS
} from '../data/seedData';

const KEY_MIEMBROS = 'app_economia_na_miembros_v1';
const KEY_CUOTAS = 'app_economia_na_cuotas_v1';
const KEY_MATERIALES = 'app_economia_na_materiales_v1';
const KEY_OTROS = 'app_economia_na_otros_v1';
const KEY_MORA = 'app_economia_na_mora_v1';
const KEY_CATALOGO_ESTATUS = 'app_economia_na_catalogo_estatus_v1';
const KEY_HORARIOS = 'app_economia_na_horarios_v1';
const KEY_INSTRUCTORES = 'app_economia_na_instructores_v1';
const KEY_GRUPOS = 'app_economia_na_grupos_v1';

export function loadDatabaseState(): DatabaseState {
  try {
    const rawMiembros = localStorage.getItem(KEY_MIEMBROS);
    const rawCuotas = localStorage.getItem(KEY_CUOTAS);
    const rawMateriales = localStorage.getItem(KEY_MATERIALES);
    const rawOtros = localStorage.getItem(KEY_OTROS);
    const rawMora = localStorage.getItem(KEY_MORA);
    const rawEstatus = localStorage.getItem(KEY_CATALOGO_ESTATUS);
    const rawHorarios = localStorage.getItem(KEY_HORARIOS);
    const rawInstructores = localStorage.getItem(KEY_INSTRUCTORES);
    const rawGrupos = localStorage.getItem(KEY_GRUPOS);

    const loadedMiembros: Miembro[] = rawMiembros ? JSON.parse(rawMiembros) : INITIAL_MIEMBROS;
    // Ensure all members have Estatus populated
    const migraredMiembros = loadedMiembros.map((m) => ({
      ...m,
      Estatus: m.Estatus || (m.Condicion === 'Aspirante' ? '05-Inscrito' : '03-Miembro'),
    }));

    const loadedCatalogo: string[] = rawEstatus ? JSON.parse(rawEstatus) : CATALOGO_ESTATUS_DEFAULT;
    const loadedHorarios: HorarioClase[] = rawHorarios ? JSON.parse(rawHorarios) : INITIAL_HORARIOS;
    const loadedInstructores: Instructor[] = rawInstructores ? JSON.parse(rawInstructores) : INITIAL_INSTRUCTORES;
    const loadedGrupos: GrupoClase[] = rawGrupos ? JSON.parse(rawGrupos) : INITIAL_GRUPOS;

    return {
      miembros: migraredMiembros,
      cuotas: rawCuotas ? JSON.parse(rawCuotas) : INITIAL_CUOTAS,
      materiales: rawMateriales ? JSON.parse(rawMateriales) : INITIAL_MATERIALES,
      otros: rawOtros ? JSON.parse(rawOtros) : INITIAL_OTROS,
      mora: rawMora ? JSON.parse(rawMora) : INITIAL_MORA,
      catalogoEstatus: loadedCatalogo.length > 0 ? loadedCatalogo : CATALOGO_ESTATUS_DEFAULT,
      horarios: loadedHorarios,
      instructores: loadedInstructores,
      grupos: loadedGrupos,
    };
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return {
      miembros: INITIAL_MIEMBROS,
      cuotas: INITIAL_CUOTAS,
      materiales: INITIAL_MATERIALES,
      otros: INITIAL_OTROS,
      mora: INITIAL_MORA,
      catalogoEstatus: CATALOGO_ESTATUS_DEFAULT,
      horarios: INITIAL_HORARIOS,
      instructores: INITIAL_INSTRUCTORES,
      grupos: INITIAL_GRUPOS,
    };
  }
}

export function saveDatabaseState(state: DatabaseState): void {
  try {
    localStorage.setItem(KEY_MIEMBROS, JSON.stringify(state.miembros));
    localStorage.setItem(KEY_CUOTAS, JSON.stringify(state.cuotas));
    localStorage.setItem(KEY_MATERIALES, JSON.stringify(state.materiales));
    localStorage.setItem(KEY_OTROS, JSON.stringify(state.otros));
    localStorage.setItem(KEY_MORA, JSON.stringify(state.mora));
    if (state.catalogoEstatus) {
      localStorage.setItem(KEY_CATALOGO_ESTATUS, JSON.stringify(state.catalogoEstatus));
    }
    if (state.horarios) {
      localStorage.setItem(KEY_HORARIOS, JSON.stringify(state.horarios));
    }
    if (state.instructores) {
      localStorage.setItem(KEY_INSTRUCTORES, JSON.stringify(state.instructores));
    }
    if (state.grupos) {
      localStorage.setItem(KEY_GRUPOS, JSON.stringify(state.grupos));
    }
  } catch (error) {
    console.error('Error writing to localStorage', error);
  }
}

export function resetDatabaseToDefault(): DatabaseState {
  try {
    localStorage.removeItem(KEY_MIEMBROS);
    localStorage.removeItem(KEY_CUOTAS);
    localStorage.removeItem(KEY_MATERIALES);
    localStorage.removeItem(KEY_OTROS);
    localStorage.removeItem(KEY_MORA);
    localStorage.removeItem(KEY_CATALOGO_ESTATUS);
    localStorage.removeItem(KEY_HORARIOS);
    localStorage.removeItem(KEY_INSTRUCTORES);
    localStorage.removeItem(KEY_GRUPOS);
  } catch (e) {
    console.error(e);
  }
  return {
    miembros: [...INITIAL_MIEMBROS],
    cuotas: [...INITIAL_CUOTAS],
    materiales: [...INITIAL_MATERIALES],
    otros: [...INITIAL_OTROS],
    mora: [...INITIAL_MORA],
    catalogoEstatus: [...CATALOGO_ESTATUS_DEFAULT],
    horarios: [...INITIAL_HORARIOS],
    instructores: [...INITIAL_INSTRUCTORES],
    grupos: [...INITIAL_GRUPOS],
  };
}
