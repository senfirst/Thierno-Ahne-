import { Student, Subject, CalculatedStudentResults, CalculatedSubject, ClassStatistics, DataAnomaly } from '../types';

export function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function formatGrade(grade: number | null | undefined): string {
  if (grade === null || grade === undefined || isNaN(grade)) {
    return 'Non renseignée';
  }
  return grade.toFixed(2).replace('.', ',');
}

export function formatGradeAr(grade: number | null | undefined): string {
  if (grade === null || grade === undefined || isNaN(grade)) {
    return 'غير محدد';
  }
  return grade.toFixed(2);
}

export function getAppreciationForGrade(grade: number | null | undefined): { fr: string; ar: string } {
  if (grade === null || grade === undefined || isNaN(grade)) {
    return { fr: 'Non évalué', ar: 'غير مقيم' };
  }
  if (grade >= 16) {
    return { fr: 'Excellent', ar: 'ممتاز' };
  }
  if (grade >= 14) {
    return { fr: 'Très bien', ar: 'جيد جدا' };
  }
  if (grade >= 12) {
    return { fr: 'Bien', ar: 'جيد' };
  }
  if (grade >= 10) {
    return { fr: 'Assez bien / Passable', ar: 'مقبول' };
  }
  if (grade >= 8) {
    return { fr: 'Insuffisant', ar: 'غير كاف' };
  }
  return { fr: 'Très insuffisant', ar: 'ضعيف جدا' };
}

export function getMentionForAverage(
  average: number | null | undefined,
  unjustifiedAbsences: number = 0,
  conduct: string = ''
): { fr: string; ar: string } {
  if (average === null || average === undefined || isNaN(average)) {
    return { fr: '-', ar: '-' };
  }

  const isConductPoor = conduct.toLowerCase().includes('mauvaise') || conduct.toLowerCase().includes('passable');
  if (unjustifiedAbsences >= 5 || isConductPoor) {
    if (unjustifiedAbsences >= 8) {
      return { fr: 'Avertissement conduite & assiduité', ar: 'إنذار في السلوك والمواظبة' };
    }
  }

  if (average >= 16) {
    return { fr: 'Félicitations', ar: 'تهنئة' };
  }
  if (average >= 14) {
    return { fr: "Tableau d'honneur", ar: 'لوحة الشرف' };
  }
  if (average >= 12) {
    return { fr: 'Encouragements', ar: 'تشجيع' };
  }
  if (average >= 10) {
    return { fr: 'Tableau de passage', ar: 'ملاحظة تشجيعية' };
  }
  if (average >= 8) {
    return { fr: "Recommandation d'efforts", ar: 'تنبيه بالعمل والمواظبة' };
  }
  return { fr: 'Avertissement travail', ar: 'إنذار بالعمل' };
}

export function generateCouncilAppreciation(
  student: Student,
  average: number | null | undefined,
  mention: string
): { fr: string; ar: string } {
  if (student.customAppreciationFr && student.customAppreciationAr) {
    return {
      fr: student.customAppreciationFr,
      ar: student.customAppreciationAr,
    };
  }

  if (average === null || average === undefined || isNaN(average)) {
    return {
      fr: "Résultats incomplets pour ce trimestre. Veuillez régulariser les évaluations manquantes.",
      ar: "النتائج غير مكتملة لهذا الفصل. يرجى استكمال الفروض والاختبارات الناقصة."
    };
  }

  const isF = student.sexe === 'F';

  if (average >= 17) {
    return {
      fr: `Remarquable trimestre avec des résultats exemplaires et une régularité exemplaire. Félicitations pour cet engagement sans faille, continuez ainsi !`,
      ar: `فصل دراسي متميز بنتائج نموذجية ومواظبة يحتذى بها. تهانينا الحارة على هذا التألق مع التمنيات بالاستمرار على هذا النهج.`
    };
  }

  if (average >= 16) {
    return {
      fr: `Excellent trimestre, témoignant d'une remarquable maîtrise des compétences et d'un travail soigné. Toutes nos félicitations pour cette belle réussite.`,
      ar: `فصل ممتاز يعكس إتقاناً كبيراً للمقررات وعملاً جاداً ومتقناً. هنيئاً لك هذه النتيجة المشرفة مع دوام التوفيق.`
    };
  }

  if (average >= 14) {
    return {
      fr: `Très bon trimestre avec une participation active et des résultats solides dans l'ensemble des disciplines. Poursuivez dans cette voie avec la même rigueur.`,
      ar: `فصل جيد جداً تميز بمشاركة فعالة ونتائج قوية في مختلف المواد. واصل بنفس الروح والعزيمة لترسيخ هذا المستوى.`
    };
  }

  if (average >= 12) {
    return {
      fr: `Bon trimestre d'ensemble avec un travail sérieux et régulier. En renforçant la méthode personnelle à la maison, les résultats peuvent encore progresser.`,
      ar: `فصل جيد إجمالاً يتسم بالجدية والمواظبة على العمل. بتكثيف المراجعة الفردية في البيت يمكن تحقيق نتائج أفضل في الفصل القادم.`
    };
  }

  if (average >= 10) {
    return {
      fr: `Trimestre convenable et travail satisfaisant, mais l'élève peut mieux faire. Il convient d'approfondir les leçons quotidiennes pour consolider les acquis.`,
      ar: `فصل مقبول مع بذل مجهود طيب، ولكن التلميذ يملك قدرات تسمح بأداء أفضل. ينبغي تعميق المراجعة اليومية لتثبيت المكتسبات.`
    };
  }

  if (average >= 8) {
    return {
      fr: `Résultats insuffisants ce trimestre malgré une volonté d'apprendre. Un sursaut d'efforts et un accompagnement soutenu à la maison sont vivement attendus.`,
      ar: `نتائج غير كافية خلال هذا الفصل على الرغم من الرغبة في التعلم. مطلوب بذل المزيد من الجهد ومتابعة منتظمة في المنزل لتدارك التأخر.`
    };
  }

  return {
    fr: `Résultats très insuffisants qui nécessitent une remédiation urgente et un changement d'attitude face au travail. Une prise de conscience immédiate est indispensable.`,
    ar: `نتائج ضعيفة جداً تستوجب تدخلاً عاجلاً وتغييراً جذرياً في المنهجية والمواظبة. لا بد من التدارك الفوري لتجاوز الصعوبات.`
  };
}

export function formatRankFr(rank: number, isExAequo: boolean): string {
  if (rank === 1) {
    return isExAequo ? '1er ex' : '1er';
  }
  return isExAequo ? `${rank}e ex` : `${rank}e`;
}

export function formatRankAr(rank: number, isExAequo: boolean): string {
  const arabicOrdinals: Record<number, string> = {
    1: 'الأول',
    2: 'الثاني',
    3: 'الثالث',
    4: 'الرابع',
    5: 'الخامس',
    6: 'السادس',
    7: 'السابع',
    8: 'الثامن',
    9: 'التاسع',
    10: 'العاشر',
    11: 'الحادي عشر',
    12: 'الثاني عشر',
    13: 'الثالث عشر',
    14: 'الرابع عشر',
    15: 'الخامس عشر',
    16: 'السادس عشر',
    17: 'السابع عشر',
    18: 'الثامن عشر',
    19: 'التاسع عشر',
    20: 'العشرون',
    21: 'الحادي والعشرون',
    22: 'الثاني والعشرون',
    23: 'الثالث والعشرون',
    24: 'الرابع والعشرون',
    25: 'الخامس والعشرون',
    26: 'السادس والعشرون',
    27: 'السابع والعشرون',
    28: 'الثامن والعشرون',
    29: 'التاسع والعشرون',
    30: 'الثلاثون'
  };

  const ordinal = arabicOrdinals[rank] || `${rank}`;
  return isExAequo ? `${ordinal} مكرر` : ordinal;
}

export function calculateStudentGrades(student: Student, subjects: Subject[]): {
  calculatedSubjects: CalculatedSubject[];
  totalPoints: number;
  totalCoefficients: number;
  moyenneGenerale: number | null;
  anomalies: string[];
} {
  const calculatedSubjects: CalculatedSubject[] = [];
  let totalPoints = 0;
  let totalCoefficients = 0;
  const anomalies: string[] = [];
  let hasMissingGrade = false;

  subjects.forEach(subject => {
    const record = student.grades[subject.id] || {
      subjectId: subject.id,
      devoir1: null,
      devoir2: null,
      composition: null,
    };

    const d1 = record.devoir1;
    const d2 = record.devoir2;
    const compo = record.composition;

    // Check bounds
    [
      { name: 'Devoir 1', val: d1 },
      { name: 'Devoir 2', val: d2 },
      { name: 'Composition', val: compo }
    ].forEach(item => {
      if (item.val !== null && (item.val < 0 || item.val > 20)) {
        anomalies.push(`${subject.nameFr}: ${item.name} (${item.val}) hors barème (doit être entre 0 et 20).`);
      }
    });

    let moyenneDevoirs: number | null = null;
    if (d1 !== null && d2 !== null) {
      moyenneDevoirs = round2((d1 + d2) / 2);
    } else if (d1 !== null && d2 === null) {
      moyenneDevoirs = d1;
    } else if (d1 === null && d2 !== null) {
      moyenneDevoirs = d2;
    } else {
      hasMissingGrade = true;
    }

    let moyenneMatiere: number | null = null;
    let pointsPonderes: number | null = null;

    if (moyenneDevoirs !== null && compo !== null) {
      moyenneMatiere = round2((moyenneDevoirs + compo) / 2);
      pointsPonderes = round2(moyenneMatiere * subject.coefficient);
      totalPoints += pointsPonderes;
      totalCoefficients += subject.coefficient;
    } else {
      hasMissingGrade = true;
    }

    const appreciation = getAppreciationForGrade(moyenneMatiere);

    calculatedSubjects.push({
      subject,
      devoir1: d1,
      devoir2: d2,
      composition: compo,
      moyenneDevoirs,
      moyenneMatiere,
      pointsPonderes,
      appreciationFr: record.appreciationFr || appreciation.fr,
      appreciationAr: record.appreciationAr || appreciation.ar,
      isComplete: moyenneMatiere !== null,
    });
  });

  const moyenneGenerale = totalCoefficients > 0 && !hasMissingGrade
    ? round2(totalPoints / totalCoefficients)
    : (totalCoefficients > 0 ? round2(totalPoints / totalCoefficients) : null);

  return {
    calculatedSubjects,
    totalPoints: round2(totalPoints),
    totalCoefficients,
    moyenneGenerale,
    anomalies
  };
}

export function calculateClassResults(
  students: Student[],
  subjects: Subject[]
): {
  results: CalculatedStudentResults[];
  statistics: ClassStatistics;
  anomalies: DataAnomaly[];
} {
  const anomaliesList: DataAnomaly[] = [];

  // 1. Initial calculation per student
  const intermediateList = students.map(student => {
    // Validate identity
    if (!student.nom || !student.prenom) {
      anomaliesList.push({
        studentId: student.id,
        studentName: `${student.prenom || ''} ${student.nom || ''}`.trim() || 'Élève inconnu',
        type: 'missing_info',
        description: "Nom ou prénom manquant pour l'élève.",
        severity: 'error'
      });
    }
    if (!student.dateNaissance || !student.lieuNaissance) {
      anomaliesList.push({
        studentId: student.id,
        studentName: `${student.prenom} ${student.nom}`,
        type: 'missing_info',
        description: "Date ou lieu de naissance manquant.",
        severity: 'warning'
      });
    }

    const { calculatedSubjects, totalPoints, totalCoefficients, moyenneGenerale, anomalies } =
      calculateStudentGrades(student, subjects);

    anomalies.forEach(err => {
      anomaliesList.push({
        studentId: student.id,
        studentName: `${student.prenom} ${student.nom}`,
        type: 'out_of_bounds',
        description: err,
        severity: 'error'
      });
    });

    // Check missing grades
    calculatedSubjects.forEach(cs => {
      if (cs.devoir1 === null || cs.devoir2 === null || cs.composition === null) {
        anomaliesList.push({
          studentId: student.id,
          studentName: `${student.prenom} ${student.nom}`,
          subjectName: cs.subject.nameFr,
          type: 'missing_grade',
          description: `Note manquante en ${cs.subject.nameFr} (${[
            cs.devoir1 === null ? 'Devoir 1' : '',
            cs.devoir2 === null ? 'Devoir 2' : '',
            cs.composition === null ? 'Composition' : ''
          ].filter(Boolean).join(', ')}).`,
          severity: 'warning'
        });
      }
    });

    return {
      student,
      calculatedSubjects,
      totalPoints,
      totalCoefficients,
      moyenneGenerale,
      anomalies,
    };
  });

  // 2. Sort by descending general average
  const sorted = [...intermediateList].sort((a, b) => {
    const avgA = a.moyenneGenerale ?? -1;
    const avgB = b.moyenneGenerale ?? -1;
    return avgB - avgA;
  });

  // 3. Assign ranks with ex æquo handling
  const results: CalculatedStudentResults[] = [];
  let currentRank = 1;

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const prev = i > 0 ? sorted[i - 1] : null;
    const next = i < sorted.length - 1 ? sorted[i + 1] : null;

    let isExAequo = false;

    if (prev && prev.moyenneGenerale !== null && current.moyenneGenerale !== null && prev.moyenneGenerale === current.moyenneGenerale) {
      // Same rank as previous
      isExAequo = true;
    } else {
      currentRank = i + 1;
      if (next && next.moyenneGenerale !== null && current.moyenneGenerale !== null && next.moyenneGenerale === current.moyenneGenerale) {
        isExAequo = true;
      }
    }

    const mentions = getMentionForAverage(
      current.moyenneGenerale,
      current.student.absencesNonJustifiees,
      current.student.conduite
    );

    const appreciation = generateCouncilAppreciation(
      current.student,
      current.moyenneGenerale,
      mentions.fr
    );

    results.push({
      student: current.student,
      calculatedSubjects: current.calculatedSubjects,
      totalPoints: current.totalPoints,
      totalCoefficients: current.totalCoefficients,
      moyenneGenerale: current.moyenneGenerale,
      rang: currentRank,
      rangTextFr: formatRankFr(currentRank, isExAequo),
      rangTextAr: formatRankAr(currentRank, isExAequo),
      isExAequo,
      appreciationConseilFr: current.student.customAppreciationFr || appreciation.fr,
      appreciationConseilAr: current.student.customAppreciationAr || appreciation.ar,
      mentionFr: current.student.customMentionFr || mentions.fr,
      mentionAr: current.student.customMentionAr || mentions.ar,
      anomalies: current.anomalies,
    });
  }

  // 4. Calculate class statistics
  const validAverages = results
    .map(r => r.moyenneGenerale)
    .filter((avg): avg is number => avg !== null && !isNaN(avg));

  const effectifTotal = students.length;
  const effectifGarcons = students.filter(s => s.sexe === 'M').length;
  const effectifFilles = students.filter(s => s.sexe === 'F').length;

  let moyenneClasse = 0;
  let plusForteMoyenne = 0;
  let plusFaibleMoyenne = 0;
  let passCount = 0;
  let nbFelicitations = 0;
  let nbTableauHonneur = 0;
  let nbEncouragements = 0;
  let nbInsuffisants = 0;

  if (validAverages.length > 0) {
    const sum = validAverages.reduce((acc, val) => acc + val, 0);
    moyenneClasse = round2(sum / validAverages.length);
    plusForteMoyenne = Math.max(...validAverages);
    plusFaibleMoyenne = Math.min(...validAverages);
    passCount = validAverages.filter(avg => avg >= 10).length;

    validAverages.forEach(avg => {
      if (avg >= 16) nbFelicitations++;
      else if (avg >= 14) nbTableauHonneur++;
      else if (avg >= 12) nbEncouragements++;
      else if (avg < 10) nbInsuffisants++;
    });
  }

  const tauxReussite = effectifTotal > 0 ? round2((passCount / effectifTotal) * 100) : 0;

  const statistics: ClassStatistics = {
    effectifTotal,
    effectifGarcons,
    effectifFilles,
    moyenneClasse,
    plusForteMoyenne,
    plusFaibleMoyenne,
    tauxReussite,
    nbFelicitations,
    nbTableauHonneur,
    nbEncouragements,
    nbInsuffisants,
  };

  return {
    results,
    statistics,
    anomalies: anomaliesList
  };
}
