import React, { useState } from 'react';
import { Home, KeyRound, Sparkles, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import { StudentAuth } from '../types';

interface AuthCardProps {
  onLogin: (auth: StudentAuth) => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ onLogin }) => {
  const [grade, setGrade] = useState<string>('');
  const [classNum, setClassNum] = useState<string>('');
  const [studentNum, setStudentNum] = useState<string>('');
  const [studentName, setStudentName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!grade || !classNum || !studentNum || !studentName.trim()) {
      setError('학년(유치원), 반, 번호, 학생 이름을 모두 입력해 주세요.');
      return;
    }

    if (!/^\d{4}$/.test(password)) {
      setError('비밀번호는 숫자 4자리로 입력해 주세요.');
      return;
    }

    onLogin({
      grade: grade === '유치원' ? '유치원' : Number(grade),
      classNum: Number(classNum),
      studentNum: Number(studentNum),
      studentName: studentName.trim(),
      password,
    });
  };

  const handleQuickDemo = (
    demoGrade: string | number,
    demoClass: number,
    demoNum: number,
    demoName: string,
    demoPw: string
  ) => {
    setGrade(String(demoGrade));
    setClassNum(String(demoClass));
    setStudentNum(String(demoNum));
    setStudentName(demoName);
    setPassword(demoPw);
    setError(null);
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
        <span className="text-xs text-slate-400 font-medium">유치원 ~ 6학년 자녀 학적 정보로 간편 로그인</span>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-rose-50 border-2 border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Grade / Class / Number */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">
              학년/과정 <span className="text-rose-500">*</span>
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-2.5 sm:px-4 py-3 text-sm focus:border-[#4D96FF] focus:bg-white outline-none font-bold text-slate-800 transition-all"
            >
              <option value="">선택</option>
              <option value="유치원">유치원</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
              <option value="4">4학년</option>
              <option value="5">5학년</option>
              <option value="6">6학년</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">
              반 <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="20"
              placeholder="예: 2"
              value={classNum}
              onChange={(e) => setClassNum(e.target.value)}
              required
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 sm:px-4 py-3 text-sm focus:border-[#4D96FF] focus:bg-white outline-none font-bold text-slate-800 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">
              번호 <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="50"
              placeholder="예: 14"
              value={studentNum}
              onChange={(e) => setStudentNum(e.target.value)}
              required
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 sm:px-4 py-3 text-sm focus:border-[#4D96FF] focus:bg-white outline-none font-bold text-slate-800 transition-all"
            />
          </div>
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
          <div className="flex justify-between items-center mb-1 ml-1">
            <label className="block text-xs font-bold text-slate-500">
              비밀번호 (숫자 4자리) <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-normal">
              제출물 조회 및 수정 시 확인용
            </span>
          </div>
          <div className="relative">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="4자리 숫자 입력 (예: 1234)"
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
              required
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm tracking-widest focus:border-[#4D96FF] focus:bg-white outline-none font-bold text-slate-800 transition-all"
            />
            <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
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

      {/* Quick Demo family test chips */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>샘플 계정으로 바로 체험해보기 (클릭 시 자동 입력)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('유치원', 1, 3, '이사랑', '1234')}
            className="text-xs px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold border border-emerald-300 transition-colors flex items-center gap-1"
          >
            <span>🐣 유치원 1반 3번 이사랑 (제출완료)</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo(3, 2, 14, '김민서', '1234')}
            className="text-xs px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold border border-amber-300 transition-colors flex items-center gap-1"
          >
            <span>✨ 3학년 2반 14번 김민서 (제출완료)</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo(5, 1, 7, '박준우', '1234')}
            className="text-xs px-3.5 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold border border-orange-300 transition-colors flex items-center gap-1"
          >
            <span>✨ 5학년 1반 7번 박준우 (제출완료)</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo(2, 3, 5, '이서연', '5678')}
            className="text-xs px-3.5 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold border border-blue-300 transition-colors flex items-center gap-1"
          >
            <span>📝 2학년 3반 5번 이서연 (신규 작성)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
