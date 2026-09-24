import React from 'react';
import { DataAnomaly } from '../types';
import { CheckCircle2, AlertTriangle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface DataAuditViewProps {
  anomalies: DataAnomaly[];
  onSelectStudent: (studentId: string) => void;
}

export const DataAuditView: React.FC<DataAuditViewProps> = ({
  anomalies,
  onSelectStudent,
}) => {
  const errors = anomalies.filter((a) => a.severity === 'error');
  const warnings = anomalies.filter((a) => a.severity === 'warning');

  const missingGrades = anomalies.filter((a) => a.type === 'missing_grade');
  const outOfBounds = anomalies.filter((a) => a.type === 'out_of_bounds');
  const missingInfo = anomalies.filter((a) => a.type === 'missing_info');

  return (
    <div className="space-y-6">
      {/* Overview Status Banner */}
      <div
        className={`border rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          anomalies.length === 0
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : errors.length > 0
            ? 'bg-rose-50 border-rose-300 text-rose-950'
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}
      >
        <div className="flex items-start sm:items-center gap-3">
          {anomalies.length === 0 ? (
            <ShieldCheck className="w-8 h-8 text-emerald-700 shrink-0" />
          ) : errors.length > 0 ? (
            <AlertCircle className="w-8 h-8 text-rose-700 shrink-0" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-amber-700 shrink-0" />
          )}

          <div>
            <h2 className="text-base font-bold">
              {anomalies.length === 0
                ? 'Toutes les données de la classe sont conformes et complètes !'
                : errors.length > 0
                ? `${errors.length} anomalie(s) critique(s) et ${warnings.length} avertissement(s) détectés`
                : `${warnings.length} information(s) à compléter avant l'impression définitive`}
            </h2>
            <p className="text-xs mt-0.5 opacity-90">
              Contrôle strict selon le règlement de l'établissement ALMAARIFA : détection des notes manquantes, notes hors barème (0-20), état civil manquant.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1 bg-white/80 rounded border border-current text-xs font-bold font-tabular">
            {anomalies.length} signalement(s)
          </div>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Notes Hors Barème (0 à 20)
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-tabular ${outOfBounds.length > 0 ? 'text-rose-700' : 'text-slate-900'}`}>
              {outOfBounds.length}
            </span>
            <span className="text-xs text-slate-500">
              {outOfBounds.length === 0 ? 'Aucune anomalie' : 'Bloquant'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Évaluations Manquantes
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-tabular ${missingGrades.length > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
              {missingGrades.length}
            </span>
            <span className="text-xs text-slate-500">
              (Indiquées « Non renseignée »)
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Informations d'Identité
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-black font-tabular ${missingInfo.length > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
              {missingInfo.length}
            </span>
            <span className="text-xs text-slate-500">
              (Date ou lieu de naissance)
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Issues Table */}
      {anomalies.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Détail des Anomalies & Données à Vérifier
            </span>
            <span className="text-[11px] text-slate-500">
              Cliquez sur "Corriger" pour ouvrir la fiche de l'élève
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {anomalies.map((anom, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  {anom.severity === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{anom.studentName}</span>
                      {anom.subjectName && (
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {anom.subjectName}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          anom.severity === 'error' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {anom.severity === 'error' ? 'Erreur' : 'Avertissement'}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{anom.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectStudent(anom.studentId)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors shrink-0"
                >
                  <span>Corriger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {anomalies.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Contrôle d'intégrité validé avec succès
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Toutes les notes sont comprises entre 0 et 20, aucun élève n'a d'identité incomplète, et les coefficients sont rigoureusement respectés.
          </p>
        </div>
      )}
    </div>
  );
};
