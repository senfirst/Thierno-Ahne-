import React, { useState, useEffect, useMemo } from 'react';
import { SchoolConfig, Subject, Student } from './types';
import { DEFAULT_SCHOOL_CONFIG, DEFAULT_SUBJECTS, DEFAULT_STUDENTS } from './data/defaultData';
import { calculateClassResults } from './utils/calculations';
import { HeaderNav } from './components/HeaderNav';
import { ClassSummaryTable } from './components/ClassSummaryTable';
import { BulletinViewer } from './components/BulletinViewer';
import { GradeEditor } from './components/GradeEditor';
import { DataAuditView } from './components/DataAuditView';
import { ConfigModal } from './components/ConfigModal';
import { NewStudentModal } from './components/NewStudentModal';
import { PrintBatchModal, PrintScope } from './components/PrintBatchModal';
import { PrintContainer, PrintQueueState } from './components/PrintContainer';

export default function App() {
  // Local storage persistence
  const [config, setConfig] = useState<SchoolConfig>(() => {
    try {
      const saved = localStorage.getItem('almaarifa_config');
      return saved ? JSON.parse(saved) : DEFAULT_SCHOOL_CONFIG;
    } catch {
      return DEFAULT_SCHOOL_CONFIG;
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('almaarifa_subjects');
      return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
    } catch {
      return DEFAULT_SUBJECTS;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('almaarifa_students');
      return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
    } catch {
      return DEFAULT_STUDENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('almaarifa_config', JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('almaarifa_subjects', JSON.stringify(subjects));
    } catch (e) {
      console.error(e);
    }
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem('almaarifa_students', JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  // Tab & Modal State
  const [currentTab, setCurrentTab] = useState<'summary' | 'bulletins' | 'grades' | 'audit' | 'settings'>('summary');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [selectedStudentForBulletin, setSelectedStudentForBulletin] = useState<string | null>(null);

  // Printing state
  const [printQueue, setPrintQueue] = useState<PrintQueueState | null>(null);

  // Calculations Engine
  const { results, statistics, anomalies } = useMemo(() => {
    return calculateClassResults(students, subjects);
  }, [students, subjects]);

  // Handlers
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const handleResetDefaultData = () => {
    setConfig(DEFAULT_SCHOOL_CONFIG);
    setSubjects(DEFAULT_SUBJECTS);
    setStudents(DEFAULT_STUDENTS);
    localStorage.removeItem('almaarifa_config');
    localStorage.removeItem('almaarifa_subjects');
    localStorage.removeItem('almaarifa_students');
  };

  const handleSelectStudentForBulletin = (studentId: string) => {
    setSelectedStudentForBulletin(studentId);
    setCurrentTab('bulletins');
  };

  const handlePrintStudent = (studentId: string, mode: 'both' | 'fr' | 'ar') => {
    setPrintQueue({
      type: 'single',
      singleStudentId: studentId,
      singleMode: mode,
    });
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleBatchPrint = (scope: PrintScope) => {
    setPrintQueue({
      type: 'batch',
      batchScope: scope,
    });
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-amber-200">
      {/* Top Bar with Navigation */}
      <HeaderNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        config={config}
        anomalyCount={anomalies.length}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenNewStudentModal={() => setIsNewStudentModalOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 no-print">
        {currentTab === 'summary' && (
          <ClassSummaryTable
            results={results}
            statistics={statistics}
            config={config}
            onSelectStudent={handleSelectStudentForBulletin}
            onPrintPalmares={() => handleBatchPrint('palmares')}
          />
        )}

        {currentTab === 'bulletins' && (
          <BulletinViewer
            results={results}
            statistics={statistics}
            config={config}
            initialStudentId={selectedStudentForBulletin}
            onUpdateStudent={handleUpdateStudent}
            onPrintStudent={handlePrintStudent}
          />
        )}

        {currentTab === 'grades' && (
          <GradeEditor
            students={students}
            subjects={subjects}
            config={config}
            onUpdateStudent={handleUpdateStudent}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            onSelectStudentForBulletin={handleSelectStudentForBulletin}
          />
        )}

        {currentTab === 'audit' && (
          <DataAuditView
            anomalies={anomalies}
            onSelectStudent={handleSelectStudentForBulletin}
          />
        )}

        {currentTab === 'settings' && (
          <ConfigModal
            config={config}
            subjects={subjects}
            onSaveConfig={setConfig}
            onSaveSubjects={setSubjects}
            onResetDefaultData={handleResetDefaultData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-800">{config.nomEtablissement}</span> · {config.republiqueFr}
          </div>
          <div className="flex items-center gap-3">
            <span>Année scolaire {config.anneeScolaire}</span>
            <span>·</span>
            <span>{config.trimestre}</span>
            <span>·</span>
            <span className="font-semibold text-emerald-800">1 élève = 2 bulletins (FR / AR)</span>
          </div>
        </div>
      </footer>

      {/* New Student Modal */}
      <NewStudentModal
        isOpen={isNewStudentModalOpen}
        onClose={() => setIsNewStudentModalOpen(false)}
        subjects={subjects}
        onAddStudent={handleAddStudent}
        nextNumber={students.length + 1}
      />

      {/* Batch Print Modal */}
      <PrintBatchModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        studentCount={students.length}
        config={config}
        onConfirmPrint={handleBatchPrint}
      />

      {/* Print Output Container (Hidden on screen, activated during print) */}
      <PrintContainer
        queue={printQueue}
        results={results}
        statistics={statistics}
        config={config}
      />
    </div>
  );
}
