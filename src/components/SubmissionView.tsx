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
  const [activeTab, setActiveTab] = useState<'details' | 'notice'>('details');
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
    submission.classNum,
    submission.studentNum,
    submission.studentName
  );

  const gradeDisplay = formatGradeText(submission.grade);

  return (
    <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl border-4 border-[#6BCB77] space-y-6">
      {/* 1. 제출 완료 축하 배너 */}
      <div className="bg-[#6BCB77] text-white rounded-[2rem] p-6 sm:p-7 shadow-md relative overflow-hidden">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white text-slate-800 flex items-center justify-center text-2xl shadow-md shrink-0">
              🎉
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

        <p className="text-xs sm:text-sm text-emerald-50 mt-3.5 leading-relaxed bg-black/10 rounded-2xl p-3 border border-white/15 font-medium">
          옥동초등학교 양성평등주간 미션 <strong>'우리집 스위치 ON'</strong>에 정성껏 참여해 주셔서 감사합니다.
          가족과 함께한 따뜻한 경험이 아이들에게 멋진 양성평등의 가치로 남길 바랍니다. ❤️
        </p>
      </div>

      {/* 2. 상단 탭 네비게이션 (제출 내역 vs 제출 후 안내사항 & 선물) */}
      <div className="flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'details'
              ? 'bg-white text-slate-900 shadow-md border border-slate-200/80 scale-[1.01]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
          }`}
        >
          <FileText className="w-4 h-4 text-[#4D96FF]" />
          <span>📋 나의 미션 제출 내역</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notice')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 relative ${
            activeTab === 'notice'
              ? 'bg-white text-slate-900 shadow-md border border-slate-200/80 scale-[1.01]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-500" />
          <span>🎁 선물 배부 및 안내사항</span>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded-full font-bold border border-amber-300">
            필독
          </span>
        </button>
      </div>

      {/* 3. 탭 콘텐츠 영역 */}
      {activeTab === 'details' ? (
        /* TAB 1: 나의 미션 제출 내역 */
        <div className="space-y-5">
          {/* Quick Cutlery Notice Highlight Card */}
          <div
            onClick={() => setActiveTab('notice')}
            className="cursor-pointer bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100/80 hover:to-orange-100/80 border-2 border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-3 transition-all group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center text-xl shrink-0 shadow-sm">
                🍴
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                    주의사항 안내
                  </span>
                  <span className="text-xs font-bold text-amber-800">
                    행사종료 이후 학생편으로 커트러리 세트가 배부됩니다.
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-amber-700 mt-0.5 font-medium">
                  단, <strong>한 가정당 1개씩</strong> 배부됩니다. 자세한 배부 일정 및 안내를 확인해보세요!
                </p>
              </div>
            </div>
            <div className="text-amber-700 font-bold text-xs flex items-center gap-0.5 group-hover:translate-x-1 transition-transform shrink-0">
              <span className="hidden sm:inline">안내 보기</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* 학생 및 가정 정보 */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD93D] text-slate-900 flex items-center justify-center font-black text-xs sm:text-sm border border-amber-300 shadow-inner">
                {gradeDisplay}
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold">참여 학생 및 가정</div>
                <div className="text-sm sm:text-base font-black text-slate-900">
                  {studentTitle} 가정
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="text-xs px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-bold flex items-center gap-1.5 border border-slate-200"
                title="실천 기록 인쇄"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>기록 인쇄</span>
              </button>
              <button
                onClick={onEdit}
                className="text-xs px-4 py-2 rounded-xl bg-[#4D96FF] hover:bg-[#3b82f6] text-white transition-colors font-black flex items-center gap-1.5 shadow-md hover:shadow-lg"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>내용 수정하기</span>
              </button>
            </div>
          </div>

          {/* 바꾼 역할 */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 ml-1">
              1. 서로 바꾼 역할 (자유 실천 내용)
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
              <span className="text-[11px] text-slate-400 font-medium">터치하면 확대 보기</span>
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
                3. 가족 실천 소감문 ({submission.reflections.length}자)
              </span>
              <span className="text-[11px] text-green-600 font-bold bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                100자 이상 작성 완료 ✓
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
        /* TAB 2: 선물 배부 및 안내사항 탭 */
        <div className="space-y-5">
          
          {/* Main Notice Banner: Requirement Exact Sentence */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 border-4 border-amber-400 rounded-3xl shadow-md space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-black text-sm sm:text-base">
              <span className="p-1.5 bg-amber-400 text-slate-900 rounded-xl text-lg">📢</span>
              <span>양성평등주간 미션 참여 감사 안내 및 주의사항</span>
            </div>

            {/* Crucial Required Sentence Highlight */}
            <div className="p-4 bg-white rounded-2xl border-2 border-amber-300 shadow-inner">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black text-base shrink-0 mt-0.5">
                  !
                </div>
                <div>
                  <span className="text-xs font-black text-rose-600 uppercase tracking-wider block mb-1">
                    [필독 주의사항]
                  </span>
                  <p className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    "행사종료 이후 학생편으로 커트러리 세트가 배부됩니다. (단, 한 가정당 1개씩 배부합니다)"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Guidance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card 1: Gift Details */}
            <div className="p-5 bg-emerald-50/70 rounded-2xl border-2 border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                <Utensils className="w-5 h-5 text-emerald-600" />
                <span>🎁 기념 선물 안내</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>품목:</strong> 양성평등 실천 기념 친환경 커트러리 세트 (수저, 포크, 젓가락 &amp; 전용 휴대용 케이스)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>지급 대상:</strong> 유치원 및 1~6학년 미션 성실 참여 및 제출 가정</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>의미:</strong> 온 가족이 함께 식탁에서 식사를 나누고 역할을 분담하자는 따뜻한 약속의 의미를 담았습니다.</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Distribution Method */}
            <div className="p-5 bg-blue-50/70 rounded-2xl border-2 border-blue-200 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-black text-sm">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>🏫 배부 일정 및 수령 방법</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>제출 마감:</strong> 2026년 9월 11일(금) 23:59까지</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>배부 시기:</strong> 행사 마감 후 참여 명단 확인 후 9월 중순 배부</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>배부 방식:</strong> 각 학급 담임선생님을 통해 <strong>학생편으로 가정에 직접 전달</strong></span>
                </li>
              </ul>
            </div>

          </div>

          {/* Household Restriction Detailed Notice */}
          <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-black text-sm">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>자주 묻는 질문 (FAQ)</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 font-medium pt-1">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">
                  Q. 형제나 자매가 유치원과 초등학교에 각각 다니는데 선물은 어떻게 받나요?
                </div>
                <div className="text-slate-600 pl-2 border-l-2 border-amber-400">
                  A. 본 행사는 <strong>가정 단위</strong> 실천 프로그램으로 운영되며, <strong>한 가정당 1세트</strong>만 배부됩니다. 형제/자매 중 1명의 학생편으로 전달되오니 양해 부탁드립니다.
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">
                  Q. 이미 제출했는데 사진이나 소감을 바꾸고 싶어요.
                </div>
                <div className="text-slate-600 pl-2 border-l-2 border-amber-400">
                  A. 9월 11일 행사 마감 전까지 상단 <strong>[내용 수정하기]</strong> 버튼을 누르시면 언제든지 자유롭게 수정하여 다시 제출하실 수 있습니다.
                </div>
              </div>
            </div>
          </div>

          {/* Back button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setActiveTab('details')}
              className="px-5 py-2.5 bg-[#4D96FF] hover:bg-[#3b82f6] text-white text-xs sm:text-sm font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <span>📋 나의 제출 내역 확인하기</span>
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
                className="px-3 py-1 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700"
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
