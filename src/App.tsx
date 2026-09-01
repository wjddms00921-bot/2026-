import React, { useState, useEffect } from 'react';
import { HeaderBanner } from './components/HeaderBanner';
import { AuthCard } from './components/AuthCard';
import { SubmissionForm } from './components/SubmissionForm';
import { SubmissionView } from './components/SubmissionView';
import { TeacherAdminModal } from './components/TeacherAdminModal';
import { SingleFileCodeModal } from './components/SingleFileCodeModal';
import { FirebaseRulesModal } from './components/FirebaseRulesModal';
import { EventGuideModal } from './components/EventGuideModal';
import {
  getStoredSubmissions,
  saveSubmissionToCloudAndLocal,
  findSubmissionByStudentKey,
  makeStudentKey,
  getStoredUser,
  setStoredUser,
  subscribeToSubmissions,
} from './lib/storage';
import { StudentAuth, MissionSubmission, formatGradeText, formatStudentFullTitle } from './types';
import { Sparkles, LogOut, CheckCircle2, UserCheck, Heart, Gift, Utensils, Cloud } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<StudentAuth | null>(null);
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([]);
  const [currentSubmission, setCurrentSubmission] = useState<MissionSubmission | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isTeacherOpen, setIsTeacherOpen] = useState(false);
  const [isSingleHtmlOpen, setIsSingleHtmlOpen] = useState(false);
  const [isFirebaseRulesOpen, setIsFirebaseRulesOpen] = useState(false);

  // Real-time Firestore subscription
  useEffect(() => {
    // Initial local read
    const localList = getStoredSubmissions();
    setSubmissions(localList);

    const savedUser = getStoredUser();
    if (savedUser) {
      setCurrentUser(savedUser);
      const studentKey = makeStudentKey(savedUser.grade, savedUser.studentName);
      const sub = localList.find((s) => s.studentKey === studentKey);
      setCurrentSubmission(sub || null);
    }

    // Subscribe to cloud updates in real-time
    const unsubscribe = subscribeToSubmissions((cloudList) => {
      setSubmissions(cloudList);
      if (savedUser || currentUser) {
        const activeUser = currentUser || savedUser;
        if (activeUser) {
          const key = makeStudentKey(activeUser.grade, activeUser.studentName);
          const found = cloudList.find((s) => s.studentKey === key);
          if (found) {
            setCurrentSubmission(found);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser?.studentName, currentUser?.grade]);

  // Handle Login
  const handleLogin = (auth: StudentAuth) => {
    setCurrentUser(auth);
    setStoredUser(auth);

    const studentKey = makeStudentKey(auth.grade, auth.studentName);
    const existing = submissions.find(s => s.studentKey === studentKey) || findSubmissionByStudentKey(studentKey);

    if (existing) {
      setCurrentSubmission(existing);
      setIsEditMode(false);
    } else {
      setCurrentSubmission(null);
      setIsEditMode(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentSubmission(null);
    setIsEditMode(false);
    setStoredUser(null);
  };

  // Handle Submission Save / Edit
  const handleSubmitSuccess = async (submission: MissionSubmission) => {
    setIsSyncing(true);
    try {
      await saveSubmissionToCloudAndLocal(submission);
      setCurrentSubmission(submission);
      setIsEditMode(false);
    } catch (e) {
      console.error('Submission sync error:', e);
      // Even if cloud fails, state is already saved locally
      setCurrentSubmission(submission);
      setIsEditMode(false);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBEB] text-slate-800 antialiased font-sans">
      
      {/* Top D-Day & Navigation Banner */}
      <HeaderBanner
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenTeacher={() => setIsTeacherOpen(true)}
        onOpenSingleHtml={() => setIsSingleHtmlOpen(true)}
        onOpenFirebaseRules={() => setIsFirebaseRulesOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Logged in Family Profile Bar */}
        {currentUser && (
          <div className="mb-6 bg-white border-2 border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD93D] text-slate-900 flex items-center justify-center font-black text-xs sm:text-sm shadow-inner border border-amber-300">
                {formatGradeText(currentUser.grade)}
              </div>
              <div>
                <div className="text-xs text-slate-500 font-bold">현재 접속 중인 가정</div>
                <div className="text-sm sm:text-base font-black text-slate-900">
                  {formatStudentFullTitle(currentUser.grade, currentUser.studentName)} 가정
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-xs px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 transition-colors font-bold flex items-center gap-1.5 border border-slate-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        )}

        {/* Dynamic Main View with Side-by-Side Vibrant Card Layout on Large Screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Mission Overview & Guide Card (Green Accent: #6BCB77) */}
          <section className="lg:col-span-4 bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl border-4 border-[#6BCB77] flex flex-col justify-between space-y-6">
            <div>
              <div className="bg-[#6BCB77] text-white w-fit px-4 py-1 rounded-full text-xs sm:text-sm font-black mb-4 shadow-sm">
                미션 안내
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">
                '우리집 <br className="hidden sm:inline" />스위치 ON'
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                유치원부터 6학년까지 모든 가족이 틀 없이 자유롭게 역할을 바꾸어 생활해보고 서로의 마음을 이해해보는 따뜻한 양성평등 실천 캠페인입니다.
              </p>

              <ul className="mt-6 space-y-3.5">
                <li className="flex items-start space-x-3">
                  <span className="bg-orange-100 text-orange-600 rounded-full p-1 text-xs font-bold shrink-0">✓</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-700">자유롭게 가족 간 역할 바꾸기 내용 작성</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-orange-100 text-orange-600 rounded-full p-1 text-xs font-bold shrink-0">✓</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-700">활동 인증 사진 1장 이상 업로드</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="bg-orange-100 text-orange-600 rounded-full p-1 text-xs font-bold shrink-0">✓</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-700">솔직한 소감문 100자 이상 작성</span>
                </li>
              </ul>
            </div>

            {/* Gift & Notice Card */}
            <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 text-xs text-amber-900 leading-relaxed space-y-1.5 font-medium">
              <div className="flex items-center gap-1.5 font-black text-amber-950">
                <Gift className="w-4 h-4 text-amber-600" />
                <span>기념 선물 배부 안내 (주의사항)</span>
              </div>
              <p className="text-[11px] text-amber-800 font-bold bg-white/80 p-2 rounded-xl border border-amber-200">
                "행사종료 이후 학생편으로 커트러리 세트가 배부됩니다. (단, 한 가정당 1개씩 배부합니다)"
              </p>
            </div>
          </section>

          {/* Right Column: Dynamic Interactive Area (Blue Accent: #4D96FF) */}
          <div className="lg:col-span-8">
            {!currentUser ? (
              /* Step 1: Login / Authentication */
              <AuthCard onLogin={handleLogin} />
            ) : currentSubmission && !isEditMode ? (
              /* Step 2: Already submitted view (조회 모드) */
              <SubmissionView
                submission={currentSubmission}
                currentUser={currentUser}
                onEdit={() => setIsEditMode(true)}
              />
            ) : (
              /* Step 3: Submission Form (신규 작성 또는 수정 모드) */
              <SubmissionForm
                currentUser={currentUser}
                existingSubmission={currentSubmission}
                onSubmit={handleSubmitSuccess}
                onCancel={currentSubmission ? () => setIsEditMode(false) : undefined}
              />
            )}
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-8 px-6 py-5 bg-white/70 border-t border-amber-200 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="font-medium">© 2026 옥동초등학교 양성평등주간 교육활동. 본 서비스는 가정 체험 학습 용도로 사용됩니다.</p>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
          <button onClick={() => setIsTeacherOpen(true)} className="hover:text-amber-600">관리자 로그인</button>
          <span>•</span>
          <button onClick={() => setIsGuideOpen(true)} className="hover:text-amber-600">개인정보보호 안내</button>
        </div>
      </footer>

      {/* Modals */}
      <EventGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <TeacherAdminModal
        isOpen={isTeacherOpen}
        onClose={() => setIsTeacherOpen(false)}
        submissions={submissions}
      />
      <SingleFileCodeModal
        isOpen={isSingleHtmlOpen}
        onClose={() => setIsSingleHtmlOpen(false)}
      />
      <FirebaseRulesModal
        isOpen={isFirebaseRulesOpen}
        onClose={() => setIsFirebaseRulesOpen(false)}
      />

    </div>
  );
}
