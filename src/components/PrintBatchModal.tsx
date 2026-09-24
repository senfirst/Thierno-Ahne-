import React, { useState } from 'react';
import { Printer, X, FileText, CheckCircle2 } from 'lucide-react';
import { SchoolConfig } from '../types';

export type PrintScope = 'official_paired' | 'all_french' | 'all_arabic' | 'palmares';

interface PrintBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentCount: number;
  config: SchoolConfig;
  onConfirmPrint: (scope: PrintScope) => void;
}

export const PrintBatchModal: React.FC<PrintBatchModalProps> = ({
  isOpen,
  onClose,
  studentCount,
  config,
  onConfirmPrint,
}) => {
  const [selectedScope, setSelectedScope] = useState<PrintScope>('official_paired');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-800" />
            <h3 className="font-bold text-sm text-slate-900">
              Impression / Export PDF des Documents Scolaires
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-600">
            Sélectionnez le mode d'impression pour la classe <strong className="text-slate-900">{config.classe}</strong> ({studentCount} élèves). Les bulletins sont formatés pour le format papier standard A4.
          </p>

          <div className="space-y-2.5">
            {/* Option 1: Official Paired (Section 13) */}
            <label
              className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedScope === 'official_paired'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="printScope"
                  checked={selectedScope === 'official_paired'}
                  onChange={() => setSelectedScope('official_paired')}
                  className="mt-0.5 text-emerald-700 focus:ring-emerald-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      Règle Officielle Section 13 (Alterné : FR puis AR)
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Recommandé
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Pour chaque élève : Bulletin Français immédiatement suivi du Bulletin Arabe du même élève (Élève 1 FR → AR, Élève 2 FR → AR...).
                  </p>
                  <p className="text-[11px] font-bold text-emerald-900 mt-1">
                    Total : {studentCount * 2} pages / bulletins
                  </p>
                </div>
              </div>
            </label>

            {/* Option 2: All French */}
            <label
              className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedScope === 'all_french'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="printScope"
                  checked={selectedScope === 'all_french'}
                  onChange={() => setSelectedScope('all_french')}
                  className="mt-0.5 text-emerald-700 focus:ring-emerald-600"
                />
                <div>
                  <span className="font-bold text-slate-900">
                    Tous les bulletins en Français uniquement
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Imprime les bulletins français de toute la classe par ordre de classement.
                  </p>
                  <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                    Total : {studentCount} bulletins
                  </p>
                </div>
              </div>
            </label>

            {/* Option 3: All Arabic */}
            <label
              className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedScope === 'all_arabic'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="printScope"
                  checked={selectedScope === 'all_arabic'}
                  onChange={() => setSelectedScope('all_arabic')}
                  className="mt-0.5 text-emerald-700 focus:ring-emerald-600"
                />
                <div>
                  <span className="font-bold text-slate-900 font-arabic">
                    كشوف النتائج باللغة العربية فقط (القسم كاملاً)
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Imprime tous les bulletins en langue arabe (RTL) selon le classement de mérite.
                  </p>
                  <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                    Total : {studentCount} bulletins
                  </p>
                </div>
              </div>
            </label>

            {/* Option 4: Palmares */}
            <label
              className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedScope === 'palmares'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="printScope"
                  checked={selectedScope === 'palmares'}
                  onChange={() => setSelectedScope('palmares')}
                  className="mt-0.5 text-emerald-700 focus:ring-emerald-600"
                />
                <div>
                  <span className="font-bold text-slate-900">
                    Tableau Récapitulatif / Procès-Verbal des Délibérations
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Feuille de synthèse officielle avec classement complet, statistiques et signatures de conseil.
                  </p>
                </div>
              </div>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onConfirmPrint(selectedScope);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Lancer l'impression</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
