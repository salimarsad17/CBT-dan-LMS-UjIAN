import React from 'react';
import { LmsProvider, useLms } from './context/LmsContext';
import { Header } from './components/common/Header';
import { LoginView } from './components/auth/LoginView';
import { SiswaDashboard } from './components/siswa/SiswaDashboard';
import { ExamCbtRoom } from './components/siswa/ExamCbtRoom';
import { ExamResultView } from './components/siswa/ExamResultView';
import { GuruDashboard } from './components/guru/GuruDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { School, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, activeView, schoolConfig } = useLms();

  // If not logged in, display the Login View
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
        <Header />
        <main className="flex-1">
          <LoginView />
        </main>
        <Footer schoolConfig={schoolConfig} />
      </div>
    );
  }

  // If in CBT Exam Room, render ExamCbtRoom without normal headers to prevent distractions
  if (activeView === 'exam-cbt' && currentUser.role === 'siswa') {
    return (
      <div className="min-h-screen bg-slate-100 font-sans antialiased select-none">
        <ExamCbtRoom />
      </div>
    );
  }

  // Normal Dashboard layout with Header & Footer
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
      <Header />
      <main className="flex-1">
        {currentUser.role === 'siswa' && (
          <>
            {activeView === 'exam-result' ? (
              <ExamResultView />
            ) : (
              <SiswaDashboard />
            )}
          </>
        )}

        {currentUser.role === 'guru' && <GuruDashboard />}

        {currentUser.role === 'admin' && <AdminDashboard />}
      </main>

      <Footer schoolConfig={schoolConfig} />
    </div>
  );
};

const Footer: React.FC<{ schoolConfig: { name: string; academicYear: string; currentSemester: string; npsn: string } }> = ({
  schoolConfig,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            <School className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-800">{schoolConfig.name}</span>
          <span className="hidden md:inline">• Asesmen Ujian Berbasis Komputer (CBT) Kelas 7, 8, dan 9</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>NPSN: {schoolConfig.npsn}</span>
          <span>•</span>
          <span>T.A {schoolConfig.academicYear} ({schoolConfig.currentSemester})</span>
          <span>•</span>
          <span>Status Server: <strong className="text-emerald-600 font-semibold">Online (Stabil)</strong></span>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <LmsProvider>
      <AppContent />
    </LmsProvider>
  );
}
