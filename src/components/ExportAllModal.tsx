import React, { useState } from 'react';
import { DatabaseState } from '../types/models';
import { exportMiembrosCSV, exportCuotasCSV, exportMaterialesCSV, exportOtrosCSV, exportMoraCSV, downloadFile } from '../utils/csvEngine';
import { X, Download, FileSpreadsheet, FileJson, RefreshCw, Check } from 'lucide-react';

interface ExportAllModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DatabaseState;
  onResetToDefault: () => void;
}

export const ExportAllModal: React.FC<ExportAllModalProps> = ({
  isOpen,
  onClose,
  data,
  onResetToDefault,
}) => {
  const [downloadedAll, setDownloadedAll] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleExportAllCSVs = () => {
    // 0. Miembros
    downloadFile(exportMiembrosCSV(data.miembros), 'registro-miembros.csv');
    // 1. Cuotas
    setTimeout(() => {
      downloadFile(exportCuotasCSV(data.cuotas), '1-Registro-cuotas-membresia.csv');
    }, 200);
    // 2. Materiales
    setTimeout(() => {
      downloadFile(exportMaterialesCSV(data.materiales), '2-Registro-materiales-clase.csv');
    }, 400);
    // 3. Otros
    setTimeout(() => {
      downloadFile(exportOtrosCSV(data.otros), '3-registro-otros.csv');
    }, 600);
    // 4. Mora
    setTimeout(() => {
      downloadFile(exportMoraCSV(data.mora), '4-reporte-mora.csv');
    }, 800);

    setDownloadedAll(true);
    setTimeout(() => setDownloadedAll(false), 3000);
  };

  const handleExportJSON = () => {
    const payload = {
      version: '1.0.0',
      sede: 'Nueva Acrópolis - San Salvador',
      fecha_exportacion: new Date().toISOString(),
      miembros: data.miembros,
      cuotas: data.cuotas,
      materiales: data.materiales,
      otros: data.otros,
      mora: data.mora,
    };
    downloadFile(JSON.stringify(payload, null, 2), 'app_economia_na_central_backup.json', 'application/json');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Centro de Exportación y Respaldo
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Descargue los registros en CSV original del PRD o en JSON de backend centralizado
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Option 1: CSV Batch */}
        <div className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors bg-slate-50/50 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Exportar los 4 Archivos CSV Oficiales
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Descarga individualmente o en lote: 1-Registro-cuotas-membresia, 2-materiales, 3-otros y 4-reporte-mora
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => downloadFile(exportMiembrosCSV(data.miembros), 'registro-miembros.csv')}
              className="p-2 border border-slate-200 bg-white rounded text-left hover:bg-slate-50 font-mono text-[11px] truncate cursor-pointer col-span-2 sm:col-span-1"
            >
              0. Miembros ({data.miembros.length})
            </button>
            <button
              onClick={() => downloadFile(exportCuotasCSV(data.cuotas), '1-Registro-cuotas-membresia.csv')}
              className="p-2 border border-slate-200 bg-white rounded text-left hover:bg-slate-50 font-mono text-[11px] truncate cursor-pointer"
            >
              1. Cuotas ({data.cuotas.length})
            </button>
            <button
              onClick={() => downloadFile(exportMaterialesCSV(data.materiales), '2-Registro-materiales-clase.csv')}
              className="p-2 border border-slate-200 bg-white rounded text-left hover:bg-slate-50 font-mono text-[11px] truncate cursor-pointer"
            >
              2. Materiales ({data.materiales.length})
            </button>
            <button
              onClick={() => downloadFile(exportOtrosCSV(data.otros), '3-registro-otros.csv')}
              className="p-2 border border-slate-200 bg-white rounded text-left hover:bg-slate-50 font-mono text-[11px] truncate cursor-pointer"
            >
              3. Otros ({data.otros.length})
            </button>
            <button
              onClick={() => downloadFile(exportMoraCSV(data.mora), '4-reporte-mora.csv')}
              className="p-2 border border-slate-200 bg-white rounded text-left hover:bg-slate-50 font-mono text-[11px] truncate cursor-pointer"
            >
              4. Mora ({data.mora.length})
            </button>
          </div>

          <button
            onClick={handleExportAllCSVs}
            className="w-full py-2 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            {downloadedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Descarga de los archivos CSV iniciada</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Descargar los Archivos CSV a la vez</span>
              </>
            )}
          </button>
        </div>

        {/* Option 2: Central JSON */}
        <div className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileJson className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Respaldo Completo en JSON Centralizado
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Formato estructurado según el contrato de base de datos central
              </p>
            </div>
          </div>
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            Exportar JSON
          </button>
        </div>

        {/* Reset Database */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          {showResetConfirm ? (
            <div className="flex items-center gap-2 w-full justify-between bg-rose-50 p-2.5 rounded border border-rose-200">
              <span className="text-rose-800 font-medium">¿Restablecer datos demo de fábrica?</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    onResetToDefault();
                    setShowResetConfirm(false);
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-rose-600 text-white rounded font-medium hover:bg-rose-700 cursor-pointer"
                >
                  Sí, reiniciar
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2.5 py-1 text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-slate-400 hover:text-rose-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restablecer datos predeterminados</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
