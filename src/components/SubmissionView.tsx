import React, { useState } from 'react';
import { CheckCircle2, Edit3, Calendar, Heart, Share2, Sparkles, Printer, User, Award } from 'lucide-react';
import { MissionSubmission, StudentAuth } from '../types';

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

  return (
    <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl border-4 border-[#6BCB77] space-y-6">
      {/* 1. 제출 완료 안내 헤더 */}
      <div className="bg-[#6BCB77] text-white rounded-[2rem] p-6 sm:p-7 shadow-md relative overflow-hidden">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white text-slate-800 flex items-center justify-center text-2xl shadow-md shrink-0">
              🎉
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-white/20 text-white mb-1 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>미션 제출 완료 (정상 접수)</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                이미 제출이 완료되었습니다!
              </h2>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs text-emerald-100 font-bold block">제출 일시</span>
            <span className="text-xs font-mono font-bold text-white">{formattedDate}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-emerald-50 mt-3.5 leading-relaxed bg-black/10 rounded-2xl p-3 border border-white/15 font-medium">
          옥동초등학교 양성평등주간 미션 <strong>'우리집 스위치 ON'</strong>에 참여해 주셔서 감사합니다.
          가족과 함께한 소중한 경험이 학생들의 마음에 큰 배움이 되었길 바랍니다. ❤️
        </p>
      </div>

      {/* 2. 제출 상세 내용 */}
      <div className="space-y-5">
        
        {/* 학생 및 가정 정보 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD93D] text-slate-900 flex items-center justify-center font-black text-sm border border-amber-300 shadow-inner">
              {submission.grade}
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold">참여 학생</div>
              <div className="text-sm sm:text-base font-black text-slate-900">
                {submission.grade}학년 {submission.classNum}반 {submission.studentNum}번 {submission.studentName} 학생 가정
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
            1. 서로 바꾼 역할
          </span>
          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
            <div className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <span className="text-orange-500">🔄</span>
              <span>{submission.roleSwapCategory}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed whitespace-pre-wrap font-medium">
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
