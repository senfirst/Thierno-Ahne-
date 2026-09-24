import React, { useState } from 'react';
import { Student, Subject, SchoolConfig, SubjectGrade } from '../types';
import { UserCheck, Trash2, Plus, ArrowRight, UserPlus, Sparkles } from 'lucide-react';
import { round2, getAppreciationForGrade } from '../utils/calculations';

interface GradeEditorProps {
  students: Student[];
  subjects: Subject[];
  config: SchoolConfig;
  onUpdateStudent: (student: Student) => void;
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onSelectStudentForBulletin: (studentId: string) => void;
}

export const GradeEditor: React.FC<GradeEditorProps> = ({
  students,
  subjects,
  config,
  onUpdateStudent,
  onAddStudent,
  onDeleteStudent,
  onSelectStudentForBulletin,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [viewMode, setViewMode] = useState<'by_student' | 'by_subject'>('by_student');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const handleGradeChange = (
    studentId: string,
    subjectId: string,
    field: 'devoir1' | 'devoir2' | 'composition',
    valStr: string
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    let parsedVal: number | null = null;
    if (valStr.trim() !== '') {
      const parsed = parseFloat(valStr.replace(',', '.'));
      if (!isNaN(parsed)) {
        parsedVal = round2(parsed);
      }
    }

    const currentGrade = student.grades[subjectId] || {
      subjectId,
      devoir1: null,
      devoir2: null,
      composition: null,
    };

    const updatedGrade: SubjectGrade = {
      ...currentGrade,
      [field]: parsedVal,
    };

    const updatedStudent: Student = {
      ...student,
      grades: {
        ...student.grades,
        [subjectId]: updatedGrade,
      },
    };

    onUpdateStudent(updatedStudent);
  };

  const handleIdentityChange = (
    field: keyof Student,
    value: any
  ) => {
    if (!activeStudent) return;
    onUpdateStudent({
      ...activeStudent,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Saisie et Gestion des Notes & Élèves
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Moyenne devoirs = (D1 + D2)/2 · Moyenne matière = (Moyenne devoirs + Compo)/2 · Barème officiel sur 20
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded text-xs">
            <button
              onClick={() => setViewMode('by_student')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                viewMode === 'by_student' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Fiche par Élève
            </button>
            <button
              onClick={() => setViewMode('by_subject')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                viewMode === 'by_subject' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Grille par Matière
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'by_student' && activeStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Column: Student Selector list */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Liste des Élèves ({students.length})
              </span>
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto text-xs">
              {students.map((st, idx) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStudentId(st.id)}
                  className={`w-full p-2.5 text-left transition-colors flex items-center justify-between ${
                    selectedStudentId === st.id ? 'bg-emerald-50 text-emerald-950 font-bold border-l-4 border-emerald-700' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <p className="truncate max-w-[150px]">
                      {st.nom} {st.prenom}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono font-normal">
                      {st.matricule}
                    </p>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">#{idx + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Columns: Active Student Details & Grade Entry */}
          <div className="lg:col-span-3 space-y-4">
            {/* Student Info Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                    {activeStudent.sexe}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {activeStudent.nom} {activeStudent.prenom}
                    </h3>
                    <p className="text-xs text-slate-500 font-arabic">
                      {activeStudent.nomAr ? `${activeStudent.nomAr} ${activeStudent.prenomAr || ''}` : ''} · {activeStudent.matricule}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectStudentForBulletin(activeStudent.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                  >
                    <span>Voir les 2 Bulletins</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Editable Identity & Discipline Fields */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nom de famille</label>
                  <input
                    type="text"
                    value={activeStudent.nom}
                    onChange={(e) => handleIdentityChange('nom', e.target.value)}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Prénom(s)</label>
                  <input
                    type="text"
                    value={activeStudent.prenom}
                    onChange={(e) => handleIdentityChange('prenom', e.target.value)}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 font-arabic">اللقب (بالعربية)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={activeStudent.nomAr || ''}
                    onChange={(e) => handleIdentityChange('nomAr', e.target.value)}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded font-arabic focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 font-arabic">الاسم (بالعربية)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={activeStudent.prenomAr || ''}
                    onChange={(e) => handleIdentityChange('prenomAr', e.target.value)}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded font-arabic focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    value={activeStudent.dateNaissance}
                    onChange={(e) => handleIdentityChange('dateNaissance', e.target.value)}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Lieu de naissance</label>
                  <input
                    type="text"
                    value={activeStudent.lieuNaissance}
                    onChange={(e) => handleIdentityChange('lieuNaissance', e.target.value)}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sexe</label>
                  <select
                    value={activeStudent.sexe}
                    onChange={(e) => handleIdentityChange('sexe', e.target.value)}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="M">Masculin (M)</option>
                    <option value="F">Féminin (F)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Conduite</label>
                  <select
                    value={activeStudent.conduite}
                    onChange={(e) => {
                      const val = e.target.value;
                      let arVal = 'جيدة';
                      if (val === 'Excellente') arVal = 'ممتازة';
                      if (val === 'Très bonne') arVal = 'جيدة جداً';
                      if (val === 'Passable') arVal = 'مقبول';
                      if (val === 'À améliorer') arVal = 'يحتاج إلى تحسين';
                      onUpdateStudent({
                        ...activeStudent,
                        conduite: val,
                        conduiteAr: arVal,
                      });
                    }}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="Excellente">Excellente</option>
                    <option value="Très bonne">Très bonne</option>
                    <option value="Bonne">Bonne</option>
                    <option value="Passable">Passable</option>
                    <option value="À améliorer">À améliorer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Absences justifiées</label>
                  <input
                    type="number"
                    min="0"
                    value={activeStudent.absencesJustifiees}
                    onChange={(e) => handleIdentityChange('absencesJustifiees', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded font-tabular"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Absences non justifiées</label>
                  <input
                    type="number"
                    min="0"
                    value={activeStudent.absencesNonJustifiees}
                    onChange={(e) => handleIdentityChange('absencesNonJustifiees', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded font-tabular"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Retards</label>
                  <input
                    type="number"
                    min="0"
                    value={activeStudent.retards}
                    onChange={(e) => handleIdentityChange('retards', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded font-tabular"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      if (window.confirm(`Confirmez-vous la suppression de l'élève ${activeStudent.nom} ${activeStudent.prenom} ?`)) {
                        onDeleteStudent(activeStudent.id);
                      }
                    }}
                    className="w-full py-1 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer élève</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Grades Table for Active Student */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
              <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Notes par Matière pour {activeStudent.nom} {activeStudent.prenom}
                </span>
                <span className="text-[11px] text-slate-500">
                  Notes sur 20 · Vide = Non renseignée
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold text-[11px] border-b border-slate-200 uppercase">
                      <th className="py-2 px-3">Matière</th>
                      <th className="py-2 px-2 text-center w-14">Coef</th>
                      <th className="py-2 px-3 text-center w-28">Devoir 1</th>
                      <th className="py-2 px-3 text-center w-28">Devoir 2</th>
                      <th className="py-2 px-3 text-center w-28">Composition</th>
                      <th className="py-2 px-3 text-center w-24 bg-slate-200/50">Moy. Devoirs</th>
                      <th className="py-2 px-3 text-center w-24 bg-slate-200/50">Moyenne /20</th>
                      <th className="py-2 px-3">Appréciation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subjects.map((subj) => {
                      const grade = activeStudent.grades[subj.id] || {
                        subjectId: subj.id,
                        devoir1: null,
                        devoir2: null,
                        composition: null,
                      };

                      const d1 = grade.devoir1;
                      const d2 = grade.devoir2;
                      const compo = grade.composition;

                      let moyDev: number | null = null;
                      if (d1 !== null && d2 !== null) moyDev = round2((d1 + d2) / 2);
                      else if (d1 !== null) moyDev = d1;
                      else if (d2 !== null) moyDev = d2;

                      let moyMat: number | null = null;
                      if (moyDev !== null && compo !== null) {
                        moyMat = round2((moyDev + compo) / 2);
                      }

                      const app = getAppreciationForGrade(moyMat);

                      return (
                        <tr key={subj.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900 block">{subj.nameFr}</span>
                            <span className="text-[11px] text-slate-500 font-arabic">{subj.nameAr}</span>
                          </td>
                          <td className="py-2.5 px-2 text-center font-tabular font-bold text-slate-700">
                            {subj.coefficient}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              max="20"
                              value={d1 !== null ? d1 : ''}
                              onChange={(e) => handleGradeChange(activeStudent.id, subj.id, 'devoir1', e.target.value)}
                              placeholder="-"
                              className="w-20 text-center py-1 px-1 bg-slate-50 border border-slate-300 rounded font-tabular text-xs focus:bg-white focus:ring-1 focus:ring-emerald-700"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              max="20"
                              value={d2 !== null ? d2 : ''}
                              onChange={(e) => handleGradeChange(activeStudent.id, subj.id, 'devoir2', e.target.value)}
                              placeholder="-"
                              className="w-20 text-center py-1 px-1 bg-slate-50 border border-slate-300 rounded font-tabular text-xs focus:bg-white focus:ring-1 focus:ring-emerald-700"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              max="20"
                              value={compo !== null ? compo : ''}
                              onChange={(e) => handleGradeChange(activeStudent.id, subj.id, 'composition', e.target.value)}
                              placeholder="-"
                              className="w-20 text-center py-1 px-1 bg-slate-50 border border-slate-300 rounded font-tabular text-xs font-semibold focus:bg-white focus:ring-1 focus:ring-emerald-700"
                            />
                          </td>
                          <td className="py-2.5 px-2 text-center font-tabular text-slate-700 bg-slate-50/50">
                            {moyDev !== null ? moyDev.toFixed(2) : '-'}
                          </td>
                          <td className="py-2.5 px-2 text-center font-tabular font-bold text-slate-950 bg-slate-100">
                            {moyMat !== null ? moyMat.toFixed(2) : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 text-[11px]">
                            {app.fr}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'by_subject' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          {/* Subject Switcher */}
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase">Choisir la Matière :</span>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="bg-white border border-slate-300 rounded px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nameFr} (Coef {s.coefficient}) - {s.nameAr}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Saisie directe en série pour toute la classe ({students.length} élèves)
            </span>
          </div>

          {/* Whole Class Subject Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold text-[11px] border-b border-slate-200 uppercase">
                  <th className="py-2.5 px-3 w-12 text-center">N°</th>
                  <th className="py-2.5 px-3 w-28">Matricule</th>
                  <th className="py-2.5 px-3">Nom & Prénom</th>
                  <th className="py-2.5 px-3 text-center w-28">Devoir 1</th>
                  <th className="py-2.5 px-3 text-center w-28">Devoir 2</th>
                  <th className="py-2.5 px-3 text-center w-28">Composition</th>
                  <th className="py-2.5 px-3 text-center w-24 bg-slate-200/50">Moy. Matière</th>
                  <th className="py-2.5 px-3 text-center w-24">Appréciation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st, idx) => {
                  const grade = st.grades[selectedSubjectId] || {
                    subjectId: selectedSubjectId,
                    devoir1: null,
                    devoir2: null,
                    composition: null,
                  };

                  const d1 = grade.devoir1;
                  const d2 = grade.devoir2;
                  const compo = grade.composition;

                  let moyDev: number | null = null;
                  if (d1 !== null && d2 !== null) moyDev = round2((d1 + d2) / 2);
                  else if (d1 !== null) moyDev = d1;
                  else if (d2 !== null) moyDev = d2;

                  let moyMat: number | null = null;
                  if (moyDev !== null && compo !== null) {
                    moyMat = round2((moyDev + compo) / 2);
                  }

                  const app = getAppreciationForGrade(moyMat);

                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-600">{st.matricule}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{st.nom} {st.prenom}</td>
                      <td className="py-1.5 px-2 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={d1 !== null ? d1 : ''}
                          onChange={(e) => handleGradeChange(st.id, selectedSubjectId, 'devoir1', e.target.value)}
                          placeholder="-"
                          className="w-20 text-center py-1 px-1 bg-slate-50 border border-slate-300 rounded font-tabular text-xs"
                        />
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={d2 !== null ? d2 : ''}
                          onChange={(e) => handleGradeChange(st.id, selectedSubjectId, 'devoir2', e.target.value)}
                          placeholder="-"
                          className="w-20 text-center py-1 px-1 bg-slate-50 border border-slate-300 rounded font-tabular text-xs"
                        />
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={compo !== null ? compo : ''}
                          onChange={(e) => handleGradeChange(st.id, selectedSubjectId, 'composition', e.target.value)}
                          placeholder="-"
                          className="w-20 text-center py-1 px-1 bg-slate-50 border border-slate-300 rounded font-tabular text-xs font-semibold"
                        />
                      </td>
                      <td className="py-2 px-2 text-center font-tabular font-bold text-slate-950 bg-slate-100">
                        {moyMat !== null ? moyMat.toFixed(2) : '-'}
                      </td>
                      <td className="py-2 px-3 text-center text-[11px] text-slate-700">
                        {app.fr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
