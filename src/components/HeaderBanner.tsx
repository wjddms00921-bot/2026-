import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, BookOpen, ShieldCheck, Code2, Lock } from 'lucide-react';
import { DDayInfo } from '../types';

interface HeaderBannerProps {
  onOpenGuide: () => void;
  onOpenTeacher: () => void;
  onOpenSingleHtml: () => void;
  onOpenFirebaseRules: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  onOpenGuide,
  onOpenTeacher,
  onOpenSingleHtml,
  onOpenFirebaseRules,
}) => {
  const [dday, setDday] = useState<DDayInfo>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    targetDateStr: '9월 11일 23:59:59',
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let target = new Date(currentYear, 8, 11, 23, 59, 59); // September is month index 8

      // If already past in the same year, evaluate next year for continuity
      if (now > target && now.getMonth() > 8) {
        target = new Date(currentYear + 1, 8, 11, 23, 59, 59);
      }

      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setDday({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          targetDateStr: '9월 11일 23:59:59',
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setDday({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
        targetDateStr: '9월 11일 23:59:59',
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#FFD93D] text-slate-800 shadow-md border-b-2 border-amber-300">
      {/* Top Main Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* School Brand & Title */}
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-inner border border-amber-200 shrink-0">
              🏫
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-slate-700 tracking-wide">
                <span>옥동초등학교</span>
                <span className="opacity-50">•</span>
                <span className="bg-white/80 text-amber-900 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs">양성평등주간</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5 justify-center sm:justify-start">
                우리집 스위치 ON
                <span className="text-xs font-bold text-slate-700 hidden sm:inline">(역할 바꾸기 미션)</span>
              </h1>
            </div>
          </div>

          {/* D-Day Counter (Vibrant Pulse Badge) */}
          <div className="flex items-center gap-2.5">
            <div className={`px-4 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2 transition-all ${
              dday.isExpired 
                ? 'bg-slate-800 text-white' 
                : 'bg-red-500 text-white animate-pulse'
            }`}>
              <Clock className="w-4 h-4 text-white" />
              <span>
                {dday.isExpired ? (
                  'D-DAY 마감됨'
                ) : dday.days === 0 ? (
                  'D-DAY 오늘 23:59 마감!'
                ) : (
                  `D-DAY 9월 11일 마감 (${dday.days}일 남음)`
                )}
              </span>
            </div>
          </div>

        </div>

        {/* Action quick links */}
        <div className="mt-3 pt-2.5 border-t border-amber-400/60 flex items-center justify-between text-xs overflow-x-auto gap-2 py-0.5 scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-800 transition-colors font-bold shadow-xs border border-amber-200"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#4D96FF]" />
              <span>미션 안내</span>
            </button>
            <button
              onClick={onOpenTeacher}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-800 transition-colors font-bold shadow-xs border border-amber-200"
            >
              <Lock className="w-3.5 h-3.5 text-rose-500" />
              <span>교사(관리자) 모드</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenFirebaseRules}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-800 transition-colors font-bold shadow-xs border border-amber-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#6BCB77]" />
              <span>보안 규칙 가이드</span>
            </button>
            <button
              onClick={onOpenSingleHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4D96FF] hover:bg-[#3b82f6] text-white transition-colors font-bold shadow-sm"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>단일 HTML 코드</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
