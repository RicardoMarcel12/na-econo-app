import React from 'react';
import { DatabaseState, ActiveTab } from '../types/models';
import { DollarSign, AlertCircle, BookOpen, TrendingUp, Users, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface DashboardViewProps {
  data: DatabaseState;
  onNavigate: (tab: ActiveTab) => void;
  onOpenNewCuotaModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  onNavigate,
  onOpenNewCuotaModal,
}) => {
  // Calculations
  const totalCuotas = data.cuotas.reduce((acc, curr) => acc + curr.Monto_Cuota, 0);
  const totalMora = data.mora.reduce((acc, curr) => acc + curr.Saldo_Actual, 0);
  const totalMateriales = data.materiales.reduce((acc, curr) => acc + curr.Monto, 0);
  const materialesPendientes = data.materiales.filter(m => m.Estado_Entrega !== 'Entregado').length;
  const balanceOtros = data.otros.reduce((acc, curr) => acc + curr.Monto, 0);
  const uniqueStudents = new Set(data.cuotas.map(c => c.Miembro_Aspirante)).size;

  // Group by Grupo_Horario
  const groupStats: { [key: string]: { count: number; total: number } } = {};
  data.cuotas.forEach(c => {
    if (!groupStats[c.Grupo_Horario]) {
      groupStats[c.Grupo_Horario] = { count: 0, total: 0 };
    }
    groupStats[c.Grupo_Horario].count += 1;
    groupStats[c.Grupo_Horario].total += c.Monto_Cuota;
  });

  // Group by Metodo_Pago
  const methodStats: { [key: string]: { count: number; total: number } } = {};
  data.cuotas.forEach(c => {
    const method = c.Metodo_Pago || 'Otro';
    if (!methodStats[method]) {
      methodStats[method] = { count: 0, total: 0 };
    }
    methodStats[method].count += 1;
    methodStats[method].total += c.Monto_Cuota;
  });

  return (
    <div className="space-y-8">
      {/* Editorial intro block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Resumen Económico y Membresías
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Escuela de Filosofía Nueva Acrópolis · Control centralizado de cuotas, inventario de libros y tesorería
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewCuotaModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            <span>+ Registrar Cuota</span>
          </button>
          <button
            onClick={() => onNavigate('contratos')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Contratos Backend</span>
          </button>
        </div>
      </div>

      {/* KPI 4-Card Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Cuotas */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Recaudación Cuotas</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ${totalCuotas.toFixed(2)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>{data.cuotas.length} registros</span>
            <span aria-hidden="true">·</span>
            <span>{uniqueStudents} estudiantes activos</span>
          </div>
        </div>

        {/* Card 2: Saldo en Mora */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Cartera en Mora</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 font-mono tabular-nums">
            ${totalMora.toFixed(2)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">{data.mora.length} cuentas con atraso</span>
            <button
              onClick={() => onNavigate('mora')}
              className="text-slate-900 hover:underline font-medium inline-flex items-center cursor-pointer"
            >
              Gestionar <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Libros y Materiales */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Libros y Materiales</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ${totalMateriales.toFixed(2)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>{materialesPendientes} entregas pendientes</span>
            <span aria-hidden="true">·</span>
            <span>{data.materiales.length} solicitudes</span>
          </div>
        </div>

        {/* Card 4: Balance Otros */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Balance Otros Ingresos</span>
            <TrendingUp className="w-4 h-4 text-slate-700" />
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums ${balanceOtros >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
            ${balanceOtros.toFixed(2)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>{data.otros.length} movimientos de sede</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Groups & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Groups Distribution */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Distribución por Grupo Horario de Filosofía
            </h3>
            <span className="text-xs text-slate-400">Total cuotas registradas</span>
          </div>
          <div className="divide-y divide-slate-100">
            {Object.entries(groupStats).map(([grupo, stat]) => (
              <div key={grupo} className="py-2.5 flex items-center justify-between text-xs">
                <div className="max-w-[70%]">
                  <p className="font-medium text-slate-800 truncate">{grupo}</p>
                  <p className="text-slate-400 text-[11px]">{stat.count} mensualidades abonadas</p>
                </div>
                <div className="text-right font-mono tabular-nums font-semibold text-slate-900">
                  ${stat.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">
              Canales y Métodos de Cobro
            </h3>
            <span className="text-xs text-slate-400">Págala, Transferencias, Efectivo</span>
          </div>
          <div className="divide-y divide-slate-100">
            {Object.entries(methodStats).map(([metodo, stat]) => (
              <div key={metodo} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-slate-800">{metodo}</p>
                  <p className="text-slate-400 text-[11px]">{stat.count} transacciones procesadas</p>
                </div>
                <div className="text-right font-mono tabular-nums font-semibold text-slate-900">
                  ${stat.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Central Database Integration Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Arquitectura de Integración Backend
          </span>
          <h3 className="text-base font-semibold mt-1 text-white">
            Contratos JSON para Base de Datos Centralizada
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Consulte los JSON Schemas Draft-07, contratos de endpoints REST (/api/v1/cuotas, /api/v1/sync) y valide cargas útiles estructuradas para conectar este frontend con PostgreSQL, Firebase o cualquier API central de Nueva Acrópolis.
          </p>
        </div>
        <button
          onClick={() => onNavigate('contratos')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-white rounded-md hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer shadow-xs shrink-0"
        >
          <span>Abrir Visor de Contratos</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
