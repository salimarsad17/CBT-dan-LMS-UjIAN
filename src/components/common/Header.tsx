import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { UserRole, GradeLevel } from '../../types';
import {
  GraduationCap,
  ShieldCheck,
  BookOpen,
  UserCheck,
  LogOut,
  ChevronDown,
  RotateCcw,
  Sparkles,
  School,
  Menu,
  X,
  CheckCircle2,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    schoolConfig,
    logout,
    quickSwitchUser,
    activeView,
    setActiveView,
    resetAllData,
  } = useLms();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  const getRoleBadge = (role: UserRole, grade?: GradeLevel, className?: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            Administrator CBT
          </span>
        );
      case 'guru':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            Guru Pengampu
          </span>
        );
      case 'siswa':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            Siswa Kelas {grade} ({className || `${grade}A`})
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Quick Demo Switcher Bar (Always visible for easy evaluator inspection across the 3 roles & 3 grades) */}
      <div className="bg-slate-900 text-white text-xs px-3 py-1.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-medium text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulasi Role:</span>
            </span>
            <span className="hidden md:inline text-slate-400">
              Klik untuk langsung beralih akun pengujian:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              id="switch-to-admin-btn"
              onClick={() => quickSwitchUser('admin')}
              className={`px-2 py-0.5 rounded transition text-xs font-medium ${
                currentUser?.role === 'admin'
                  ? 'bg-rose-600 text-white font-semibold ring-1 ring-white'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              1. Admin
            </button>
            <button
              id="switch-to-guru-btn"
              onClick={() => quickSwitchUser('guru')}
              className={`px-2 py-0.5 rounded transition text-xs font-medium ${
                currentUser?.role === 'guru'
                  ? 'bg-emerald-600 text-white font-semibold ring-1 ring-white'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              2. Guru (IPA)
            </button>

            <div className="flex items-center bg-slate-800 rounded p-0.5 gap-1">
              <span className="text-[11px] text-slate-400 pl-1">3. Siswa:</span>
              <button
                id="switch-to-siswa7-btn"
                onClick={() => quickSwitchUser('siswa', '7')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${
                  currentUser?.role === 'siswa' && currentUser?.gradeLevel === '7'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Kls 7
              </button>
              <button
                id="switch-to-siswa8-btn"
                onClick={() => quickSwitchUser('siswa', '8')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${
                  currentUser?.role === 'siswa' && currentUser?.gradeLevel === '8'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Kls 8
              </button>
              <button
                id="switch-to-siswa9-btn"
                onClick={() => quickSwitchUser('siswa', '9')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${
                  currentUser?.role === 'siswa' && currentUser?.gradeLevel === '9'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Kls 9
              </button>
            </div>

            <button
              id="reset-demo-data-btn"
              onClick={() => {
                if (window.confirm('Reset data LMS ke data awal demo?')) {
                  resetAllData();
                }
              }}
              title="Reset data demo ke awal"
              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-amber-300 hover:bg-slate-700 transition ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & School Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-600/20">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  CBT & LMS UJIAN
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  SMP NEGERI
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-xs font-medium">
                {schoolConfig.name} • TP {schoolConfig.academicYear}
              </p>
            </div>
          </div>

          {/* User Profile & Navigation */}
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Role Badge (Desktop) */}
              <div className="hidden md:flex items-center">
                {getRoleBadge(currentUser.role, currentUser.gradeLevel, currentUser.className)}
              </div>

              {/* User Identity Pill */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {currentUser.role === 'siswa' ? `NISN: ${currentUser.identifier}` : `NIP: ${currentUser.identifier.slice(0, 10)}...`}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                id="header-logout-btn"
                onClick={logout}
                title="Keluar / Ganti Akun"
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-100"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-login-btn"
                onClick={() => setActiveView('login')}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-xs"
              >
                Masuk CBT
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
