import React, { useState } from 'react';
import { SchoolConfig, Subject } from '../types';
import { Settings, Plus, Trash2, Check, RotateCcw } from 'lucide-react';

interface ConfigModalProps {
  config: SchoolConfig;
  subjects: Subject[];
  onSaveConfig: (config: SchoolConfig) => void;
  onSaveSubjects: (subjects: Subject[]) => void;
  onResetDefaultData: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  config,
  subjects,
  onSaveConfig,
  onSaveSubjects,
  onResetDefaultData,
}) => {
  const [formData, setFormData] = useState<SchoolConfig>({ ...config });
  const [subjectList, setSubjectList] = useState<Subject[]>([...subjects]);
  const [newSubjFr, setNewSubjFr] = useState('');
  const [newSubjAr, setNewSubjAr] = useState('');
  const [newSubjCoef, setNewSubjCoef] = useState('2');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubjectCoefChange = (id: string, coef: number) => {
    setSubjectList(prev => prev.map(s => (s.id === id ? { ...s, coefficient: coef } : s)));
  };

  const handleDeleteSubject = (id: string) => {
    if (subjectList.length <= 1) {
      alert('Vous devez conserver au moins une matière.');
      return;
    }
    setSubjectList(prev => prev.filter(s => s.id !== id));
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjFr.trim()) return;

    const newId = `sub_${Date.now()}`;
    const newSubject: Subject = {
      id: newId,
      nameFr: newSubjFr.trim(),
      nameAr: newSubjAr.trim() || newSubjFr.trim(),
      coefficient: Math.max(1, parseInt(newSubjCoef) || 1),
    };

    setSubjectList(prev => [...prev, newSubject]);
    setNewSubjFr('');
    setNewSubjAr('');
    setNewSubjCoef('2');
  };

  const handleSaveAll = () => {
    onSaveConfig(formData);
    onSaveSubjects(subjectList);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const totalCoef = subjectList.reduce((acc, s) => acc + s.coefficient, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Paramètres de l'Établissement & Coefficients
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configurez les intitulés officiels, l'année scolaire, le trimestre en cours et la liste des matières.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm("Voulez-vous recharger la classe témoin officielle (30 élèves du Sénégal avec notes complètes) ?")) {
                onResetDefaultData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recharger données démo (30 élèves)</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded shadow-xs transition-colors"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{savedSuccess ? 'Enregistré !' : 'Enregistrer les modifications'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School details */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2">
            Informations Officielles de l'Établissement
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nom de l'établissement (Français)
              </label>
              <input
                type="text"
                value={formData.nomEtablissement}
                onChange={(e) => setFormData({ ...formData, nomEtablissement: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1 font-arabic">
                اسم المؤسسة (بالعربية)
              </label>
              <input
                type="text"
                dir="rtl"
                value={formData.nomEtablissementAr}
                onChange={(e) => setFormData({ ...formData, nomEtablissementAr: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-arabic font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Année scolaire
                </label>
                <input
                  type="text"
                  value={formData.anneeScolaire}
                  onChange={(e) => setFormData({ ...formData, anneeScolaire: e.target.value })}
                  placeholder="2026-2027"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-tabular focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Période / Trimestre
                </label>
                <select
                  value={formData.trimestre}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    let ar = 'الثلاثي الأول';
                    if (val === '2e trimestre') ar = 'الثلاثي الثاني';
                    if (val === '3e trimestre') ar = 'الثلاثي الثالث';
                    setFormData({ ...formData, trimestre: val, trimestreAr: ar });
                  }}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="1er trimestre">1er trimestre</option>
                  <option value="2e trimestre">2e trimestre</option>
                  <option value="3e trimestre">3e trimestre</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Classe (Français)
                </label>
                <input
                  type="text"
                  value={formData.classe}
                  onChange={(e) => setFormData({ ...formData, classe: e.target.value })}
                  placeholder="ex: CM2 A / 6e A / 3e B"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 font-arabic">
                  القسم (بالعربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.classeAr}
                  onChange={(e) => setFormData({ ...formData, classeAr: e.target.value })}
                  placeholder="القسم الخامس أ"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-arabic focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nom du Directeur (pour signature)
                </label>
                <input
                  type="text"
                  value={formData.nomDirecteur}
                  onChange={(e) => setFormData({ ...formData, nomDirecteur: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Professeur Principal (pour signature)
                </label>
                <input
                  type="text"
                  value={formData.nomProfesseurPrincipal}
                  onChange={(e) => setFormData({ ...formData, nomProfesseurPrincipal: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Subjects & Coefficients */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Matières et Coefficients
            </h3>
            <span className="text-xs font-semibold text-slate-700">
              Total Coefficients : <span className="font-tabular font-black text-emerald-800">{totalCoef}</span>
            </span>
          </div>

          {/* Subjects Table */}
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-[11px] uppercase font-semibold border-b border-slate-200">
                  <th className="py-2 px-3 text-left">Matière (FR / AR)</th>
                  <th className="py-2 px-3 text-center w-24">Coefficient</th>
                  <th className="py-2 px-2 text-center w-12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjectList.map((subj) => (
                  <tr key={subj.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3">
                      <div className="font-semibold text-slate-900">{subj.nameFr}</div>
                      <div className="text-[11px] text-slate-500 font-arabic">{subj.nameAr}</div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={subj.coefficient}
                        onChange={(e) => handleSubjectCoefChange(subj.id, parseInt(e.target.value) || 1)}
                        className="w-16 py-1 px-2 text-center bg-slate-50 border border-slate-300 rounded font-tabular font-bold text-slate-900"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleDeleteSubject(subj.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Supprimer cette matière"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Subject Subform */}
          <form onSubmit={handleAddSubject} className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
              + Ajouter une nouvelle matière
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Intitulé français..."
                value={newSubjFr}
                onChange={(e) => setNewSubjFr(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
              <input
                type="text"
                dir="rtl"
                placeholder="الاسم بالعربية..."
                value={newSubjAr}
                onChange={(e) => setNewSubjAr(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-arabic focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Coef."
                  value={newSubjCoef}
                  onChange={(e) => setNewSubjCoef(e.target.value)}
                  className="w-16 px-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-tabular text-center"
                />
                <button
                  type="submit"
                  className="flex-1 py-1.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded text-xs transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
