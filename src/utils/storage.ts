import { DatabaseState } from '../types/models';
import { INITIAL_MIEMBROS, INITIAL_CUOTAS, INITIAL_MATERIALES, INITIAL_OTROS, INITIAL_MORA } from '../data/seedData';

const KEY_MIEMBROS = 'app_economia_na_miembros_v1';
const KEY_CUOTAS = 'app_economia_na_cuotas_v1';
const KEY_MATERIALES = 'app_economia_na_materiales_v1';
const KEY_OTROS = 'app_economia_na_otros_v1';
const KEY_MORA = 'app_economia_na_mora_v1';

export function loadDatabaseState(): DatabaseState {
  try {
    const rawMiembros = localStorage.getItem(KEY_MIEMBROS);
    const rawCuotas = localStorage.getItem(KEY_CUOTAS);
    const rawMateriales = localStorage.getItem(KEY_MATERIALES);
    const rawOtros = localStorage.getItem(KEY_OTROS);
    const rawMora = localStorage.getItem(KEY_MORA);

    return {
      miembros: rawMiembros ? JSON.parse(rawMiembros) : INITIAL_MIEMBROS,
      cuotas: rawCuotas ? JSON.parse(rawCuotas) : INITIAL_CUOTAS,
      materiales: rawMateriales ? JSON.parse(rawMateriales) : INITIAL_MATERIALES,
      otros: rawOtros ? JSON.parse(rawOtros) : INITIAL_OTROS,
      mora: rawMora ? JSON.parse(rawMora) : INITIAL_MORA,
    };
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return {
      miembros: INITIAL_MIEMBROS,
      cuotas: INITIAL_CUOTAS,
      materiales: INITIAL_MATERIALES,
      otros: INITIAL_OTROS,
      mora: INITIAL_MORA,
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
  } catch (e) {
    console.error(e);
  }
  return {
    miembros: [...INITIAL_MIEMBROS],
    cuotas: [...INITIAL_CUOTAS],
    materiales: [...INITIAL_MATERIALES],
    otros: [...INITIAL_OTROS],
    mora: [...INITIAL_MORA],
  };
}
