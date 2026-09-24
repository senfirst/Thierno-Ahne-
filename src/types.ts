export type Gender = 'M' | 'F';

export interface Subject {
  id: string;
  nameFr: string;
  nameAr: string;
  coefficient: number;
}

export interface SubjectGrade {
  subjectId: string;
  devoir1: number | null; // null represents unentered
  devoir2: number | null;
  composition: number | null;
  appreciationFr?: string;
  appreciationAr?: string;
}

export interface Student {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  nomAr?: string;
  prenomAr?: string;
  dateNaissance: string; // YYYY-MM-DD
  lieuNaissance: string;
  lieuNaissanceAr?: string;
  sexe: Gender;
  grades: Record<string, SubjectGrade>; // key is subjectId
  absencesJustifiees: number;
  absencesNonJustifiees: number;
  retards: number;
  conduite: string; // ex: "Très bonne", "Bonne", "Passable"
  conduiteAr?: string;
  customAppreciationFr?: string;
  customAppreciationAr?: string;
  customMentionFr?: string;
  customMentionAr?: string;
}

export interface CalculatedSubject {
  subject: Subject;
  devoir1: number | null;
  devoir2: number | null;
  composition: number | null;
  moyenneDevoirs: number | null;
  moyenneMatiere: number | null;
  pointsPonderes: number | null;
  appreciationFr: string;
  appreciationAr: string;
  isComplete: boolean;
}

export interface CalculatedStudentResults {
  student: Student;
  calculatedSubjects: CalculatedSubject[];
  totalPoints: number;
  totalCoefficients: number;
  moyenneGenerale: number | null; // 2 decimal places
  rang: number;
  rangTextFr: string; // "1er", "2e", etc.
  rangTextAr: string; // "الأول", "الثاني", etc.
  isExAequo: boolean;
  appreciationConseilFr: string;
  appreciationConseilAr: string;
  mentionFr: string;
  mentionAr: string;
  anomalies: string[];
}

export interface ClassStatistics {
  effectifTotal: number;
  effectifGarcons: number;
  effectifFilles: number;
  moyenneClasse: number;
  plusForteMoyenne: number;
  plusFaibleMoyenne: number;
  tauxReussite: number; // percentage >= 10
  nbFelicitations: number;
  nbTableauHonneur: number;
  nbEncouragements: number;
  nbInsuffisants: number;
}

export interface SchoolConfig {
  nomEtablissement: string;
  nomEtablissementAr: string;
  deviseNationaleFr: string;
  deviseNationaleAr: string;
  republiqueFr: string;
  republiqueAr: string;
  anneeScolaire: string;
  trimestre: '1er trimestre' | '2e trimestre' | '3e trimestre';
  trimestreAr: string;
  classe: string;
  classeAr: string;
  nomDirecteur: string;
  nomDirecteurAr: string;
  nomProfesseurPrincipal: string;
  nomProfesseurPrincipalAr: string;
}

export interface DataAnomaly {
  studentId: string;
  studentName: string;
  subjectName?: string;
  type: 'missing_grade' | 'out_of_bounds' | 'missing_info' | 'missing_coef';
  description: string;
  severity: 'error' | 'warning';
}
