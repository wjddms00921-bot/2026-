import React, { useState } from 'react';
import { KeyRound, ShieldAlert, ArrowRight } from 'lucide-react';
import { StudentAuth } from '../types';

interface AuthCardProps {
  onLogin: (auth: StudentAuth) => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ onLogin }) => {
  const [grade, setGrade] = useState<string>('');
  const [studentName, setStudentName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!grade || !studentName.trim()) {
      setError('학년(유치원)과 학생 이름을 입력해 주세요.');
      return;
    }

    if (!/^\d{4}$/.test(password)) {
      setError('비밀번호는 숫자 4자리로 입력해 주세요.');
      return;
    }

    onLogin({
      grade: grade === '유치원' ? '유치원' : Number(grade),
      studentName: studentName.trim(),
      password,
    });
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl border-4 border-[#4D96FF] relative flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="bg-[#4D96FF] text-white w-fit px-3.5 py-1 rounded-full text-xs font-bold mb-2 shadow-xs">
            가정 인증
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">가정별 로그인 &amp; 참여</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">유치원 ~ 6학년 자녀 학년과 이름으로 간편 로그인</span>
      </div>

      {/* 📢 Big Notice Banner on Login Screen */}
      <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-300 text-slate-950 rounded-2xl shadow-md border-2 border-amber-400 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
          🎁
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide">
              필독 주의사항
            </span>
            <span className="text-xs font-black text-slate-900">참여 가족 기념 선물 안내</span>
          </div>
          <p className="text-xs sm:text-sm font-black leading-snug text-slate-950">
            "행사종료 이후 학생편으로 커트러리 세트가 배부됩니다."
          </p>
          <p className="text-[11px] font-bold text-slate-800">
            ⚠️ <strong>(단, 한 가정당 1개씩 배부합니다)</strong> — 유치원·초등 형제자매 포함 가정당 1세트
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-rose-50 border-2 border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Grade Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">
            학년/구분 <span className="text-rose-500">*</span>
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-[#4D96FF] focus:bg-white outline-none font-bold text-slate-800 transition-all cursor-pointer"
          >
            <option value="">학년 또는 유치원을 선택해 주세요</option>
            <option value="유치원">유치원</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
            <option value="4">4학년</option>
            <option value="5">5학년</option>
            <option value="6">6학년</option>
          </select>
        </div>

        {/* Student Name */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">
            학생 이름 <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="자녀의 이름을 입력해 주세요 (예: 김민서)"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-[#4D96FF] focus:bg-white outline-none font-bold text-slate-800 transition-all"
          />
        </div>

        {/* 4-digit Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5 ml-1">
            <label className="block text-xs font-bold text-slate-700">
              비밀번호 (자유 숫자 4자리) <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
              💡 처음 입력한 4자리가 비밀번호가 됩니다
            </span>
          </div>
          <div className="relative">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="기억하기 쉬운 숫자 4자리 (예: 1234, 생일 등)"
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
              required
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm tracking-widest focus:border-[#4D96FF] focus:bg-white outline-none font-bold text-slate-800 transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400"
            />
            <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
          
          {/* Password Guide Box */}
          <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <span className="text-blue-500">📌</span>
              <span>비밀번호 입력 안내</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-600">
              • <strong>처음 작성 시</strong>: 기억하기 쉬운 <strong>아무 숫자 4자리</strong>(생일, 전화번호 뒷자리 등)를 정해 입력해 주세요.<br/>
              • <strong>제출 후 재방문 시</strong>: 내가 작성한 글을 조회하거나 수정할 때 <strong>위에서 정한 4자리</strong>를 입력하시면 열람할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 mt-3 bg-[#4D96FF] hover:bg-[#3b82f6] text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-base group cursor-pointer"
        >
          <span>미션 작성 &amp; 제출 조회하기</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};
