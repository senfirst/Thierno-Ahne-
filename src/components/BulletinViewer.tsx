import React, { useState } from 'react';
import { CalculatedStudentResults, ClassStatistics, SchoolConfig, Student } from '../types';
import { BulletinFrench } from './BulletinFrench';
import { BulletinArabic } from './BulletinArabic';
import { ChevronLeft, ChevronRight, Printer, Edit3, Check, RefreshCw } from 'lucide-react';
import { generateCouncilAppreciation, getMentionForAverage } from '../utils/calculations';

interface BulletinViewerProps {
  results: CalculatedStudentResults[];
  statistics: ClassStatistics;
  config: SchoolConfig;
  initialStudentId?: string | null;
  onUpdateStudent: (student: Student) => void;
  onPrintStudent: (studentId: string, mode: 'both' | 'fr' | 'ar') => void;
}

export const BulletinViewer: React.FC<BulletinViewerProps> = ({
  results,
  statistics,
  config,
  initialStudentId,
  onUpdateStudent,
  onPrintStudent,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(() => {
    if (initialStudentId) {
      const idx = results.findIndex((r) => r.student.id === initialStudentId);
      if (idx !== -1) return idx;
    }
    return 0;
  });

  React.useEffect(() => {
    if (initialStudentId) {
      const idx = results.findIndex((r) => r.student.id === initialStudentId);
      if (idx !== -1) {
        setSelectedIndex(idx);
      }
    }
  }, [initialStudentId, results]);
  const [displayMode, setDisplayMode] = useState<'both' | 'fr' | 'ar'>('both');
  const [isEditingRemarks, setIsEditingRemarks] = useState(false);

  const currentResult = results[selectedIndex] || results[0];

  if (!currentResult) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-slate-200">
        <p className="text-slate-600">Aucun élève disponible pour l'affichage.</p>
      </div>
    );
  }

  const { student } = currentResult;

  const handlePrev = () => {
    if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
  };

  const handleNext = () => {
    if (selectedIndex < results.length - 1) setSelectedIndex(selectedIndex + 1);
  };

  const handleResetToAutoRemarks = () => {
    const mentions = getMentionForAverage(
      currentResult.moyenneGenerale,
      student.absencesNonJustifiees,
      student.conduite
    );
    const autoApp = generateCouncilAppreciation(student, currentResult.moyenneGenerale, mentions.fr);

    onUpdateStudent({
      ...student,
      customAppreciationFr: undefined,
      customAppreciationAr: undefined,
      customMentionFr: undefined,
      customMentionAr: undefined,
    });
    setIsEditingRemarks(false);
  };

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-xs no-print">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Student Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={handlePrev}
              disabled={selectedIndex === 0}
              className="p-1.5 rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Élève précédent"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>

            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 w-full sm:w-72"
            >
              {results.map((r, idx) => (
                <option key={r.student.id} value={idx}>
                  #{r.rangTextFr} - {r.student.nom} {r.student.prenom} ({r.moyenneGenerale !== null ? `${r.moyenneGenerale.toFixed(2)}/20` : 'En attente'})
                </option>
              ))}
            </select>

            <button
              onClick={handleNext}
              disabled={selectedIndex === results.length - 1}
              className="p-1.5 rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Élève suivant"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>

            <span className="text-xs text-slate-500 font-medium whitespace-nowrap ml-1">
              Élève <span className="font-bold text-slate-800">{selectedIndex + 1}</span> / {results.length}
            </span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md self-center">
            <button
              onClick={() => setDisplayMode('both')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                displayMode === 'both' ? 'bg-white text-emerald-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jumelé (FR & AR)
            </button>
            <button
              onClick={() => setDisplayMode('fr')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                displayMode === 'fr' ? 'bg-white text-emerald-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Français seul
            </button>
            <button
              onClick={() => setDisplayMode('ar')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                displayMode === 'ar' ? 'bg-white text-emerald-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Arabe seul (كشف)
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsEditingRemarks(!isEditingRemarks)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors whitespace-nowrap"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>{isEditingRemarks ? 'Masquer éditeur' : 'Modifier avis conseil'}</span>
            </button>

            <button
              onClick={() => onPrintStudent(student.id, displayMode)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded shadow-xs transition-colors whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer {displayMode === 'both' ? 'les 2 bulletins' : displayMode === 'fr' ? 'bulletin FR' : 'bulletin AR'}</span>
            </button>
          </div>
        </div>

        {/* Remarks editor drawer */}
        {isEditingRemarks && (
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800">
                  Appréciation Conseil de Classe (Français, max 2 phrases) :
                </label>
                <button
                  type="button"
                  onClick={handleResetToAutoRemarks}
                  className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Rétablir l'appréciation calculée
                </button>
              </div>
              <textarea
                value={currentResult.appreciationConseilFr}
                onChange={(e) => {
                  onUpdateStudent({
                    ...student,
                    customAppreciationFr: e.target.value,
                  });
                }}
                rows={3}
                className="w-full p-2 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700 text-xs text-slate-900"
                placeholder="2 phrases bienveillantes et professionnelles..."
              />

              <div className="mt-2 flex items-center gap-2">
                <span className="text-slate-600 font-medium">Mention attribuée :</span>
                <input
                  type="text"
                  value={currentResult.mentionFr}
                  onChange={(e) => {
                    onUpdateStudent({
                      ...student,
                      customMentionFr: e.target.value,
                    });
                  }}
                  className="px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-900 text-xs w-48"
                />
              </div>
            </div>

            <div dir="rtl" className="font-arabic text-right">
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800">
                  ملاحظة مجلس القسم (باللغة العربية، جملتان كحد أقصى) :
                </label>
              </div>
              <textarea
                value={currentResult.appreciationConseilAr}
                onChange={(e) => {
                  onUpdateStudent({
                    ...student,
                    customAppreciationAr: e.target.value,
                  });
                }}
                rows={3}
                className="w-full p-2 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700 text-xs text-slate-900 font-arabic"
                placeholder="ملاحظة تربوية مهنية..."
              />

              <div className="mt-2 flex items-center gap-2 justify-start">
                <span className="text-slate-600 font-medium">التقدير :</span>
                <input
                  type="text"
                  value={currentResult.mentionAr}
                  onChange={(e) => {
                    onUpdateStudent({
                      ...student,
                      customMentionAr: e.target.value,
                    });
                  }}
                  className="px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-900 text-xs w-48 font-arabic"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulletins Display */}
      {displayMode === 'both' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <div>
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Bulletin 1 : Version Française (Réglementaire)
              </span>
              <span className="text-[11px] text-slate-500">
                1 élève = 2 bulletins
              </span>
            </div>
            <BulletinFrench result={currentResult} statistics={statistics} config={config} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between px-1" dir="rtl">
              <span className="text-xs font-bold text-slate-700 font-arabic">
                كشف 2 : النسخة باللغة العربية (مطابقة تماماً للنتائج)
              </span>
              <span className="text-[11px] text-slate-500 font-arabic">
                تلميذ واحد = كشفان
              </span>
            </div>
            <BulletinArabic result={currentResult} statistics={statistics} config={config} />
          </div>
        </div>
      )}

      {displayMode === 'fr' && (
        <div className="max-w-[850px] mx-auto">
          <BulletinFrench result={currentResult} statistics={statistics} config={config} />
        </div>
      )}

      {displayMode === 'ar' && (
        <div className="max-w-[850px] mx-auto">
          <BulletinArabic result={currentResult} statistics={statistics} config={config} />
        </div>
      )}
    </div>
  );
};
