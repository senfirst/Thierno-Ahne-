import React from 'react';
import { CalculatedStudentResults, ClassStatistics, SchoolConfig } from '../types';
import { BulletinFrench } from './BulletinFrench';
import { BulletinArabic } from './BulletinArabic';
import { OfficialEmblem } from './OfficialEmblem';
import { formatGrade } from '../utils/calculations';
import { PrintScope } from './PrintBatchModal';

export interface PrintQueueState {
  type: 'batch' | 'single';
  batchScope?: PrintScope;
  singleStudentId?: string;
  singleMode?: 'both' | 'fr' | 'ar';
}

interface PrintContainerProps {
  queue: PrintQueueState | null;
  results: CalculatedStudentResults[];
  statistics: ClassStatistics;
  config: SchoolConfig;
}

export const PrintContainer: React.FC<PrintContainerProps> = ({
  queue,
  results,
  statistics,
  config,
}) => {
  if (!queue) return null;

  // Single student print
  if (queue.type === 'single') {
    const targetResult = results.find((r) => r.student.id === queue.singleStudentId) || results[0];
    if (!targetResult) return null;

    const mode = queue.singleMode || 'both';

    return (
      <div className="hidden print:block print-container">
        {(mode === 'both' || mode === 'fr') && (
          <div className={mode === 'both' ? 'print-page-break' : ''}>
            <BulletinFrench result={targetResult} statistics={statistics} config={config} />
          </div>
        )}
        {(mode === 'both' || mode === 'ar') && (
          <div>
            <BulletinArabic result={targetResult} statistics={statistics} config={config} />
          </div>
        )}
      </div>
    );
  }

  // Batch Print
  const scope = queue.batchScope || 'official_paired';

  if (scope === 'palmares') {
    return (
      <div className="hidden print:block print-container p-6 text-xs text-slate-900">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
          <p className="font-extrabold text-sm uppercase tracking-wider">
            {config.republiqueFr}
          </p>
          <p className="text-xs italic text-slate-700">
            {config.deviseNationaleFr}
          </p>
          <h1 className="font-black text-base uppercase mt-1">
            {config.nomEtablissement}
          </h1>
          <div className="inline-block mt-1 px-4 py-1 border border-slate-900 font-extrabold text-xs uppercase bg-slate-50">
            PROCÈS-VERBAL DES DÉLIBÉRATIONS · TABLEAU RÉCAPITULATIF (ORDRE DE MÉRITE)
          </div>
          <div className="flex justify-between items-center text-xs mt-2 px-2 text-slate-700">
            <span>Année scolaire : <strong className="text-slate-900">{config.anneeScolaire}</strong></span>
            <span>Période : <strong className="text-slate-900">{config.trimestre}</strong></span>
            <span>Classe : <strong className="text-slate-900">{config.classe}</strong></span>
            <span>Effectif : <strong className="text-slate-900">{statistics.effectifTotal} élèves</strong></span>
          </div>
        </div>

        {/* Palmarès Table */}
        <table className="w-full border-collapse border border-slate-400 text-[10px] mb-4">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-400 uppercase font-bold">
              <th className="border border-slate-400 p-1.5 text-center w-12">Rang</th>
              <th className="border border-slate-400 p-1.5 text-left w-24">Matricule</th>
              <th className="border border-slate-400 p-1.5 text-left">Nom & Prénom</th>
              <th className="border border-slate-400 p-1.5 text-center w-10">Sexe</th>
              <th className="border border-slate-400 p-1.5 text-right w-20">Total Pts</th>
              <th className="border border-slate-400 p-1.5 text-right w-20">Moyenne</th>
              <th className="border border-slate-400 p-1.5 text-left">Mention du Conseil</th>
              <th className="border border-slate-400 p-1.5 text-center w-16">Absences</th>
              <th className="border border-slate-400 p-1.5 text-center w-16">Conduite</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.student.id} className="border-b border-slate-300">
                <td className="border border-slate-400 p-1 text-center font-bold font-tabular">
                  {r.rangTextFr}
                </td>
                <td className="border border-slate-400 p-1 font-mono text-[9px]">
                  {r.student.matricule}
                </td>
                <td className="border border-slate-400 p-1 font-bold">
                  {r.student.nom} {r.student.prenom}
                </td>
                <td className="border border-slate-400 p-1 text-center">
                  {r.student.sexe}
                </td>
                <td className="border border-slate-400 p-1 text-right font-tabular">
                  {formatGrade(r.totalPoints)}
                </td>
                <td className="border border-slate-400 p-1 text-right font-bold font-tabular">
                  {formatGrade(r.moyenneGenerale)}
                </td>
                <td className="border border-slate-400 p-1 text-[9.5px]">
                  {r.mentionFr}
                </td>
                <td className="border border-slate-400 p-1 text-center font-tabular">
                  {r.student.absencesNonJustifiees} NJ
                </td>
                <td className="border border-slate-400 p-1 text-center text-[9px]">
                  {r.student.conduite}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Stats & Signatures */}
        <div className="grid grid-cols-2 gap-4 border border-slate-400 p-3 bg-slate-50 text-[10.5px] mb-4">
          <div>
            <p className="font-bold uppercase text-[9.5px] mb-1">Statistiques Officielles de la Classe</p>
            <p>Moyenne générale de la classe : <strong>{formatGrade(statistics.moyenneClasse)} / 20</strong></p>
            <p>Plus forte moyenne : <strong>{formatGrade(statistics.plusForteMoyenne)} / 20</strong></p>
            <p>Plus faible moyenne : <strong>{formatGrade(statistics.plusFaibleMoyenne)} / 20</strong></p>
            <p>Taux de réussite (≥ 10/20) : <strong>{statistics.tauxReussite}%</strong></p>
          </div>
          <div>
            <p className="font-bold uppercase text-[9.5px] mb-1">Répartition des Distinctions</p>
            <p>Félicitations (≥ 16) : <strong>{statistics.nbFelicitations}</strong></p>
            <p>Tableau d'honneur (≥ 14) : <strong>{statistics.nbTableauHonneur}</strong></p>
            <p>Encouragements (≥ 12) : <strong>{statistics.nbEncouragements}</strong></p>
            <p>Moyennes &lt; 10 : <strong>{statistics.nbInsuffisants}</strong></p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4 text-center">
          <div className="border border-dashed border-slate-400 p-3 h-28 flex flex-col justify-between">
            <p className="font-bold">Le Professeur Principal</p>
            <p className="text-[10px] text-slate-500 italic">Signature et date</p>
          </div>
          <div className="border border-slate-400 p-3 h-28 flex flex-col justify-between bg-slate-50/50">
            <p className="font-extrabold">Le Directeur d'Établissement</p>
            <p className="text-[10px] text-slate-500 italic">Signature et Cachet Officiel</p>
          </div>
        </div>
      </div>
    );
  }

  // Official Section 13 Paired Mode: For each student, French immediately followed by Arabic!
  if (scope === 'official_paired') {
    return (
      <div className="hidden print:block print-container">
        {results.map((r, idx) => (
          <React.Fragment key={r.student.id}>
            {/* French Bulletin */}
            <div className="print-page-break">
              <BulletinFrench result={r} statistics={statistics} config={config} />
            </div>

            {/* Arabic Bulletin immediately following */}
            <div className={idx < results.length - 1 ? 'print-page-break' : ''}>
              <BulletinArabic result={r} statistics={statistics} config={config} />
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  // All French
  if (scope === 'all_french') {
    return (
      <div className="hidden print:block print-container">
        {results.map((r, idx) => (
          <div key={r.student.id} className={idx < results.length - 1 ? 'print-page-break' : ''}>
            <BulletinFrench result={r} statistics={statistics} config={config} />
          </div>
        ))}
      </div>
    );
  }

  // All Arabic
  if (scope === 'all_arabic') {
    return (
      <div className="hidden print:block print-container">
        {results.map((r, idx) => (
          <div key={r.student.id} className={idx < results.length - 1 ? 'print-page-break' : ''}>
            <BulletinArabic result={r} statistics={statistics} config={config} />
          </div>
        ))}
      </div>
    );
  }

  return null;
};
