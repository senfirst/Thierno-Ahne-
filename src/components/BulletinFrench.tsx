import React from 'react';
import { CalculatedStudentResults, ClassStatistics, SchoolConfig } from '../types';
import { OfficialEmblem } from './OfficialEmblem';
import { formatGrade } from '../utils/calculations';

interface BulletinFrenchProps {
  result: CalculatedStudentResults;
  statistics: ClassStatistics;
  config: SchoolConfig;
  className?: string;
}

export const BulletinFrench: React.FC<BulletinFrenchProps> = ({
  result,
  statistics,
  config,
  className = '',
}) => {
  const { student, calculatedSubjects, totalPoints, totalCoefficients, moyenneGenerale, rangTextFr } = result;

  return (
    <div
      className={`bulletin-sheet bg-white text-slate-900 border border-slate-300 rounded-sm p-6 sm:p-7 shadow-sm max-w-[800px] mx-auto text-xs leading-tight print:p-5 print:border-slate-800 ${className}`}
    >
      {/* Official Top Header */}
      <div className="border-b-2 border-slate-900 pb-3 mb-3">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Republic & Motto */}
          <div className="text-left w-1/3">
            <p className="font-extrabold text-[11px] tracking-wider text-slate-900 uppercase">
              {config.republiqueFr}
            </p>
            <p className="text-[10px] italic text-slate-600 font-medium">
              {config.deviseNationaleFr}
            </p>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">
              Ministère de l'Éducation Nationale
            </p>
          </div>

          {/* Center: School Emblem & Official Name */}
          <div className="text-center w-1/3 flex flex-col items-center">
            <OfficialEmblem size={44} className="mb-1" />
            <h1 className="font-black text-sm tracking-tight text-slate-950 uppercase leading-snug">
              {config.nomEtablissement}
            </h1>
            <div className="inline-block mt-1 px-3 py-0.5 border border-slate-900 font-extrabold text-[11px] tracking-widest uppercase bg-slate-50">
              BULLETIN SCOLAIRE
            </div>
          </div>

          {/* Right: Academic Period */}
          <div className="text-right w-1/3 space-y-0.5 text-[10px]">
            <p>
              <span className="text-slate-500">Année scolaire :</span>{' '}
              <span className="font-bold text-slate-900 font-tabular">{config.anneeScolaire}</span>
            </p>
            <p>
              <span className="text-slate-500">Période :</span>{' '}
              <span className="font-bold text-slate-900">{config.trimestre}</span>
            </p>
            <p>
              <span className="text-slate-500">Classe :</span>{' '}
              <span className="font-bold text-slate-900">{config.classe}</span>
            </p>
            <p>
              <span className="text-slate-500">Effectif :</span>{' '}
              <span className="font-bold text-slate-900 font-tabular">{statistics.effectifTotal} élèves</span>
            </p>
          </div>
        </div>
      </div>

      {/* Student Identity Card */}
      <div className="bg-slate-50 border border-slate-300 rounded p-2.5 mb-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
        <div>
          <span className="text-slate-500 block text-[9.5px] uppercase tracking-wider">Nom & Prénom</span>
          <span className="font-bold text-slate-900 text-xs uppercase">
            {student.nom} {student.prenom}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[9.5px] uppercase tracking-wider">Date & Lieu de Naissance</span>
          <span className="font-semibold text-slate-800">
            {student.dateNaissance || 'Non renseigné'} à {student.lieuNaissance || 'Non renseigné'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[9.5px] uppercase tracking-wider">Sexe / Matricule</span>
          <span className="font-semibold text-slate-800">
            {student.sexe === 'M' ? 'Masculin (M)' : 'Féminin (F)'} · {student.matricule}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[9.5px] uppercase tracking-wider">Classe / Effectif</span>
          <span className="font-semibold text-slate-800">
            {config.classe} ({statistics.effectifTotal} élèves)
          </span>
        </div>
      </div>

      {/* Table of Results */}
      <div className="overflow-x-auto mb-3">
        <table className="w-full border-collapse border border-slate-300 text-[10px]">
          <thead>
            <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 uppercase tracking-tight text-[9px] font-bold">
              <th className="border border-slate-300 px-2 py-1.5 text-left">Matière</th>
              <th className="border border-slate-300 px-1.5 py-1.5 text-center w-10">Coef.</th>
              <th className="border border-slate-300 px-1.5 py-1.5 text-center w-14">Devoir 1</th>
              <th className="border border-slate-300 px-1.5 py-1.5 text-center w-14">Devoir 2</th>
              <th className="border border-slate-300 px-1.5 py-1.5 text-center w-16">Composition</th>
              <th className="border border-slate-300 px-1.5 py-1.5 text-center w-14 bg-slate-200/60 font-black">
                Moyenne
              </th>
              <th className="border border-slate-300 px-1.5 py-1.5 text-center w-16 bg-slate-200/60 font-black">
                Moy. × Coef.
              </th>
              <th className="border border-slate-300 px-2 py-1.5 text-left min-w-[130px]">Appréciation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {calculatedSubjects.map(item => (
              <tr key={item.subject.id} className="hover:bg-slate-50/50">
                <td className="border border-slate-300 px-2 py-1 font-semibold text-slate-900">
                  {item.subject.nameFr}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 text-center font-tabular font-medium text-slate-700">
                  {item.subject.coefficient}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 text-center font-tabular text-slate-700">
                  {item.devoir1 !== null ? formatGrade(item.devoir1) : <span className="text-slate-400 italic">Non renseig.</span>}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 text-center font-tabular text-slate-700">
                  {item.devoir2 !== null ? formatGrade(item.devoir2) : <span className="text-slate-400 italic">Non renseig.</span>}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 text-center font-tabular font-medium text-slate-800">
                  {item.composition !== null ? formatGrade(item.composition) : <span className="text-slate-400 italic">Non renseig.</span>}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 text-center font-tabular font-bold text-slate-950 bg-slate-50">
                  {item.moyenneMatiere !== null ? formatGrade(item.moyenneMatiere) : '-'}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 text-center font-tabular font-bold text-slate-950 bg-slate-50">
                  {item.pointsPonderes !== null ? formatGrade(item.pointsPonderes) : '-'}
                </td>
                <td className="border border-slate-300 px-2 py-1 text-slate-700 text-[9.5px]">
                  {item.appreciationFr}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold border-t-2 border-slate-400 text-slate-900">
              <td className="border border-slate-300 px-2 py-1.5 uppercase text-[9.5px]">
                Totaux
              </td>
              <td className="border border-slate-300 px-1.5 py-1.5 text-center font-tabular">
                {totalCoefficients}
              </td>
              <td colSpan={4} className="border border-slate-300 px-2 py-1.5 text-right uppercase text-[9.5px] text-slate-600">
                Total des points pondérés :
              </td>
              <td className="border border-slate-300 px-1.5 py-1.5 text-center font-tabular text-xs font-black text-slate-950 bg-slate-200">
                {formatGrade(totalPoints)}
              </td>
              <td className="border border-slate-300 px-2 py-1.5 text-slate-500 italic text-[9px]">
                Barème officiel / 20
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* General Results & Class Stats Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Results of the student */}
        <div className="border border-slate-300 rounded p-2.5 bg-slate-50/60">
          <p className="font-extrabold uppercase text-[9.5px] tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
            Résultats Généraux de l'Élève
          </p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10.5px]">
            <div>
              <span className="text-slate-500 block text-[9px]">Total des points :</span>
              <span className="font-bold font-tabular text-slate-900">{formatGrade(totalPoints)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">Total des coefficients :</span>
              <span className="font-bold font-tabular text-slate-900">{totalCoefficients}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-600 block text-[9px] uppercase font-bold">Moyenne Générale :</span>
                <span className="text-base font-black font-tabular text-slate-950">
                  {formatGrade(moyenneGenerale)} <span className="text-xs font-normal text-slate-500">/ 20</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-600 block text-[9px] uppercase font-bold">Rang :</span>
                <span className="text-base font-black text-emerald-900">
                  {rangTextFr} <span className="text-xs font-normal text-slate-500">/ {statistics.effectifTotal}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Class Statistics */}
        <div className="border border-slate-300 rounded p-2.5 bg-slate-50/60">
          <p className="font-extrabold uppercase text-[9.5px] tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
            Statistiques de la Classe
          </p>
          <div className="grid grid-cols-3 gap-2 text-[10.5px]">
            <div>
              <span className="text-slate-500 block text-[9px]">Moyenne Classe :</span>
              <span className="font-bold font-tabular text-slate-900">{formatGrade(statistics.moyenneClasse)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">Plus Forte Moy. :</span>
              <span className="font-bold font-tabular text-emerald-800">{formatGrade(statistics.plusForteMoyenne)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">Plus Faible Moy. :</span>
              <span className="font-bold font-tabular text-amber-800">{formatGrade(statistics.plusFaibleMoyenne)}</span>
            </div>
          </div>
          {/* Assiduité et discipline */}
          <div className="mt-2.5 pt-1.5 border-t border-slate-200">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Assiduité et Discipline
            </p>
            <div className="grid grid-cols-4 gap-1 text-[10px]">
              <div>
                <span className="text-slate-500 block text-[8.5px]">Abs. justifiées :</span>
                <span className="font-semibold font-tabular text-slate-800">{student.absencesJustifiees}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[8.5px]">Abs. non justifiées :</span>
                <span className={`font-semibold font-tabular ${student.absencesNonJustifiees > 2 ? 'text-rose-700 font-bold' : 'text-slate-800'}`}>
                  {student.absencesNonJustifiees}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[8.5px]">Retards :</span>
                <span className="font-semibold font-tabular text-slate-800">{student.retards}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[8.5px]">Conduite :</span>
                <span className="font-semibold text-slate-800">{student.conduite || 'Bonne'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Class Council Appréciation & Mentions */}
      <div className="border border-slate-300 rounded p-2.5 bg-white mb-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1.5">
          <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-900">
            Avis et Délibérations du Conseil de Classe
          </span>
          <div className="text-[10.5px]">
            <span className="text-slate-500">Mention : </span>
            <span className="font-extrabold text-slate-950 underline decoration-emerald-600 decoration-2">
              {result.mentionFr}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-800 leading-relaxed italic">
          "{result.appreciationConseilFr}"
        </p>
      </div>

      {/* Signatures & Seal Section */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-300 text-center text-[10px]">
        {/* Parent signature */}
        <div className="border border-dashed border-slate-300 rounded p-2 h-24 flex flex-col justify-between">
          <p className="font-bold text-slate-800">Le Parent / Tuteur</p>
          <p className="text-[9px] text-slate-400 italic">Signature</p>
        </div>

        {/* Main teacher */}
        <div className="border border-dashed border-slate-300 rounded p-2 h-24 flex flex-col justify-between">
          <div>
            <p className="font-bold text-slate-800">Le Professeur Principal</p>
            <p className="text-[9px] text-slate-500">{config.nomProfesseurPrincipal}</p>
          </div>
          <p className="text-[9px] text-slate-400 italic">Signature</p>
        </div>

        {/* Director with stamp */}
        <div className="border border-slate-400 rounded p-2 h-24 flex flex-col justify-between bg-slate-50/40 relative">
          <div>
            <p className="font-extrabold text-slate-900">Le Directeur</p>
            <p className="text-[9px] text-slate-600">{config.nomDirecteur}</p>
          </div>

          {/* Stamp mockup */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-800 flex items-center justify-center rotate-[-12deg] text-emerald-900 text-[8px] font-black uppercase text-center leading-tight p-1">
              DIRECTION<br />ALMAARIFA<br />SÉNÉGAL
            </div>
          </div>

          <p className="text-[9px] text-slate-500 italic">Signature et cachet</p>
        </div>
      </div>
    </div>
  );
};
