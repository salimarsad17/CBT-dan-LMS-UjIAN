import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  School,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, loginAsUser, users, schoolConfig } = useLms();

  const [selectedRole, setSelectedRole] = useState<UserRole>('siswa');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage(
        selectedRole === 'siswa'
          ? 'Mohon masukkan NISN atau username siswa.'
          : 'Mohon masukkan NIP atau username.'
      );
      return;
    }

    const result = login(identifier, selectedRole);
    if (!result.success) {
      setErrorMessage(result.message || 'Login gagal. Data tidak ditemukan.');
    }
  };

  // Demo accounts for quick testing
  const adminUser = users.find(u => u.role === 'admin');
  const guruIpa = users.find(u => u.role === 'guru' && u.subject?.includes('IPA'));
  const guruMtk = users.find(u => u.role === 'guru' && u.subject?.includes('Matematika'));
  const siswaKls7 = users.find(u => u.role === 'siswa' && u.gradeLevel === '7');
  const siswaKls8 = users.find(u => u.role === 'siswa' && u.gradeLevel === '8');
  const siswaKls9 = users.find(u => u.role === 'siswa' && u.gradeLevel === '9');

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-10 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: School Information & Portal Description */}
        <div className="lg:col-span-6 space-y-6 text-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold border border-blue-200">
            <School className="w-4 h-4 text-blue-700" />
            <span>PORTAL ASESMEN & UJIAN TERPADU</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              LMS Ujian Digital <br />
              <span className="text-blue-700">{schoolConfig.name}</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Sistem Ujian Berbasis Komputer (CBT) & Penilaian Sumatif resmi untuk siswa{' '}
              <strong className="text-slate-900 font-semibold">Kelas 7, Kelas 8, dan Kelas 9</strong>.
              Mendukung pengawasan anti-cheat otomatis, rekapitulasi nilai instan, dan bank soal terpadu.
            </p>
          </div>

          {/* Key Features List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700">
                <strong className="font-semibold text-slate-900">3 Level Hak Akses:</strong> Siswa,
                Guru Pembuat Soal, dan Administrator Kurikulum Sekolah.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700">
                <strong className="font-semibold text-slate-900">CBT Engine Terstandar:</strong> Dilengkapi
                countdown timer, navigasi ragu-ragu/tuntas, dan deteksi berpindah tab jendela.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700">
                <strong className="font-semibold text-slate-900">Penilaian Otomatis & Analisis KKM:</strong> Skor
                langsung terhitung, analisis butir soal, dan unduh rekap nilai per kelas.
              </p>
            </div>
          </div>

          {/* Quick Demo Login Preset Buttons */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>PILIHAN 1-KLIK LOGIN DEMO:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {adminUser && (
                <button
                  type="button"
                  id="quick-demo-admin-btn"
                  onClick={() => loginAsUser(adminUser)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-left transition group shadow-2xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-rose-700">
                      Login Admin CBT
                    </span>
                    <span className="text-[11px] text-slate-500">Pak Suryanto (NIP Admin)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition" />
                </button>
              )}

              {guruIpa && (
                <button
                  type="button"
                  id="quick-demo-guru-btn"
                  onClick={() => loginAsUser(guruIpa)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-left transition group shadow-2xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-emerald-700">
                      Login Guru (IPA)
                    </span>
                    <span className="text-[11px] text-slate-500">Ibu Sri Wahyuni, M.Pd.</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
                </button>
              )}

              {siswaKls7 && (
                <button
                  type="button"
                  id="quick-demo-siswa7-btn"
                  onClick={() => loginAsUser(siswaKls7)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-left transition group shadow-2xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-blue-700">
                      Siswa Kelas 7 (7A)
                    </span>
                    <span className="text-[11px] text-slate-500">Ahmad Rifai Pratama</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </button>
              )}

              {siswaKls8 && (
                <button
                  type="button"
                  id="quick-demo-siswa8-btn"
                  onClick={() => loginAsUser(siswaKls8)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-left transition group shadow-2xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-blue-700">
                      Siswa Kelas 8 (8B)
                    </span>
                    <span className="text-[11px] text-slate-500">Siti Nurhaliza Azzahra</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </button>
              )}

              {siswaKls9 && (
                <button
                  type="button"
                  id="quick-demo-siswa9-btn"
                  onClick={() => loginAsUser(siswaKls9)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-left transition group shadow-2xs sm:col-span-2"
                >
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-blue-700">
                      Siswa Kelas 9 (9A - Try Out & Ujian Akhir)
                    </span>
                    <span className="text-[11px] text-slate-500">Budi Santoso Putra (NISN: 0063456789)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login Form */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
            {/* Role Switcher Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Pilih Peran Masuk (3 Login)
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  id="role-tab-siswa"
                  onClick={() => {
                    setSelectedRole('siswa');
                    setIdentifier('siswa7');
                    setErrorMessage('');
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-bold transition ${
                    selectedRole === 'siswa'
                      ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 mb-1 text-blue-600" />
                  Siswa
                </button>

                <button
                  type="button"
                  id="role-tab-guru"
                  onClick={() => {
                    setSelectedRole('guru');
                    setIdentifier('guru_ipa');
                    setErrorMessage('');
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-bold transition ${
                    selectedRole === 'guru'
                      ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <BookOpen className="w-4 h-4 mb-1 text-emerald-600" />
                  Guru
                </button>

                <button
                  type="button"
                  id="role-tab-admin"
                  onClick={() => {
                    setSelectedRole('admin');
                    setIdentifier('admin');
                    setErrorMessage('');
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-bold transition ${
                    selectedRole === 'admin'
                      ? 'bg-white text-rose-700 shadow-xs ring-1 ring-slate-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 mb-1 text-rose-600" />
                  Admin
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {selectedRole === 'siswa'
                    ? 'NISN Siswa / Username'
                    : selectedRole === 'guru'
                    ? 'NIP Guru / Username'
                    : 'NIP Administrator / Username'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="login-identifier-input"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === 'siswa'
                        ? 'Contoh: 0081234567 atau siswa7'
                        : selectedRole === 'guru'
                        ? 'Contoh: 198205142008012015 atau guru_ipa'
                        : 'Contoh: admin'
                    }
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {selectedRole === 'siswa'
                    ? 'Gunakan 10 digit NISN Anda sesuai kartu ujian.'
                    : 'Masukkan NIP 18 digit resmi sekolah.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    id="login-password-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Untuk akun demo prototipe, password dapat diisi apa saja.
                </p>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm text-white transition flex items-center justify-center gap-2 shadow-xs ${
                  selectedRole === 'siswa'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : selectedRole === 'guru'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <span>
                  Masuk Sebagai{' '}
                  {selectedRole === 'siswa' ? 'Siswa' : selectedRole === 'guru' ? 'Guru' : 'Admin'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Helper Hint */}
            <div className="mt-5 p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-slate-700 text-xs">
              <span className="font-bold text-blue-900 block mb-1">💡 Tips Akses Demo:</span>
              <ul className="space-y-0.5 text-[11px] text-slate-600 list-disc list-inside">
                <li>
                  <strong>Siswa Kelas 7:</strong> username <code>siswa7</code> / NISN <code>0081234567</code>
                </li>
                <li>
                  <strong>Siswa Kelas 8:</strong> username <code>siswa8</code> / NISN <code>0072345678</code>
                </li>
                <li>
                  <strong>Siswa Kelas 9:</strong> username <code>siswa9</code> / NISN <code>0063456789</code>
                </li>
                <li>
                  <strong>Guru IPA:</strong> username <code>guru_ipa</code>
                </li>
                <li>
                  <strong>Admin:</strong> username <code>admin</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
