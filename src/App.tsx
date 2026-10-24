/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ActiveTab, DatabaseState, Miembro, CuotaMembresia, MaterialClase, TransaccionOtro, ReporteMora } from './types/models';
import { loadDatabaseState, saveDatabaseState, resetDatabaseToDefault } from './utils/storage';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { MiembrosView } from './components/MiembrosView';
import { CuotasView } from './components/CuotasView';
import { MaterialesView } from './components/MaterialesView';
import { OtrosView } from './components/OtrosView';
import { MoraView } from './components/MoraView';
import { ContractsView } from './components/ContractsView';
import { DataDictionaryView } from './components/DataDictionaryView';
import { ExportAllModal } from './components/ExportAllModal';

export default function App() {
  const [data, setData] = useState<DatabaseState>(() => loadDatabaseState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCuotaAddModalOpenDirectly, setIsCuotaAddModalOpenDirectly] = useState(false);
  const [presetMemberName, setPresetMemberName] = useState<string | undefined>(undefined);

  // Sync state changes with localStorage
  useEffect(() => {
    saveDatabaseState(data);
  }, [data]);

  // Miembros Handlers
  const handleAddMiembro = (newMiembro: Omit<Miembro, 'ID_Miembro'>) => {
    const nextId = data.miembros.length > 0 ? Math.max(...data.miembros.map(m => m.ID_Miembro)) + 1 : 1;
    const item: Miembro = {
      ...newMiembro,
      ID_Miembro: nextId,
    };
    setData((prev) => ({
      ...prev,
      miembros: [item, ...prev.miembros],
    }));
  };

  const handleUpdateMiembro = (updated: Miembro) => {
    setData((prev) => ({
      ...prev,
      miembros: prev.miembros.map((m) => (m.ID_Miembro === updated.ID_Miembro ? updated : m)),
    }));
  };

  const handleDeleteMiembro = (id: number) => {
    if (!confirm('¿Desea eliminar este registro de miembro?')) return;
    setData((prev) => ({
      ...prev,
      miembros: prev.miembros.filter((m) => m.ID_Miembro !== id),
    }));
  };

  const handleImportMiembros = (newItems: Miembro[]) => {
    setData((prev) => ({
      ...prev,
      miembros: [...newItems, ...prev.miembros],
    }));
  };

  // Cuotas Handlers
  const handleAddCuota = (newCuota: Omit<CuotaMembresia, 'ID_Registro'>) => {
    const nextId = data.cuotas.length > 0 ? Math.max(...data.cuotas.map(c => c.ID_Registro)) + 1 : 1;
    const item: CuotaMembresia = {
      ...newCuota,
      ID_Registro: nextId,
    };

    // Check if student exists in mora to amortize debt automatically
    const updatedMora = data.mora.map((m) => {
      if (m.Miembro_Aspirante.toLowerCase() === item.Miembro_Aspirante.toLowerCase() && m.Saldo_Actual > 0) {
        const newSaldo = Math.max(0, m.Saldo_Actual - item.Monto_Cuota);
        const newMeses = newSaldo === 0 ? 0 : Math.max(1, Math.ceil(newSaldo / 25.0));
        return {
          ...m,
          Saldo_Actual: newSaldo,
          Meses_En_Mora: newMeses,
          Ultimo_Contacto: item.Fecha_Pago,
          Estado_Gestion: newSaldo === 0 ? ('Notificado' as const) : m.Estado_Gestion,
        };
      }
      return m;
    });

    setData((prev) => ({
      ...prev,
      cuotas: [item, ...prev.cuotas],
      mora: updatedMora,
    }));
  };

  const handleUpdateCuota = (updated: CuotaMembresia) => {
    setData((prev) => ({
      ...prev,
      cuotas: prev.cuotas.map((c) => (c.ID_Registro === updated.ID_Registro ? updated : c)),
    }));
  };

  const handleDeleteCuota = (id: number) => {
    if (!confirm('¿Desea eliminar este registro de cuota?')) return;
    setData((prev) => ({
      ...prev,
      cuotas: prev.cuotas.filter((c) => c.ID_Registro !== id),
    }));
  };

  const handleImportCuotas = (newItems: CuotaMembresia[]) => {
    setData((prev) => ({
      ...prev,
      cuotas: [...newItems, ...prev.cuotas],
    }));
  };

  // Materiales Handlers
  const handleAddMaterial = (newMat: Omit<MaterialClase, 'ID_Material_Log'>) => {
    const nextId = data.materiales.length > 0 ? Math.max(...data.materiales.map(m => m.ID_Material_Log)) + 1 : 1;
    const item: MaterialClase = { ...newMat, ID_Material_Log: nextId };
    setData((prev) => ({
      ...prev,
      materiales: [item, ...prev.materiales],
    }));
  };

  const handleUpdateMaterial = (updated: MaterialClase) => {
    setData((prev) => ({
      ...prev,
      materiales: prev.materiales.map((m) => (m.ID_Material_Log === updated.ID_Material_Log ? updated : m)),
    }));
  };

  const handleDeleteMaterial = (id: number) => {
    if (!confirm('¿Desea eliminar este registro de material?')) return;
    setData((prev) => ({
      ...prev,
      materiales: prev.materiales.filter((m) => m.ID_Material_Log !== id),
    }));
  };

  const handleImportMateriales = (items: MaterialClase[]) => {
    setData((prev) => ({
      ...prev,
      materiales: [...items, ...prev.materiales],
    }));
  };

  // Otros Handlers
  const handleAddTransaccion = (newTx: Omit<TransaccionOtro, 'ID_Transaccion'>) => {
    const nextId = data.otros.length > 0 ? Math.max(...data.otros.map(t => t.ID_Transaccion)) + 1 : 1;
    const item: TransaccionOtro = { ...newTx, ID_Transaccion: nextId };
    setData((prev) => ({
      ...prev,
      otros: [item, ...prev.otros],
    }));
  };

  const handleUpdateTransaccion = (updated: TransaccionOtro) => {
    setData((prev) => ({
      ...prev,
      otros: prev.otros.map((t) => (t.ID_Transaccion === updated.ID_Transaccion ? updated : t)),
    }));
  };

  const handleDeleteTransaccion = (id: number) => {
    if (!confirm('¿Desea eliminar esta transacción?')) return;
    setData((prev) => ({
      ...prev,
      otros: prev.otros.filter((t) => t.ID_Transaccion !== id),
    }));
  };

  const handleImportOtros = (items: TransaccionOtro[]) => {
    setData((prev) => ({
      ...prev,
      otros: [...items, ...prev.otros],
    }));
  };

  const handleResetToDefault = () => {
    const fresh = resetDatabaseToDefault();
    setData(fresh);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Strict Top Bar Contract */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsCuotaAddModalOpenDirectly(false);
          setPresetMemberName(undefined);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            data={data}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenNewCuotaModal={() => {
              setActiveTab('cuotas');
              setIsCuotaAddModalOpenDirectly(true);
            }}
          />
        )}

        {activeTab === 'miembros' && (
          <MiembrosView
            miembros={data.miembros}
            onAddMiembro={handleAddMiembro}
            onUpdateMiembro={handleUpdateMiembro}
            onDeleteMiembro={handleDeleteMiembro}
            onImportMiembros={handleImportMiembros}
            onNavigateToCuotasWithMember={(nombre) => {
              setPresetMemberName(nombre);
              setActiveTab('cuotas');
              setIsCuotaAddModalOpenDirectly(true);
            }}
          />
        )}

        {activeTab === 'cuotas' && (
          <CuotasView
            cuotas={data.cuotas}
            moraList={data.mora}
            miembros={data.miembros}
            onAddCuota={handleAddCuota}
            onUpdateCuota={handleUpdateCuota}
            onDeleteCuota={handleDeleteCuota}
            onImportCuotas={handleImportCuotas}
            isAddModalOpenInitially={isCuotaAddModalOpenDirectly}
            initialMemberNamePreset={presetMemberName}
            onCloseInitialModal={() => {
              setIsCuotaAddModalOpenDirectly(false);
              setPresetMemberName(undefined);
            }}
          />
        )}

        {activeTab === 'materiales' && (
          <MaterialesView
            materiales={data.materiales}
            onAddMaterial={handleAddMaterial}
            onUpdateMaterial={handleUpdateMaterial}
            onDeleteMaterial={handleDeleteMaterial}
            onImportMateriales={handleImportMateriales}
          />
        )}

        {activeTab === 'otros' && (
          <OtrosView
            otros={data.otros}
            onAddTransaccion={handleAddTransaccion}
            onUpdateTransaccion={handleUpdateTransaccion}
            onDeleteTransaccion={handleDeleteTransaccion}
            onImportOtros={handleImportOtros}
          />
        )}

        {activeTab === 'mora' && (
          <MoraView
            moraList={data.mora}
            cuotas={data.cuotas}
            onNavigateToCuotas={() => setActiveTab('cuotas')}
          />
        )}

        {activeTab === 'contratos' && (
          <ContractsView data={data} />
        )}

        {activeTab === 'diccionario' && (
          <DataDictionaryView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">App Economia NA</span>
            <span aria-hidden="true">·</span>
            <span>Escuela de Filosofía Nueva Acrópolis</span>
            <span aria-hidden="true">·</span>
            <span>El Salvador</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Registro Maestro de Miembros</span>
            <span aria-hidden="true">·</span>
            <span>Contratos JSON Draft-07</span>
          </div>
        </div>
      </footer>

      {/* Export & Backup Modal */}
      <ExportAllModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={data}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
}
