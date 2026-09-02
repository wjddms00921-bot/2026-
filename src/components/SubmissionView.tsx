import React, { useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  Calendar,
  Heart,
  Share2,
  Sparkles,
  Printer,
  User,
  Award,
  Gift,
  Utensils,
  AlertTriangle,
  HelpCircle,
  FileText,
  Info,
  Clock,
  Check,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Smile,
  MessageCircle,
  Lightbulb,
  Home,
} from 'lucide-react';
import { MissionSubmission, StudentAuth, formatGradeText, formatStudentFullTitle } from '../types';

interface SubmissionViewProps {
  submission: MissionSubmission;
  currentUser: StudentAuth;
  onEdit: () => void;
}

export const SubmissionView: React.FC<SubmissionViewProps> = ({
  submission,
  currentUser,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'learning'>('details');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const formattedDate = new Date(submission.submittedAt).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const studentTitle = formatStudentFullTitle(
    submission.grade,
    submission.studentName,
    submission.classNum,
    submission.studentNum
  );

  const isKindergarten = String(submission.grade) === '유치원' || String(submission.grade) === '0';
  const gradeDisplay = formatGradeText(submission.grade);

  return (
    <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl border-4 border-[#6BCB77] space-y-6">
      {/* 1. 제출 완료 축하 및 교육 격려 배너 */}
      <div className="bg-gradient-to-br from-[#6BCB77] to-[#4AA958] text-white rounded-[2rem] p-6 sm:p-7 shadow-md relative overflow-hidden">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center text-2xl shadow-md shrink-0">
              🌱
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-white/20 text-white mb-1 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>미션 정상 접수 완료</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                소중한 가족 실천이 접수되었습니다!
              </h2>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs text-emerald-100 font-bold block">제출 일시</span>
            <span className="text-xs font-mono font-bold text-white">{formattedDate}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-emerald-50 mt-3.5 leading-relaxed bg-black/10 rounded-2xl p-3.5 border border-white/15 font-medium">
          옥동초등학교 양성평등주간 <strong>'우리집 스위치 ON - 온(溫)가족 행복 실천'</strong>에 동참해 주셔서 감사합니다.
          서로의 자리를 바꾸어보고 이해한 이번 실천은 우리 아이들이 <strong>배려와 평등의 소중한 가치</strong>를 마음에 새기는 훌륭한 배움의 밑거름이 됩니다. ❤️
        </p>
      </div>

      {/* 2. 상단 탭 네비게이션 */}
      <div className="flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'details'
              ? 'bg-white text-slate-900 shadow-md border border-slate-200/80 scale-[1.01]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
          }`}
        >
          <FileText className="w-4 h-4 text-[#4D96FF]" />
          <span>📋 나의 미션 실천 기록</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('learning')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'learning'
              ? 'bg-white text-slate-900 shadow-md border border-slate-200/80 scale-[1.01]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>🌱 실천의 배움 &amp; 행사 안내</span>
        </button>
      </div>

      {/* 3. 탭 콘텐츠 영역 */}
      {activeTab === 'details' ? (
        /* TAB 1: 나의 미션 실천 기록 */
        <div className="space-y-5">
          {/* Warm Educational Highlight Card */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl shrink-0 shadow-sm mt-0.5">
                💡
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                    가족 배움 실천
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    "가족의 역할을 바꾸며 서로의 수고로움을 이해하고 배려하는 시간"
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  남녀의 구분 없이 집안일과 역할을 함께 분담하는 경험을 통해, 아이들은 일상 속에서 자연스럽게 민주적이고 평등한 가치관을 배웁니다.
                </p>
              </div>
            </div>
          </div>

          {/* 학생 및 가정 정보 */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD93D] text-slate-900 flex items-center justify-center font-black text-xs sm:text-sm border border-amber-300 shadow-inner">
                {gradeDisplay}
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold">실천 참여 가정</div>
                <div className="text-sm sm:text-base font-black text-slate-900">
                  {studentTitle} 가정
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="text-xs px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-bold flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                title="실천 기록 인쇄"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>기록 인쇄</span>
              </button>
              <button
                onClick={onEdit}
                className="text-xs px-4 py-2 rounded-xl bg-[#4D96FF] hover:bg-[#3b82f6] text-white transition-colors font-black flex items-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>내용 수정하기</span>
              </button>
            </div>
          </div>

          {/* 바꾼 역할 */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 ml-1">
              1. 우리 가족이 서로 바꾼 역할 실천
            </span>
            <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 space-y-2">
              <div className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span className="text-orange-500 text-lg">🔄</span>
                <span>{submission.roleSwapCategory}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium pl-6 border-l-2 border-orange-300">
                {submission.roleSwapDetail}
              </p>
            </div>
          </div>

          {/* 활동 사진 갤러리 */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <span className="text-xs font-bold text-slate-500">
                2. 활동 인증 사진 ({submission.photos.length}장)
              </span>
              <span className="text-[11px] text-slate-400 font-medium">터치하면 원본 확대 보기</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {submission.photos.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(photo)}
                  className="cursor-pointer rounded-2xl overflow-hidden aspect-[4/3] border-2 border-slate-200 bg-slate-50 hover:shadow-md transition-all group relative"
                >
                  <img
                    src={photo}
                    alt={`활동 사진 ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                      확대 보기 🔍
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 가족 소감문 */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <span className="text-xs font-bold text-slate-500">
                3. {isKindergarten ? '아이/가족 실천 소감' : '가족 실천 소감문'} ({submission.reflections.length}자)
              </span>
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {isKindergarten ? '🐣 유치원 소감 작성 완료 ✓' : '100자 이상 작성 완료 ✓'}
              </span>
            </div>

            <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 relative">
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                {submission.reflections}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>옥동초 양성평등 가족 실천</span>
                </span>
                <span className="font-mono font-bold">{submission.reflections.length}자 작성됨</span>
              </div>
            </div>
          </div>

          {/* Subtle bottom cutlery reminder & guidance link */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-base">🍴</span>
              <span className="text-slate-700 font-medium">
                참여 기념 선물(커트러리 세트)은 행사 마감 후 학생편으로 가정당 1세트 배부됩니다.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('learning')}
              className="text-amber-800 font-bold shrink-0 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>배움 및 상세 안내 보기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Footer info */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-100 font-medium">
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span>본 제출물은 담당 선생님께 안전하게 전달되었습니다.</span>
            </span>
            <span>마감일(9월 11일)까지 언제든 수정 가능합니다.</span>
          </div>
        </div>
      ) : (
        /* TAB 2: 실천의 배움 & 행사 안내 */
        <div className="space-y-6">
          
          {/* Section 1: Core Educational Significance */}
          <div className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-blue-50 border-2 border-emerald-200 rounded-3xl space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-900 font-black text-base">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg shadow-sm">
                🌟
              </div>
              <span>'우리집 스위치 ON' 미션의 소중한 교육적 의미</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                  1
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">고정관념 허물기</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  "엄마 일", "아빠 일", "아이 일"로 고정되었던 집안일의 틀을 벗어나 누구든 함께 할 수 있음을 체험합니다.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-teal-100 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-black text-sm">
                  2
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">역지사지 공감과 감사</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  서로의 역할을 직접 대신해보며 평소 가족 구성원이 기울였던 정성과 노고를 깊이 이해하고 감사하게 됩니다.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-blue-100 shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">
                  3
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">민주적이고 평등한 가족</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  온 가족이 협력하여 가사를 분담하는 문화를 통해, 아이들은 일상 속에서 자연스러운 성평등 감수성을 기릅니다.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Family Dialogue Prompt */}
          <div className="p-5 sm:p-6 bg-amber-50/60 rounded-3xl border-2 border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-black text-sm sm:text-base">
              <MessageCircle className="w-5 h-5 text-amber-600" />
              <span>💬 온 가족이 함께 나누는 따뜻한 대화 가이드</span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              미션을 마친 후 저녁 식사나 가족 모임 시간에 아래 질문으로 서로의 생각을 나누어보세요.
            </p>

            <div className="space-y-2 pt-1 text-xs sm:text-sm">
              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 flex items-start gap-2.5">
                <span className="text-amber-500 font-bold shrink-0">Q1.</span>
                <span className="text-slate-800 font-semibold">
                  "오늘 바꾼 역할을 직접 해보면서 생각보다 힘들었거나 재미있었던 점은 무엇이었나요?"
                </span>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 flex items-start gap-2.5">
                <span className="text-amber-500 font-bold shrink-0">Q2.</span>
                <span className="text-slate-800 font-semibold">
                  "우리 가족이 앞으로 서로를 더 많이 돕고 배려하기 위해 매일 실천할 수 있는 작은 약속은 무엇일까요?"
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Event & Gift Distribution Notice */}
          <div className="p-5 sm:p-6 bg-slate-50 rounded-3xl border-2 border-slate-200 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm sm:text-base">
                <Gift className="w-5 h-5 text-purple-600" />
                <span>행사 안내 및 참여 기념 선물 배부</span>
              </div>
              <span className="text-xs text-purple-700 bg-purple-100 font-bold px-2.5 py-0.5 rounded-full">
                옥동초등학교 양성평등주간
              </span>
            </div>

            {/* Exact Required Sentence with context */}
            <div className="p-4 bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 rounded-2xl border-2 border-amber-300 space-y-1">
              <div className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                <span className="p-1 bg-amber-400 text-slate-950 rounded-md text-xs">📢</span>
                <span>배부 안내 및 유의사항</span>
              </div>
              <p className="text-sm sm:text-base font-black text-slate-950 leading-snug pt-1">
                "행사종료 이후 학생편으로 커트러리 세트가 배부됩니다."
              </p>
              <p className="text-xs font-bold text-rose-600">
                (단, 한 가정당 1개씩 배부합니다 — 형제/자매 중복 수령 제한)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 font-medium">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-400 font-bold block">선물의 상징적 의미</span>
                <p className="text-slate-800 font-bold">
                  친환경 커트러리(수저·포크·젓가락) 세트
                </p>
                <p className="text-xs text-slate-500">
                  온 가족이 둘러앉아 따뜻한 밥상을 나누며, 식사 준비와 정리를 함께 분담하자는 약속을 담았습니다.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-400 font-bold block">배부 일정 및 방식</span>
                <p className="text-slate-800 font-bold">
                  9월 11일(금) 행사 마감 후 9월 중순 전달
                </p>
                <p className="text-xs text-slate-500">
                  각 학급 담임선생님을 통해 학생편으로 가정에 안전하게 전달됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: FAQ */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs sm:text-sm">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>자주 묻는 질문 (FAQ)</span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 font-medium pt-1">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">
                  Q. 형제나 자매가 유치원과 초등학교에 각각 다니는데 선물은 어떻게 받나요?
                </div>
                <div className="text-slate-600 pl-2 border-l-2 border-amber-400">
                  A. 본 행사는 <strong>가정 단위</strong> 실천 프로그램으로 운영되며, <strong>한 가정당 1세트</strong>만 배부됩니다. 형제/자매 중 1명의 학생편으로 전달됩니다.
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">
                  Q. 이미 제출했는데 사진이나 소감을 바꾸고 싶어요.
                </div>
                <div className="text-slate-600 pl-2 border-l-2 border-amber-400">
                  A. 9월 11일 행사 마감 전까지 상단 <strong>[내용 수정하기]</strong> 버튼을 누르시면 언제든지 자유롭게 수정하실 수 있습니다.
                </div>
              </div>
            </div>
          </div>

          {/* Back button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setActiveTab('details')}
              className="px-5 py-2.5 bg-[#4D96FF] hover:bg-[#3b82f6] text-white text-xs sm:text-sm font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>📋 나의 실천 기록 보기</span>
            </button>
          </div>

        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto}
              alt="확대 사진"
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
            />
            <div className="p-3 flex justify-between items-center">
              <span className="text-xs text-slate-600 font-semibold">활동 인증 사진 원본</span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-3 py-1 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

