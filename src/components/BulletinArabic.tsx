import React from 'react';
import { CalculatedStudentResults, ClassStatistics, SchoolConfig } from '../types';
import { OfficialEmblem } from './OfficialEmblem';
import { formatGradeAr } from '../utils/calculations';

interface BulletinArabicProps {
  result: CalculatedStudentResults;
  statistics: ClassStatistics;
  config: SchoolConfig;
  className?: string;
}

export const BulletinArabic: React.FC<BulletinArabicProps> = ({
  result,
  statistics,
  config,
  className = '',
}) => {
  const { student, calculatedSubjects, totalPoints, totalCoefficients, moyenneGenerale, rangTextAr } = result;

  return (
    <div
      dir="rtl"
      className={`bulletin-sheet bg-white text-slate-900 border border-slate-300 rounded-sm p-6 sm:p-7 shadow-sm max-w-[800px] mx-auto text-xs leading-tight print:p-5 print:border-slate-800 font-arabic ${className}`}
    >
      {/* Official Top Header */}
      <div className="border-b-2 border-slate-900 pb-3 mb-3">
        <div className="flex items-start justify-between gap-4">
          {/* Right (start in RTL): Republic & Motto */}
          <div className="text-right w-1/3">
            <p className="font-extrabold text-[12px] text-slate-900">
              {config.republiqueAr}
            </p>
            <p className="text-[10px] text-slate-600 font-medium">
              {config.deviseNationaleAr}
            </p>
            <p className="text-[9px] text-slate-500 mt-0.5">
              وزارة التربية الوطنية
            </p>
          </div>

          {/* Center: School Emblem & Official Name in Arabic */}
          <div className="text-center w-1/3 flex flex-col items-center">
            <OfficialEmblem size={44} className="mb-1" />
            <h1 className="font-extrabold text-sm text-slate-950 leading-snug">
              {config.nomEtablissementAr}
            </h1>
            <div className="inline-block mt-1 px-3 py-0.5 border border-slate-900 font-bold text-[11px] tracking-wide bg-slate-50">
              كشف النتائج الدراسية
            </div>
          </div>

          {/* Left (end in RTL): Academic Period */}
          <div className="text-left w-1/3 space-y-0.5 text-[10px]">
            <p>
              <span className="text-slate-500">السنة الدراسية :</span>{' '}
              <span className="font-bold text-slate-900 font-tabular">{config.anneeScolaire}</span>
            </p>
            <p>
              <span className="text-slate-500">الفترة :</span>{' '}
              <span className="font-bold text-slate-900">{config.trimestreAr}</span>
            </p>
            <p>
              <span className="text-slate-500">القسم :</span>{' '}
              <span className="font-bold text-slate-900">{config.classeAr || config.classe}</span>
            </p>
            <p>
              <span className="text-slate-500">عدد التلاميذ :</span>{' '}
              <span className="font-bold text-slate-900 font-tabular">{statistics.effectifTotal} تلميذاً</span>
            </p>
          </div>
        </div>
      </div>

      {/* Student Identity Card in Arabic */}
      <div className="bg-slate-50 border border-slate-300 rounded p-2.5 mb-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
        <div>
          <span className="text-slate-500 block text-[9px]">اللقب والاسم :</span>
          <span className="font-bold text-slate-900 text-xs">
            {student.nomAr ? `${student.nomAr} ${student.prenomAr || ''}` : `${student.nom} ${student.prenom}`}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[9px]">تاريخ ومكان الميلاد :</span>
          <span className="font-semibold text-slate-800">
            {student.dateNaissance || 'غير محدد'} في {student.lieuNaissanceAr || student.lieuNaissance || 'غير محدد'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[9px]">الجنس / رقم التسجيل :</span>
          <span className="font-semibold text-slate-800">
            {student.sexe === 'M' ? 'ذكر' : 'أنثى'} · <span className="font-tabular">{student.matricule}</span>
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[9px]">القسم / عدد التلاميذ :</span>
          <span className="font-semibold text-slate-800">
            {config.classeAr || config.classe} (<span className="font-tabular">{statistics.effectifTotal}</span> تلميذاً)
          </span>
        </div>
      </div>

      {/* Table of Results in Arabic */}
      <div className="overflow-x-auto mb-3">
        <table className="w-full border-collapse border border-slate-300 text-[10px]">
          <thead>
            <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 text-[9.5px] font-bold">
              <th className="border border-slate-300 px-2 py-1.5 text-right">المادة</th>
              <th className="border border-slate-300 px-1.5 py-1.5 text-center w-12">المعامل</th>
              <th className="border border-slate-300 px-1.5 py-1.5 text-center w-14">الفرض 1</th>
              <th className="border border-slate-300 px-1.5 py-1.5 text-center w-14">الفرض 2</th>
              <th className="border border-slate-300 px-1.5 py-1.5 text-center w-16">الاختبار</th>
              <th className="border border-slate-300 px-1.5 py-1.5 text-center w-14 bg-slate-200/60 font-black">
                المعدل
              </th>
              <th className="border border-slate-300 px-1.5 py-1.5 text-center w-16 bg-slate-200/60 font-black">
                المعدل × المعامل
              </th>
              <th className="border border-slate-300 px-2 py-1.5 text-right min-w-[130px]">تقدير الأستاذ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {calculatedSubjects.map(item => (
              <tr key={item.subject.id} className="hover:bg-slate-50/50">
                <td className="border border-slate-300 px-2 py-1 font-semibold text-slate-900">
                  {item.subject.nameAr}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 text-center font-tabular font-medium text-slate-700">
                  {item.subject.coefficient}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 text-center font-tabular text-slate-700">
                  {item.devoir1 !== null ? formatGradeAr(item.devoir1) : <span className="text-slate-400 italic">غير محدد</span>}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 text-center font-tabular text-slate-700">
                  {item.devoir2 !== null ? formatGradeAr(item.devoir2) : <span className="text-slate-400 italic">غير محدد</span>}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 text-center font-tabular font-medium text-slate-800">
                  {item.composition !== null ? formatGradeAr(item.composition) : <span className="text-slate-400 italic">غير محدد</span>}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 text-center font-tabular font-bold text-slate-950 bg-slate-50">
                  {item.moyenneMatiere !== null ? formatGradeAr(item.moyenneMatiere) : '-'}
                </td>
                <td className="border border-slate-300 px-1.5 py-1 text-center font-tabular font-bold text-slate-950 bg-slate-50">
                  {item.pointsPonderes !== null ? formatGradeAr(item.pointsPonderes) : '-'}
                </td>
                <td className="border border-slate-300 px-2 py-1 text-slate-700 text-[9.5px]">
                  {item.appreciationAr}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold border-t-2 border-slate-400 text-slate-900">
              <td className="border border-slate-300 px-2 py-1.5 text-[10px]">
                المجموع
              </td>
              <td className="border border-slate-300 px-1.5 py-1.5 text-center font-tabular">
                {totalCoefficients}
              </td>
              <td colSpan={4} className="border border-slate-300 px-2 py-1.5 text-left text-[9.5px] text-slate-600">
                مجموع النقاط الموزونة :
              </td>
              <td className="border border-slate-300 px-1.5 py-1.5 text-center font-tabular text-xs font-black text-slate-950 bg-slate-200">
                {formatGradeAr(totalPoints)}
              </td>
              <td className="border border-slate-300 px-2 py-1.5 text-slate-500 italic text-[9px]">
                المعدل الأقصى / 20
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* General Results & Class Stats Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Results of the student */}
        <div className="border border-slate-300 rounded p-2.5 bg-slate-50/60">
          <p className="font-bold text-[10px] text-slate-900 border-b border-slate-200 pb-1 mb-2">
            النتائج العامة للتلميذ
          </p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10.5px]">
            <div>
              <span className="text-slate-500 block text-[9px]">مجموع النقاط :</span>
              <span className="font-bold font-tabular text-slate-900">{formatGradeAr(totalPoints)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">مجموع المعاملات :</span>
              <span className="font-bold font-tabular text-slate-900">{totalCoefficients}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-600 block text-[9px] font-bold">المعدل العام :</span>
                <span className="text-base font-black font-tabular text-slate-950">
                  {formatGradeAr(moyenneGenerale)} <span className="text-xs font-normal text-slate-500">/ 20</span>
                </span>
              </div>
              <div className="text-left">
                <span className="text-slate-600 block text-[9px] font-bold">الترتيب :</span>
                <span className="text-base font-black text-emerald-900">
                  {rangTextAr} <span className="text-xs font-normal text-slate-500">/ {statistics.effectifTotal}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Class Statistics */}
        <div className="border border-slate-300 rounded p-2.5 bg-slate-50/60">
          <p className="font-bold text-[10px] text-slate-900 border-b border-slate-200 pb-1 mb-2">
            إحصائيات القسم
          </p>
          <div className="grid grid-cols-3 gap-2 text-[10.5px]">
            <div>
              <span className="text-slate-500 block text-[9px]">معدل القسم :</span>
              <span className="font-bold font-tabular text-slate-900">{formatGradeAr(statistics.moyenneClasse)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">أعلى معدل :</span>
              <span className="font-bold font-tabular text-emerald-800">{formatGradeAr(statistics.plusForteMoyenne)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">أدنى معدل :</span>
              <span className="font-bold font-tabular text-amber-800">{formatGradeAr(statistics.plusFaibleMoyenne)}</span>
            </div>
          </div>

          {/* Assiduité et discipline */}
          <div className="mt-2.5 pt-1.5 border-t border-slate-200">
            <p className="text-[9px] font-bold text-slate-600 mb-1">
              المواظبة والانضباط والسلوك
            </p>
            <div className="grid grid-cols-4 gap-1 text-[10px]">
              <div>
                <span className="text-slate-500 block text-[8.5px]">الغياب المبرر :</span>
                <span className="font-semibold font-tabular text-slate-800">{student.absencesJustifiees}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[8.5px]">الغياب غير المبرر :</span>
                <span className={`font-semibold font-tabular ${student.absencesNonJustifiees > 2 ? 'text-rose-700 font-bold' : 'text-slate-800'}`}>
                  {student.absencesNonJustifiees}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[8.5px]">التأخر :</span>
                <span className="font-semibold font-tabular text-slate-800">{student.retards}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[8.5px]">السلوك :</span>
                <span className="font-semibold text-slate-800">{student.conduiteAr || 'جيد'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Class Council Appréciation in Arabic */}
      <div className="border border-slate-300 rounded p-2.5 bg-white mb-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1.5">
          <span className="font-bold text-[10.5px] text-slate-900">
            ملاحظة وقرار مجلس القسم
          </span>
          <div className="text-[10.5px]">
            <span className="text-slate-500">التقدير : </span>
            <span className="font-extrabold text-slate-950 underline decoration-emerald-600 decoration-2">
              {result.mentionAr}
            </span>
          </div>
        </div>
        <p className="text-[11.5px] text-slate-800 leading-relaxed font-arabic">
          "{result.appreciationConseilAr}"
        </p>
      </div>

      {/* Signatures & Seal Section */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-300 text-center text-[10px]">
        {/* Parent signature */}
        <div className="border border-dashed border-slate-300 rounded p-2 h-24 flex flex-col justify-between">
          <p className="font-bold text-slate-800">الولي / الوصي</p>
          <p className="text-[9px] text-slate-400">التوقيع</p>
        </div>

        {/* Main teacher */}
        <div className="border border-dashed border-slate-300 rounded p-2 h-24 flex flex-col justify-between">
          <div>
            <p className="font-bold text-slate-800">الأستاذ الرئيسي</p>
            <p className="text-[9px] text-slate-500">{config.nomProfesseurPrincipalAr || config.nomProfesseurPrincipal}</p>
          </div>
          <p className="text-[9px] text-slate-400">التوقيع</p>
        </div>

        {/* Director with stamp */}
        <div className="border border-slate-400 rounded p-2 h-24 flex flex-col justify-between bg-slate-50/40 relative">
          <div>
            <p className="font-bold text-slate-900">مدير المؤسسة</p>
            <p className="text-[9px] text-slate-600">{config.nomDirecteurAr || config.nomDirecteur}</p>
          </div>

          {/* Stamp mockup */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-800 flex items-center justify-center rotate-[-12deg] text-emerald-900 text-[8px] font-black text-center leading-tight p-1 font-arabic">
              إدارة المعهد<br />المعارف<br />السنغال
            </div>
          </div>

          <p className="text-[9px] text-slate-500">التوقيع والختم</p>
        </div>
      </div>
    </div>
  );
};
