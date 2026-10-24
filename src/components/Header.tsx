import React from 'react';
import { ActiveTab } from '../types/models';
import { Download } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenExportModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 text-left hover:text-slate-700 transition-colors cursor-pointer"
          >
            App Economia NA
          </button>

          {/* Zone 2: Navigation Links (1-2 word labels, single-line) */}
          <nav className="hidden md:flex items-center gap-6 overflow-x-auto py-2">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-slate-900 border-b-2 border-slate-900 pb-1'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onSelectTab('miembros')}
              className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'miembros'
                  ? 'text-slate-900 border-b-2 border-slate-900 pb-1'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Miembros
            </button>
            <button
              onClick={() => onSelectTab('cuotas')}
              className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'cuotas'
                  ? 'text-slate-900 border-b-2 border-slate-900 pb-1'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Cuotas
            </button>
            <button
              onClick={() => onSelectTab('materiales')}
              className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'materiales'
                  ? 'text-slate-900 border-b-2 border-slate-900 pb-1'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Materiales
            </button>
            <button
              onClick={() => onSelectTab('otros')}
              className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'otros'
                  ? 'text-slate-900 border-b-2 border-slate-900 pb-1'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Otros
            </button>
            <button
              onClick={() => onSelectTab('mora')}
              className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'mora'
                  ? 'text-slate-900 border-b-2 border-slate-900 pb-1'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Mora
            </button>
            <button
              onClick={() => onSelectTab('contratos')}
              className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'contratos'
                  ? 'text-slate-900 border-b-2 border-slate-900 pb-1'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Contratos JSON
            </button>
            <button
              onClick={() => onSelectTab('diccionario')}
              className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'diccionario'
                  ? 'text-slate-900 border-b-2 border-slate-900 pb-1'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Diccionario
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 active:bg-slate-950 transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Todo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center gap-4 px-4 py-2 border-t border-slate-100 overflow-x-auto text-xs bg-slate-50">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`whitespace-nowrap font-medium ${activeTab === 'dashboard' ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onSelectTab('miembros')}
          className={`whitespace-nowrap font-medium ${activeTab === 'miembros' ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}
        >
          Miembros
        </button>
        <button
          onClick={() => onSelectTab('cuotas')}
          className={`whitespace-nowrap font-medium ${activeTab === 'cuotas' ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}
        >
          Cuotas
        </button>
        <button
          onClick={() => onSelectTab('materiales')}
          className={`whitespace-nowrap font-medium ${activeTab === 'materiales' ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}
        >
          Materiales
        </button>
        <button
          onClick={() => onSelectTab('otros')}
          className={`whitespace-nowrap font-medium ${activeTab === 'otros' ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}
        >
          Otros
        </button>
        <button
          onClick={() => onSelectTab('mora')}
          className={`whitespace-nowrap font-medium ${activeTab === 'mora' ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}
        >
          Mora
        </button>
        <button
          onClick={() => onSelectTab('contratos')}
          className={`whitespace-nowrap font-medium ${activeTab === 'contratos' ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}
        >
          Contratos JSON
        </button>
        <button
          onClick={() => onSelectTab('diccionario')}
          className={`whitespace-nowrap font-medium ${activeTab === 'diccionario' ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}
        >
          Diccionario
        </button>
      </div>
    </header>
  );
};
