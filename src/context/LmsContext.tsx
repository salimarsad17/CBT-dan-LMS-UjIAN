import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Exam, ExamSubmission, SchoolConfig, UserRole, GradeLevel } from '../types';
import {
  INITIAL_USERS,
  INITIAL_EXAMS,
  INITIAL_SUBMISSIONS,
  INITIAL_SCHOOL_CONFIG,
} from '../data/initialData';

interface LmsContextType {
  currentUser: User | null;
  users: User[];
  exams: Exam[];
  submissions: ExamSubmission[];
  schoolConfig: SchoolConfig;
  
  // Navigation & UI state
  activeRole: UserRole | null;
  activeView: string;
  setActiveView: (view: string) => void;
  
  // CBT Engine State
  currentExam: Exam | null;
  examAnswers: Record<string, string>;
  examDoubtful: Record<string, boolean>;
  examViolations: number;
  examStartedAt: number | null;
  lastCompletedSubmission: ExamSubmission | null;
  
  // Actions
  login: (identifier: string, role?: UserRole) => { success: boolean; message?: string };
  loginAsUser: (user: User) => void;
  logout: () => void;
  quickSwitchUser: (role: UserRole, grade?: GradeLevel) => void;
  
  // Exam student actions
  startExamWithToken: (examId: string, token: string) => { success: boolean; message?: string };
  answerQuestion: (questionId: string, answer: string) => void;
  toggleDoubtful: (questionId: string) => void;
  registerExamViolation: () => void;
  submitExam: () => ExamSubmission | null;
  exitExamEarly: () => void;
  viewSubmissionDetails: (submission: ExamSubmission) => void;
  
  // Guru / Admin exam actions
  addExam: (exam: Omit<Exam, 'id' | 'createdAt'>) => Exam;
  updateExam: (exam: Exam) => void;
  deleteExam: (examId: string) => void;
  togglePublishExam: (examId: string) => void;
  
  // User Management
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  
  // Settings
  updateSchoolConfig: (config: Partial<SchoolConfig>) => void;
  resetAllData: () => void;
}

const LmsContext = createContext<LmsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'smpn_cbt_users_v2',
  EXAMS: 'smpn_cbt_exams_v2',
  SUBMISSIONS: 'smpn_cbt_submissions_v2',
  SCHOOL: 'smpn_cbt_school_v2',
  ACTIVE_USER: 'smpn_cbt_active_user_v2',
};

export const LmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  const [submissions, setSubmissions] = useState<ExamSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHOOL);
      return saved ? JSON.parse(saved) : INITIAL_SCHOOL_CONFIG;
    } catch {
      return INITIAL_SCHOOL_CONFIG;
    }
  });

  // Current logged in user (Default to Siswa Kelas 7 for instant preview, or saved)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      if (saved) return JSON.parse(saved);
      // Default to student 7A for immediate friendly experience
      return INITIAL_USERS.find(u => u.username === 'siswa7') || INITIAL_USERS[4];
    } catch {
      return INITIAL_USERS[4];
    }
  });

  const [activeView, setActiveView] = useState<string>('dashboard');

  // Exam CBT Session State
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examDoubtful, setExamDoubtful] = useState<Record<string, boolean>>({});
  const [examViolations, setExamViolations] = useState<number>(0);
  const [examStartedAt, setExamStartedAt] = useState<number | null>(null);
  const [lastCompletedSubmission, setLastCompletedSubmission] = useState<ExamSubmission | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [exams]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(schoolConfig));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [schoolConfig]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [currentUser]);

  // Login handler
  const login = (identifier: string, role?: UserRole): { success: boolean; message?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const foundUser = users.find(u => {
      const matchId = u.identifier.toLowerCase() === cleanId;
      const matchUsername = u.username.toLowerCase() === cleanId;
      if (role) {
        return (matchId || matchUsername) && u.role === role;
      }
      return matchId || matchUsername;
    });

    if (foundUser) {
      setCurrentUser(foundUser);
      setActiveView('dashboard');
      setCurrentExam(null);
      return { success: true };
    }

    return {
      success: false,
      message: 'NISN / NIP / Username tidak ditemukan. Silakan cek kembali atau gunakan tombol Demo Login.',
    };
  };

  const loginAsUser = (user: User) => {
    setCurrentUser(user);
    setActiveView('dashboard');
    setCurrentExam(null);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentExam(null);
    setActiveView('login');
  };

  const quickSwitchUser = (role: UserRole, grade?: GradeLevel) => {
    let targetUser: User | undefined;
    if (role === 'admin') {
      targetUser = users.find(u => u.role === 'admin');
    } else if (role === 'guru') {
      targetUser = users.find(u => u.role === 'guru');
    } else if (role === 'siswa') {
      if (grade) {
        targetUser = users.find(u => u.role === 'siswa' && u.gradeLevel === grade);
      }
      if (!targetUser) {
        targetUser = users.find(u => u.role === 'siswa');
      }
    }

    if (targetUser) {
      setCurrentUser(targetUser);
      setCurrentExam(null);
      setActiveView('dashboard');
    }
  };

  // Student CBT Methods
  const startExamWithToken = (examId: string, token: string): { success: boolean; message?: string } => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) {
      return { success: false, message: 'Ujian tidak ditemukan.' };
    }

    if (!exam.isPublished) {
      return { success: false, message: 'Ujian ini belum dipublikasikan oleh guru pengampu.' };
    }

    if (exam.token.trim().toUpperCase() !== token.trim().toUpperCase()) {
      return {
        success: false,
        message: `Token ujian tidak valid! Token yang benar adalah "${exam.token}".`,
      };
    }

    // Check if student already submitted this exam
    if (currentUser) {
      const alreadySubmitted = submissions.some(
        s => s.examId === exam.id && s.studentId === currentUser.id
      );
      if (alreadySubmitted) {
        return {
          success: false,
          message: 'Anda sudah pernah menyelesaikan dan mengirimkan hasil ujian ini.',
        };
      }
    }

    // Initialize CBT session
    setCurrentExam(exam);
    setExamAnswers({});
    setExamDoubtful({});
    setExamViolations(0);
    setExamStartedAt(Date.now());
    setActiveView('exam-cbt');

    return { success: true };
  };

  const answerQuestion = (questionId: string, answer: string) => {
    setExamAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const toggleDoubtful = (questionId: string) => {
    setExamDoubtful(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const registerExamViolation = () => {
    setExamViolations(prev => prev + 1);
  };

  const submitExam = (): ExamSubmission | null => {
    if (!currentExam || !currentUser) return null;

    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;

    currentExam.questions.forEach(q => {
      const studentAnswer = examAnswers[q.id];
      if (studentAnswer === q.correctAnswer) {
        totalScore += q.score;
        correctCount += 1;
      } else {
        wrongCount += 1;
      }
    });

    const maxScore = currentExam.questions.reduce((acc, q) => acc + q.score, 0);
    // Normalize to 0-100 scale if needed
    const finalScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const isPassed = finalScore >= currentExam.passingGrade;

    const timeSpent = examStartedAt ? Math.round((Date.now() - examStartedAt) / 1000) : 0;

    const submission: ExamSubmission = {
      id: `sub-${Date.now()}`,
      examId: currentExam.id,
      examTitle: currentExam.title,
      subject: currentExam.subject,
      gradeLevel: currentExam.gradeLevel,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentNisn: currentUser.identifier,
      studentClass: currentUser.className || `${currentExam.gradeLevel}A`,
      answers: { ...examAnswers },
      doubtfulStatus: { ...examDoubtful },
      totalQuestions: currentExam.questions.length,
      correctAnswersCount: correctCount,
      wrongAnswersCount: wrongCount,
      score: finalScore,
      isPassed,
      startedAt: examStartedAt ? new Date(examStartedAt).toISOString() : new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      violationCount: examViolations,
      timeSpentSeconds: timeSpent,
    };

    setSubmissions(prev => [submission, ...prev]);
    setLastCompletedSubmission(submission);
    setCurrentExam(null);
    setActiveView('exam-result');

    return submission;
  };

  const exitExamEarly = () => {
    setCurrentExam(null);
    setActiveView('dashboard');
  };

  const viewSubmissionDetails = (submission: ExamSubmission) => {
    setLastCompletedSubmission(submission);
    setActiveView('exam-result');
  };

  // Exam CRUD
  const addExam = (examData: Omit<Exam, 'id' | 'createdAt'>): Exam => {
    const newExam: Exam = {
      ...examData,
      id: `exam-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setExams(prev => [newExam, ...prev]);
    return newExam;
  };

  const updateExam = (updated: Exam) => {
    setExams(prev => prev.map(e => (e.id === updated.id ? updated : e)));
  };

  const deleteExam = (examId: string) => {
    setExams(prev => prev.filter(e => e.id !== examId));
  };

  const togglePublishExam = (examId: string) => {
    setExams(prev =>
      prev.map(e => (e.id === examId ? { ...e, isPublished: !e.isPublished } : e))
    );
  };

  // User Management
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (updated: User) => {
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    if (currentUser?.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const updateSchoolConfig = (config: Partial<SchoolConfig>) => {
    setSchoolConfig(prev => ({ ...prev, ...config }));
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.EXAMS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.SCHOOL);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);

    setUsers(INITIAL_USERS);
    setExams(INITIAL_EXAMS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setSchoolConfig(INITIAL_SCHOOL_CONFIG);
    setCurrentUser(INITIAL_USERS[4]); // Siswa 7A
    setCurrentExam(null);
    setActiveView('dashboard');
  };

  return (
    <LmsContext.Provider
      value={{
        currentUser,
        users,
        exams,
        submissions,
        schoolConfig,
        activeRole: currentUser?.role || null,
        activeView,
        setActiveView,
        currentExam,
        examAnswers,
        examDoubtful,
        examViolations,
        examStartedAt,
        lastCompletedSubmission,
        login,
        loginAsUser,
        logout,
        quickSwitchUser,
        startExamWithToken,
        answerQuestion,
        toggleDoubtful,
        registerExamViolation,
        submitExam,
        exitExamEarly,
        viewSubmissionDetails,
        addExam,
        updateExam,
        deleteExam,
        togglePublishExam,
        addUser,
        updateUser,
        deleteUser,
        updateSchoolConfig,
        resetAllData,
      }}
    >
      {children}
    </LmsContext.Provider>
  );
};

export const useLms = (): LmsContextType => {
  const context = useContext(LmsContext);
  if (!context) {
    throw new Error('useLms must be used within a LmsProvider');
  }
  return context;
};
