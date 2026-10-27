import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  key: string;
  direction: SortDirection;
}

/**
 * Cycles sort direction:
 * Click 1: asc
 * Click 2: desc
 * Click 3: default (null / id)
 */
export function cycleSort(
  currentKey: string,
  clickedKey: string,
  currentDirection: SortDirection
): SortState {
  if (currentKey !== clickedKey || currentDirection === null) {
    return { key: clickedKey, direction: 'asc' };
  }
  if (currentDirection === 'asc') {
    return { key: clickedKey, direction: 'desc' };
  }
  // Return to default
  return { key: 'default', direction: null };
}

/**
 * Generic sorting function handling numbers, strings, dates, and nulls.
 * When direction is null or key is 'default', sorts by primary id key.
 */
export function sortRows<T>(
  rows: T[],
  sortKey: string,
  sortDirection: SortDirection,
  idKey: keyof T,
  defaultDirection: 'asc' | 'desc' = 'asc'
): T[] {
  if (!sortDirection || sortKey === 'default') {
    return [...rows].sort((a, b) => {
      const aId = a[idKey];
      const bId = b[idKey];
      if (typeof aId === 'number' && typeof bId === 'number') {
        return defaultDirection === 'asc' ? aId - bId : bId - aId;
      }
      const comp = String(aId ?? '').localeCompare(String(bId ?? ''), 'es', { numeric: true });
      return defaultDirection === 'asc' ? comp : -comp;
    });
  }

  return [...rows].sort((a, b) => {
    const valA = (a as any)[sortKey];
    const valB = (b as any)[sortKey];

    if (valA === valB) {
      const aId = a[idKey];
      const bId = b[idKey];
      if (typeof aId === 'number' && typeof bId === 'number') return aId - bId;
      return 0;
    }

    // Undefined/nulls placed at the bottom
    if (valA === undefined || valA === null || valA === '') return 1;
    if (valB === undefined || valB === null || valB === '') return -1;

    let comparison = 0;
    if (typeof valA === 'number' && typeof valB === 'number') {
      comparison = valA - valB;
    } else {
      comparison = String(valA).localeCompare(String(valB), 'es', { numeric: true, sensitivity: 'base' });
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });
}

interface TableSortHeaderProps {
  columnKey: string;
  label: string;
  sortKey: string;
  sortDirection: SortDirection;
  onSort: (columnKey: string) => void;
  align?: 'left' | 'right' | 'center';
  className?: string;
  title?: string;
}

export const TableSortHeader: React.FC<TableSortHeaderProps> = ({
  columnKey,
  label,
  sortKey,
  sortDirection,
  onSort,
  align = 'left',
  className = '',
  title,
}) => {
  const isActive = sortKey === columnKey && sortDirection !== null;

  const tooltipText = title || (
    isActive
      ? sortDirection === 'asc'
        ? `Ordenado ascendente por ${label}. Clic para ordenar descendente.`
        : `Ordenado descendente por ${label}. Clic para volver al orden por defecto (ID).`
      : `Clic para ordenar por ${label} (Ascendente -> Descendente -> Por defecto ID)`
  );

  return (
    <th
      onClick={() => onSort(columnKey)}
      className={`py-2.5 px-3 select-none cursor-pointer group hover:bg-slate-100 transition-colors ${
        align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
      } ${className}`}
      title={tooltipText}
    >
      <div
        className={`inline-flex items-center gap-1.5 ${
          align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'
        }`}
      >
        <span className={isActive ? 'text-slate-900 font-bold' : 'group-hover:text-slate-900'}>{label}</span>
        <span className="shrink-0 transition-colors">
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="w-3.5 h-3.5 text-blue-700 stroke-[2.5]" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 text-blue-700 stroke-[2.5]" />
            )
          ) : (
            <ArrowUpDown className="w-3 h-3 text-slate-300 opacity-60 group-hover:opacity-100 group-hover:text-slate-500" />
          )}
        </span>
      </div>
    </th>
  );
};
