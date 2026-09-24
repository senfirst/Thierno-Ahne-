import React, { useState } from 'react';
import { Student, Gender, Subject } from '../types';
import { X, UserPlus } from 'lucide-react';

interface NewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onAddStudent: (student: Student) => void;
  nextNumber: number;
}

export const NewStudentModal: React.FC<NewStudentModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onAddStudent,
  nextNumber,
}) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nomAr, setNomAr] = useState('');
  const [prenomAr, setPrenomAr] = useState('');
  const [dateNaissance, setDateNaissance] = useState('2014-01-01');
  const [lieuNaissance, setLieuNaissance] = useState('Dakar');
  const [lieuNaissanceAr, setLieuNaissanceAr] = useState('داكار');
  const [sexe, setSexe] = useState<Gender>('M');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim()) {
      alert("Le nom et le prénom de l'élève sont obligatoires.");
      return;
    }

    const padNum = String(nextNumber).padStart(3, '0');
    const matricule = `2026-ALM-${padNum}`;

    const newStudent: Student = {
      id: `std_${Date.now()}`,
      matricule,
      nom: nom.trim().toUpperCase(),
      prenom: prenom.trim(),
      nomAr: nomAr.trim() || undefined,
      prenomAr: prenomAr.trim() || undefined,
      dateNaissance,
      lieuNaissance: lieuNaissance.trim(),
      lieuNaissanceAr: lieuNaissanceAr.trim() || undefined,
      sexe,
      absencesJustifiees: 0,
      absencesNonJustifiees: 0,
      retards: 0,
      conduite: 'Bonne',
      conduiteAr: 'جيدة',
      grades: {},
    };

    onAddStudent(newStudent);
    onClose();
    // Reset form
    setNom('');
    setPrenom('');
    setNomAr('');
    setPrenomAr('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-800" />
            <h3 className="font-bold text-sm text-slate-900">
              Inscrire un Nouvel Élève
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Nom de famille *
              </label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="ex: DIALLO"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Prénom(s) *
              </label>
              <input
                type="text"
                required
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="ex: Amadou Tidiane"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3" dir="rtl">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 font-arabic text-right">
                اللقب (بالعربية)
              </label>
              <input
                type="text"
                value={nomAr}
                onChange={(e) => setNomAr(e.target.value)}
                placeholder="ديالو"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-arabic focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 text-right"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 font-arabic text-right">
                الاسم (بالعربية)
              </label>
              <input
                type="text"
                value={prenomAr}
                onChange={(e) => setPrenomAr(e.target.value)}
                placeholder="أحمد تيجان"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-arabic focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 text-right"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Sexe
              </label>
              <select
                value={sexe}
                onChange={(e) => setSexe(e.target.value as Gender)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option value="M">Masculin (M)</option>
                <option value="F">Féminin (F)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Date de Naissance
              </label>
              <input
                type="date"
                required
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Lieu de Naissance
              </label>
              <input
                type="text"
                required
                value={lieuNaissance}
                onChange={(e) => setLieuNaissance(e.target.value)}
                placeholder="ex: Dakar"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
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
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded shadow-xs transition-colors"
            >
              Enregistrer l'élève
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
