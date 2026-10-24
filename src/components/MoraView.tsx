import React, { useState, useMemo } from 'react';
import { ReporteMora, CuotaMembresia } from '../types/models';
import { exportMoraCSV, downloadFile } from '../utils/csvEngine';
import { calculateMoraCategories } from '../services/moraBackendService';
import { Search, Download, ArrowRight, PieChart as PieChartIcon } from 'lucide-react';

interface MoraViewProps {
  moraList: ReporteMora[];
  cuotas: CuotaMembresia[];
  onNavigateToCuotas?: () => void;
}

export const MoraView: React.FC<MoraViewProps> = ({
  moraList,
  cuotas,
  onNavigateToCuotas,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'ALL' | 'SOLVENTES' | 'PEQUENA' | 'TRES_MAS'>('ALL');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Real-time backend calculation of the 3 categories
  const stats = useMemo(() => {
    return calculateMoraCategories(cuotas, moraList);
  }, [cuotas, moraList]);

  // Filtered mora records (for the 4-column left table)
  const filteredMora = useMemo(() => {
    return moraList.filter((m) => {
      // Must have actual debt or record
      const matchesSearch =
        m.Miembro_Aspirante.toLowerCase().includes(searchTerm.toLowerCase());

      if (selectedCategoryFilter === 'PEQUENA') {
        return matchesSearch && m.Saldo_Actual > 0 && m.Meses_En_Mora < 3;
      }
      if (selectedCategoryFilter === 'TRES_MAS') {
        return matchesSearch && m.Saldo_Actual > 0 && m.Meses_En_Mora >= 3;
      }
      if (selectedCategoryFilter === 'SOLVENTES') {
        return matchesSearch && m.Saldo_Actual === 0;
      }
      return matchesSearch;
    });
  }, [moraList, searchTerm, selectedCategoryFilter]);

  const handleExportCSV = () => {
    const csv = exportMoraCSV(filteredMora);
    downloadFile(csv, '4-reporte-mora.csv');
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(filteredMora, null, 2);
    downloadFile(jsonStr, 'reporte_mora_contrato.json', 'application/json');
  };

  // Pie chart geometry calculations
  const total = stats.totalMembers || 1;
  const countSolventes = stats.solventes.count;
  const countPequena = stats.moraPequena.count;
  const countTresMas = stats.mora3Mas.count;

  // Angles in degrees
  const angleSolventes = (countSolventes / total) * 360;
  const anglePequena = (countPequena / total) * 360;
  const angleTresMas = (countTresMas / total) * 360;

  // Helper to convert polar to cartesian coordinates for SVG
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  // SVG slice path builder
  const makeSlicePath = (startAngleDeg: number, endAngleDeg: number, radius = 90, innerRadius = 50) => {
    if (endAngleDeg - startAngleDeg >= 359.99) {
      // Full circle donut
      return `M 0 -${radius} A ${radius} ${radius} 0 1 1 0 ${radius} A ${radius} ${radius} 0 1 1 0 -${radius} M 0 -${innerRadius} A ${innerRadius} ${innerRadius} 0 1 0 0 ${innerRadius} A ${innerRadius} ${innerRadius} 0 1 0 0 -${innerRadius} Z`;
    }

    const startRad = (startAngleDeg - 90) * (Math.PI / 180);
    const endRad = (endAngleDeg - 90) * (Math.PI / 180);

    const x1 = Math.cos(startRad) * radius;
    const y1 = Math.sin(startRad) * radius;
    const x2 = Math.cos(endRad) * radius;
    const y2 = Math.sin(endRad) * radius;

    const ix1 = Math.cos(endRad) * innerRadius;
    const iy1 = Math.sin(endRad) * innerRadius;
    const ix2 = Math.cos(startRad) * innerRadius;
    const iy2 = Math.sin(startRad) * innerRadius;

    const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
  };

  // Cumulative angles
  const startSolventes = 0;
  const endSolventes = angleSolventes;
  const startPequena = endSolventes;
  const endPequena = startPequena + anglePequena;
  const startTresMas = endPequena;
  const endTresMas = startTresMas + angleTresMas;

  return (
    <div className="space-y-6">
      {/* View Header with contextual note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Tablero y Reporte de Mora
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Archivo de referencia: <span className="font-mono text-slate-700">4-reporte-mora.csv</span> · Los registros son derivados; la gestión de cobro y pagos se realiza en Cuotas
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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
          {onNavigateToCuotas && (
            <button
              onClick={onNavigateToCuotas}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
            >
              <span>Ir a Módulo de Cuotas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main 50% Left / 50% Right Split Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* 50% IZQUIERDO: Cuadro con las 4 columnas exactas [miembro, saldo año anterior, saldo actual, numero de meses en mora] */}
        <div className="w-full lg:w-1/2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar miembro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-400 bg-white shadow-2xs"
              />
            </div>
            {selectedCategoryFilter !== 'ALL' && (
              <button
                onClick={() => setSelectedCategoryFilter('ALL')}
                className="ml-2 text-xs text-slate-500 hover:text-slate-800 underline whitespace-nowrap cursor-pointer"
              >
                Limpiar filtro
              </button>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    {/* Exact 4 columns requested by user */}
                    <th className="py-2.5 px-3">Miembro</th>
                    <th className="py-2.5 px-3 text-right">Saldo Año Anterior</th>
                    <th className="py-2.5 px-3 text-right">Saldo Actual</th>
                    <th className="py-2.5 px-3 text-center">Número de Meses en Mora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMora.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No se encontraron registros de mora con los criterios aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredMora.map((item) => (
                      <tr key={item.ID_Mora} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-slate-900">
                          {item.Miembro_Aspirante}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-500 tabular-nums">
                          ${item.Saldo_Anterior.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-700 tabular-nums">
                          ${item.Saldo_Actual.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-800 tabular-nums">
                          {item.Meses_En_Mora}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{filteredMora.length} miembros en atraso</span>
              <span className="font-mono tabular-nums font-semibold text-rose-700">
                Total saldo actual: ${filteredMora.reduce((acc, m) => acc + m.Saldo_Actual, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* 50% DERECHO: Gráfico de Pastel con las tres categorías [solventes, mora pequeña, 3 meses o mas] */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Distribución de Estados de Mora
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Calculado en tiempo real ({stats.totalMembers} miembros totales)
              </span>
            </div>

            {/* SVG Pie Chart Canvas */}
            <div className="py-4 flex flex-col items-center justify-center">
              <div className="relative w-56 h-56">
                <svg viewBox="-100 -100 200 200" className="w-full h-full transform -rotate-90">
                  {/* Slice 1: SOLVENTES! (Green) */}
                  {angleSolventes > 0 && (
                    <path
                      d={makeSlicePath(startSolventes, endSolventes)}
                      fill="#16A34A"
                      className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                      onMouseEnter={() => setHoveredSlice('SOLVENTES!')}
                      onMouseLeave={() => setHoveredSlice(null)}
                      onClick={() =>
                        setSelectedCategoryFilter(selectedCategoryFilter === 'SOLVENTES' ? 'ALL' : 'SOLVENTES')
                      }
                    />
                  )}

                  {/* Slice 2: MORA PEQUEÑA (Amber/Yellow) */}
                  {anglePequena > 0 && (
                    <path
                      d={makeSlicePath(startPequena, endPequena)}
                      fill="#D97706"
                      className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                      onMouseEnter={() => setHoveredSlice('MORA PEQUEÑA')}
                      onMouseLeave={() => setHoveredSlice(null)}
                      onClick={() =>
                        setSelectedCategoryFilter(selectedCategoryFilter === 'PEQUENA' ? 'ALL' : 'PEQUENA')
                      }
                    />
                  )}

                  {/* Slice 3: 3 MESES O MAS (Red) */}
                  {angleTresMas > 0 && (
                    <path
                      d={makeSlicePath(startTresMas, endTresMas)}
                      fill="#DC2626"
                      className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                      onMouseEnter={() => setHoveredSlice('3 MESES O MAS')}
                      onMouseLeave={() => setHoveredSlice(null)}
                      onClick={() =>
                        setSelectedCategoryFilter(selectedCategoryFilter === 'TRES_MAS' ? 'ALL' : 'TRES_MAS')
                      }
                    />
                  )}
                </svg>

                {/* Donut Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {hoveredSlice === 'SOLVENTES!'
                      ? `${stats.solventes.percentage}%`
                      : hoveredSlice === 'MORA PEQUEÑA'
                      ? `${stats.moraPequena.percentage}%`
                      : hoveredSlice === '3 MESES O MAS'
                      ? `${stats.mora3Mas.percentage}%`
                      : `${stats.totalMembers}`}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                    {hoveredSlice || 'Miembros'}
                  </span>
                </div>
              </div>
            </div>

            {/* Exactly Styled Legend matching user image categories: [SOLVENTES!, MORA PEQUEÑA, 3 MESES O MAS] */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              {/* Green Row: SOLVENTES! */}
              <button
                type="button"
                onClick={() =>
                  setSelectedCategoryFilter(selectedCategoryFilter === 'SOLVENTES' ? 'ALL' : 'SOLVENTES')
                }
                className={`w-full p-2.5 rounded-md flex items-center justify-between text-left transition-colors cursor-pointer border ${
                  selectedCategoryFilter === 'SOLVENTES'
                    ? 'ring-2 ring-emerald-500 border-emerald-400 bg-[#DCFCE7]'
                    : 'bg-[#DCFCE7]/70 hover:bg-[#DCFCE7] border-[#86EFAC]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-[#16A34A] shrink-0" />
                  <span className="font-bold text-xs uppercase tracking-wide text-[#14532D]">
                    SOLVENTES!
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-[#14532D]">
                  <span className="font-semibold">{stats.solventes.count} miembros</span>
                  <span className="text-[11px] font-bold bg-white/70 px-1.5 py-0.5 rounded">
                    {stats.solventes.percentage}%
                  </span>
                </div>
              </button>

              {/* Yellow Row: MORA PEQUEÑA */}
              <button
                type="button"
                onClick={() =>
                  setSelectedCategoryFilter(selectedCategoryFilter === 'PEQUENA' ? 'ALL' : 'PEQUENA')
                }
                className={`w-full p-2.5 rounded-md flex items-center justify-between text-left transition-colors cursor-pointer border ${
                  selectedCategoryFilter === 'PEQUENA'
                    ? 'ring-2 ring-amber-500 border-amber-400 bg-[#FEF3C7]'
                    : 'bg-[#FEF3C7]/70 hover:bg-[#FEF3C7] border-[#FDE68A]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-[#D97706] shrink-0" />
                  <span className="font-bold text-xs uppercase tracking-wide text-[#78350F]">
                    MORA PEQUEÑA
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-[#78350F]">
                  <span className="font-semibold">{stats.moraPequena.count} miembros</span>
                  <span className="text-[11px] font-bold bg-white/70 px-1.5 py-0.5 rounded">
                    {stats.moraPequena.percentage}%
                  </span>
                </div>
              </button>

              {/* Red Row: 3 MESES O MAS */}
              <button
                type="button"
                onClick={() =>
                  setSelectedCategoryFilter(selectedCategoryFilter === 'TRES_MAS' ? 'ALL' : 'TRES_MAS')
                }
                className={`w-full p-2.5 rounded-md flex items-center justify-between text-left transition-colors cursor-pointer border ${
                  selectedCategoryFilter === 'TRES_MAS'
                    ? 'ring-2 ring-rose-500 border-rose-400 bg-[#FEE2E2]'
                    : 'bg-[#FEE2E2]/70 hover:bg-[#FEE2E2] border-[#FECACA]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs bg-[#DC2626] shrink-0" />
                  <span className="font-bold text-xs uppercase tracking-wide text-[#7F1D1D]">
                    3 MESES O MAS
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-[#7F1D1D]">
                  <span className="font-semibold">{stats.mora3Mas.count} miembros</span>
                  <span className="text-[11px] font-bold bg-white/70 px-1.5 py-0.5 rounded">
                    {stats.mora3Mas.percentage}%
                  </span>
                </div>
              </button>
            </div>

            {/* Explanatory note */}
            <p className="text-[11px] text-slate-400 mt-3 text-center">
              Haga clic en cualquiera de las categorías para filtrar el cuadro de miembros de la izquierda. Para amortizar o cobrar cuotas, use el módulo de <strong className="text-slate-600">Cuotas</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
