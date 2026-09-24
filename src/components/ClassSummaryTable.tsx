import React, { useState } from 'react';
import { CalculatedStudentResults, ClassStatistics, SchoolConfig } from '../types';
import { Search, Printer, Download, Eye, Award, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { formatGrade } from '../utils/calculations';

interface ClassSummaryTableProps {
  results: CalculatedStudentResults[];
  statistics: ClassStatistics;
  config: SchoolConfig;
  onSelectStudent: (studentId: string) => void;
  onPrintPalmares: () => void;
}

export const ClassSummaryTable: React.FC<ClassSummaryTableProps> = ({
  results,
  statistics,
  config,
  onSelectStudent,
  onPrintPalmares,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'admitted' | 'at_risk' | 'honors'>('all');

  const filteredResults = results.filter((r) => {
    const fullName = `${r.student.nom} ${r.student.prenom}`.toLowerCase();
    const matricule = r.student.matricule.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || matricule.includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'admitted') {
      return (r.moyenneGenerale ?? 0) >= 10;
    }
    if (filterType === 'at_risk') {
      return (r.moyenneGenerale ?? 0) < 10;
    }
    if (filterType === 'honors') {
      return (r.moyenneGenerale ?? 0) >= 14;
    }
    return true;
  });

  const exportToCsv = () => {
    const headers = [
      'Rang',
      'Matricule',
      'Nom',
      'Prénom',
      'Sexe',
      'Moyenne Générale',
      'Total Points',
      'Mention',
      'Absences Justifiées',
      'Absences Non Justifiées',
      'Retards',
      'Conduite'
    ];

    const rows = results.map((r) => [
      `"${r.rangTextFr}"`,
      `"${r.student.matricule}"`,
      `"${r.student.nom}"`,
      `"${r.student.prenom}"`,
      `"${r.student.sexe}"`,
      r.moyenneGenerale !== null ? r.moyenneGenerale.toFixed(2) : '',
      r.totalPoints.toFixed(2),
      `"${r.mentionFr}"`,
      r.student.absencesJustifiees,
      r.student.absencesNonJustifiees,
      r.student.retards,
      `"${r.student.conduite}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Palmares_${config.classe.replace(/\s+/g, '_')}_${config.trimestre.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Key Metric Deck */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Effectif Total
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 font-tabular">{statistics.effectifTotal}</span>
            <span className="text-xs text-slate-500 font-medium">
              ({statistics.effectifGarcons}G · {statistics.effectifFilles}F)
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Moyenne Classe
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-tabular">{formatGrade(statistics.moyenneClasse)}</span>
            <span className="text-xs text-slate-400">/ 20</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Plus Forte Moy.
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-700 font-tabular">{formatGrade(statistics.plusForteMoyenne)}</span>
            <span className="text-xs text-slate-400">/ 20</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Plus Faible Moy.
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-amber-700 font-tabular">{formatGrade(statistics.plusFaibleMoyenne)}</span>
            <span className="text-xs text-slate-400">/ 20</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Taux de Réussite
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-tabular">{statistics.tauxReussite}%</span>
            <span className="text-xs text-slate-500">(≥ 10/20)</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Distinctions
          </span>
          <div className="mt-1 text-xs space-y-0.5">
            <p className="text-emerald-800 font-bold">{statistics.nbFelicitations} Félicitations</p>
            <p className="text-slate-600 font-medium">{statistics.nbTableauHonneur} Tab. d'honneur</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        {/* Table header bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Tableau Récapitulatif de la Classe (Ordre de Mérite)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {config.nomEtablissement} · {config.classe} · {config.trimestre} · {config.anneeScolaire}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher élève..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            {/* Segmented Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterType === 'all' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Tous ({results.length})
              </button>
              <button
                onClick={() => setFilterType('admitted')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterType === 'admitted' ? 'bg-white font-semibold text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Moy. ≥ 10
              </button>
              <button
                onClick={() => setFilterType('honors')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterType === 'honors' ? 'bg-white font-semibold text-amber-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Distinctions
              </button>
              <button
                onClick={() => setFilterType('at_risk')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterType === 'at_risk' ? 'bg-white font-semibold text-rose-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Moy. &lt; 10
              </button>
            </div>

            {/* Actions */}
            <button
              onClick={exportToCsv}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-xs transition-colors"
              title="Exporter vers Excel / CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>CSV</span>
            </button>
            <button
              onClick={onPrintPalmares}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer PV</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3 w-16 text-center">Rang</th>
                <th className="py-2.5 px-3 w-28">Matricule</th>
                <th className="py-2.5 px-3">Nom & Prénom</th>
                <th className="py-2.5 px-3 w-14 text-center">Sexe</th>
                <th className="py-2.5 px-3 w-28 text-right">Points Pond.</th>
                <th className="py-2.5 px-3 w-28 text-right font-bold text-slate-900">Moyenne</th>
                <th className="py-2.5 px-3">Mention du Conseil</th>
                <th className="py-2.5 px-3 w-24 text-center">Assiduité</th>
                <th className="py-2.5 px-3 w-24 text-center">Conduite</th>
                <th className="py-2.5 px-3 w-24 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500">
                    Aucun élève trouvé avec les filtres sélectionnés.
                  </td>
                </tr>
              ) : (
                filteredResults.map((r) => {
                  const isTop3 = r.rang <= 3;
                  const isPass = (r.moyenneGenerale ?? 0) >= 10;

                  return (
                    <tr
                      key={r.student.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => onSelectStudent(r.student.id)}
                    >
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`font-tabular font-bold inline-block px-1.5 py-0.5 rounded text-xs ${
                            isTop3
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'text-slate-800'
                          }`}
                        >
                          {r.rangTextFr}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                        {r.student.matricule}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-950">
                          {r.student.nom} {r.student.prenom}
                        </div>
                        <div className="text-[10px] text-slate-500 font-arabic">
                          {r.student.nomAr ? `${r.student.nomAr} ${r.student.prenomAr || ''}` : ''}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium text-slate-700">
                        {r.student.sexe}
                      </td>
                      <td className="py-2.5 px-3 text-right font-tabular text-slate-700">
                        {formatGrade(r.totalPoints)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`font-tabular font-bold text-sm ${
                            isPass ? 'text-slate-900' : 'text-rose-700'
                          }`}
                        >
                          {formatGrade(r.moyenneGenerale)}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-0.5">/20</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[11px] font-semibold ${
                            r.mentionFr === 'Félicitations'
                              ? 'text-emerald-800'
                              : r.mentionFr === "Tableau d'honneur"
                              ? 'text-blue-800'
                              : r.mentionFr === 'Encouragements'
                              ? 'text-teal-800'
                              : r.mentionFr.includes('Avertissement')
                              ? 'text-rose-700'
                              : 'text-slate-700'
                          }`}
                        >
                          {r.mentionFr}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-[11px] text-slate-600 font-tabular">
                        {r.student.absencesNonJustifiees > 0 ? (
                          <span className="text-amber-800 font-bold" title="Absences non justifiées">
                            {r.student.absencesNonJustifiees} NJ
                          </span>
                        ) : (
                          <span className="text-slate-400">0 NJ</span>
                        )}
                        {r.student.retards > 0 && (
                          <span className="text-slate-500 text-[10px] ml-1">({r.student.retards} ret.)</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center text-[11px] text-slate-700">
                        {r.student.conduite}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStudent(r.student.id);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Bulletins</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Affichage de <span className="font-bold text-slate-800">{filteredResults.length}</span> sur{' '}
            <span className="font-bold text-slate-800">{results.length}</span> élèves
          </span>
          <span className="italic">
            Règle officielle : 1 élève = 2 bulletins (1 Français + 1 Arabe) · Total classe : {results.length * 2} bulletins
          </span>
        </div>
      </div>
    </div>
  );
};
