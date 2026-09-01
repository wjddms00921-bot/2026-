import React from 'react';
import { X, BookOpen, Sparkles, CheckCircle2, Heart, Award, ShieldCheck, Gift, Utensils } from 'lucide-react';

interface EventGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventGuideModal: React.FC<EventGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-amber-100 my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-2xl text-xl backdrop-blur-sm">
              💡
            </div>
            <div>
              <div className="text-xs text-amber-100 font-semibold">옥동초등학교 교육공동체 행사</div>
              <h3 className="font-bold text-base sm:text-lg">양성평등주간 미션 '우리집 스위치 ON' 안내</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5 custom-scrollbar text-xs sm:text-sm text-slate-700">
          
          {/* Mission Objective */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 text-sm sm:text-base">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>미션 기획 의도: '우리집 스위치 ON'이란?</span>
            </div>
            <p className="leading-relaxed text-slate-700">
              가정 내에서 고정관념처럼 굳어져 있던 역할을 하루 동안 서로 바꾸어(Switch) 자유롭게 실천해 봄으로써,
              서로의 수고로움을 이해하고 존중과 배려의 양성평등 가치를 체험하는 옥동초등학교 가족(유치원 및 1~6학년) 참여형 프로젝트입니다.
            </p>
          </div>

          {/* Gift Notice (Required Caution) */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
              <Gift className="w-5 h-5 text-amber-600" />
              <span>🎁 참여 가족 기념 선물 및 필독 주의사항</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-300 font-black text-slate-900 text-xs sm:text-sm">
              "행사종료 이후 학생편으로 커트러리 세트가 배부됩니다. (단, 한 가정당 1개씩 배부합니다)"
            </div>
            <p className="text-[11px] text-amber-800 font-medium">
              * 정성껏 미션을 수행하고 제출을 완료한 가정에 친환경 커트러리 세트(수저·포크·케이스)가 전달됩니다.
            </p>
          </div>

          {/* Mission Steps */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>참여 방법 4단계</span>
            </h4>

            <div className="space-y-2.5">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-slate-800 block text-xs sm:text-sm">틀 없이 자유롭게 가족 역할 바꾸기</strong>
                  <span className="text-slate-600 text-xs">정해진 틀 없이 우리 가족만의 특별한 역할 바꾸기를 자유롭게 계획하고 실천합니다.</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-slate-800 block text-xs sm:text-sm">역할 수행 &amp; 인증 사진 촬영</strong>
                  <span className="text-slate-600 text-xs">바꾼 역할을 즐겁게 실천하는 모습을 사진으로 1장 이상 남겨주세요.</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-slate-800 block text-xs sm:text-sm">가족 소감문 100자 이상 작성</strong>
                  <span className="text-slate-600 text-xs">직접 역할을 바꾸어 보고 느낀 점, 감사한 마음을 솔직하게 100자 이상 적어주세요.</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">4</span>
                <div>
                  <strong className="text-slate-800 block text-xs sm:text-sm">웹앱 로그인 후 제출</strong>
                  <span className="text-slate-600 text-xs">유치원 또는 1~6학년 자녀 정보와 4자리 비밀번호로 로그인하여 제출 완료합니다.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>안내 및 유의사항</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-emerald-800/90 leading-relaxed pl-1 font-medium">
              <li><strong>제출 마감일:</strong> 9월 11일(금) 23:59까지</li>
              <li><strong>참여 대상:</strong> 옥동초등학교 병설유치원 및 1~6학년 전체 재학생 가정</li>
              <li><strong>개인정보 보호:</strong> 제출된 모든 내용은 담당 교사 외에 절대 외부에 공개되지 않습니다.</li>
              <li><strong>수정 안내:</strong> 마감일 전까지는 언제든 로그인하여 제출 내용을 보완하거나 수정할 수 있습니다.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            확인했습니다
          </button>
        </div>

      </div>
    </div>
  );
};
