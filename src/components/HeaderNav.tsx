import React from 'react';
import { SchoolConfig } from '../types';
import { Printer, Download, PlusCircle, AlertCircle } from 'lucide-react';

interface HeaderNavProps {
  currentTab: 'summary' | 'bulletins' | 'grades' | 'audit' | 'settings';
  setCurrentTab: (tab: 'summary' | 'bulletins' | 'grades' | 'audit' | 'settings') => void;
  config: SchoolConfig;
  anomalyCount: number;
  onOpenPrintModal: () => void;
  onOpenNewStudentModal: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentTab,
  setCurrentTab,
  config,
  anomalyCount,
  onOpenPrintModal,
  onOpenNewStudentModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, single line */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center text-amber-300 font-bold text-xs tracking-wider border border-amber-400/40">
            ALM
          </div>
          <button
            onClick={() => setCurrentTab('summary')}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 hover:text-emerald-800 transition-colors whitespace-nowrap text-left"
          >
            {config.nomEtablissement}
          </button>
        </div>

        {/* Zone 2: Clean navigation links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => setCurrentTab('summary')}
            className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
              currentTab === 'summary'
                ? 'border-emerald-700 text-emerald-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Palmarès & Classement
          </button>
          <button
            onClick={() => setCurrentTab('bulletins')}
            className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
              currentTab === 'bulletins'
                ? 'border-emerald-700 text-emerald-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Bulletins Bilingues (FR / AR)
          </button>
          <button
            onClick={() => setCurrentTab('grades')}
            className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
              currentTab === 'grades'
                ? 'border-emerald-700 text-emerald-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Saisie des Notes
          </button>
          <button
            onClick={() => setCurrentTab('audit')}
            className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              currentTab === 'audit'
                ? 'border-emerald-700 text-emerald-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Contrôle & Audit</span>
            {anomalyCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title={`${anomalyCount} anomalies`} />
            )}
          </button>
          <button
            onClick={() => setCurrentTab('settings')}
            className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
              currentTab === 'settings'
                ? 'border-emerald-700 text-emerald-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Configuration
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenNewStudentModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Nouvel Élève</span>
          </button>
          <button
            onClick={onOpenPrintModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer Bulletins</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex items-center justify-between overflow-x-auto px-4 py-2 border-t border-slate-200 bg-slate-50 gap-2 text-xs">
        <button
          onClick={() => setCurrentTab('summary')}
          className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap ${
            currentTab === 'summary' ? 'bg-emerald-800 text-white' : 'text-slate-700'
          }`}
        >
          Palmarès
        </button>
        <button
          onClick={() => setCurrentTab('bulletins')}
          className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap ${
            currentTab === 'bulletins' ? 'bg-emerald-800 text-white' : 'text-slate-700'
          }`}
        >
          Bulletins (FR/AR)
        </button>
        <button
          onClick={() => setCurrentTab('grades')}
          className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap ${
            currentTab === 'grades' ? 'bg-emerald-800 text-white' : 'text-slate-700'
          }`}
        >
          Notes
        </button>
        <button
          onClick={() => setCurrentTab('audit')}
          className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap ${
            currentTab === 'audit' ? 'bg-emerald-800 text-white' : 'text-slate-700'
          }`}
        >
          Audit ({anomalyCount})
        </button>
        <button
          onClick={() => setCurrentTab('settings')}
          className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap ${
            currentTab === 'settings' ? 'bg-emerald-800 text-white' : 'text-slate-700'
          }`}
        >
          Paramètres
        </button>
      </div>
    </header>
  );
};
