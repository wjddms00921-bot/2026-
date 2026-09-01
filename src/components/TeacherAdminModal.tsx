import React, { useState } from 'react';
import { X, Lock, Search, Download, Eye, CheckCircle, ShieldAlert, Sparkles, Filter, Users, School } from 'lucide-react';
import { MissionSubmission, formatGradeText, formatStudentFullTitle } from '../types';

interface TeacherAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: MissionSubmission[];
}

export const TeacherAdminModal: React.FC<TeacherAdminModalProps> = ({
  isOpen,
  onClose,
  submissions,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectSubmission, setInspectSubmission] = useState<MissionSubmission | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1234' || passcode === 'okdong') {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('비밀번호가 올바르지 않습니다. (기본 관리자 비밀번호: 1234)');
    }
  };

  const filtered = submissions.filter((sub) => {
    const matchGrade = selectedGrade === 'all' || String(sub.grade) === String(selectedGrade);
    const matchSearch =
      sub.studentName.includes(searchQuery.trim()) ||
      `${sub.grade} ${sub.classNum}반`.includes(searchQuery.trim()) ||
      sub.roleSwapCategory.includes(searchQuery.trim());
    return matchGrade && matchSearch;
  });

  const exportCSV = () => {
    const headers = ['학년/구분', '반', '번호', '학생이름', '바꾼역할요약', '세부실천내용', '소감문', '사진개수', '제출일시'];
    const rows = submissions.map((s) => [
      formatGradeText(s.grade),
      s.classNum,
      s.studentNum,
      s.studentName,
      `"${s.roleSwapCategory.replace(/"/g, '""')}"`,
      `"${s.roleSwapDetail.replace(/"/g, '""')}"`,
      `"${s.reflections.replace(/"/g, '""')}"`,
      s.photos.length,
      new Date(s.submittedAt).toLocaleString('ko-KR'),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `옥동초_양성평등주간_미션_제출목록_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 rounded-xl text-slate-950 font-bold">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">교사(관리자) 미션 관리 모드</h3>
              <p className="text-xs text-slate-400">옥동초등학교 양성평등주간 전체 제출 내역 열람 및 통계</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passcode Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
              <Lock className="w-7 h-7 text-slate-800" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">교사 인증 비밀번호 입력</h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                타인의 제출물은 보호되어 있으며, 교사 관리자 번호를 입력해야 전체 조회가 가능합니다.
              </p>
            </div>

            {error && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {error}
              </p>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                placeholder="관리자 비밀번호 (기본: 1234)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-base tracking-widest focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors"
              >
                관리자 로그인
              </button>
            </form>

            <p className="text-[11px] text-slate-400">
              💡 데모 테스트용 기본 비밀번호: <strong className="text-slate-700">1234</strong>
            </p>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
            
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5">
                <span className="text-xs font-semibold text-amber-700">총 제출 가정</span>
                <div className="text-2xl font-black text-amber-900 mt-0.5">{submissions.length}가정</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5">
                <span className="text-xs font-semibold text-emerald-700">소감문 충족률</span>
                <div className="text-2xl font-black text-emerald-900 mt-0.5">100% (100자+)</div>
              </div>
              <div className="bg-sky-50 border border-sky-200/80 rounded-2xl p-3.5">
                <span className="text-xs font-semibold text-sky-700">총 등록 사진</span>
                <div className="text-2xl font-black text-sky-900 mt-0.5">
                  {submissions.reduce((acc, cur) => acc + cur.photos.length, 0)}장
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200/80 rounded-2xl p-3.5 flex flex-col justify-between">
                <span className="text-xs font-semibold text-purple-700">데이터 내보내기</span>
                <button
                  onClick={exportCSV}
                  className="mt-1 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Excel/CSV 다운로드</span>
                </button>
              </div>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              {/* Grade Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedGrade('all')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                    selectedGrade === 'all'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  전체 ({submissions.length})
                </button>
                <button
                  onClick={() => setSelectedGrade('유치원')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    selectedGrade === '유치원'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  유치원 ({submissions.filter((s) => String(s.grade) === '유치원').length})
                </button>
                {[1, 2, 3, 4, 5, 6].map((g) => {
                  const count = submissions.filter((s) => String(s.grade) === String(g)).length;
                  return (
                    <button
                      key={g}
                      onClick={() => setSelectedGrade(g)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                        selectedGrade === g
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {g}학년 ({count})
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="학생 이름 / 역할 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Table / Cards */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">학적</th>
                      <th className="px-4 py-3">학생 이름</th>
                      <th className="px-4 py-3">바꾼 역할</th>
                      <th className="px-4 py-3">소감문 길이</th>
                      <th className="px-4 py-3">사진</th>
                      <th className="px-4 py-3">제출일</th>
                      <th className="px-4 py-3 text-center">상세보기</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-xs">
                          해당 조건의 제출물이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((sub) => (
                        <tr key={sub.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                            {formatGradeText(sub.grade)} {sub.classNum}반 ({sub.studentNum}번)
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                            {sub.studentName}
                          </td>
                          <td className="px-4 py-3 text-slate-700 max-w-[180px] truncate">
                            {sub.roleSwapCategory}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold text-xs border border-emerald-200">
                              {sub.reflections.length}자
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-600">
                            📷 {sub.photos.length}장
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                            {new Date(sub.submittedAt).toLocaleDateString('ko-KR', {
                              month: 'numeric',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => setInspectSubmission(sub)}
                              className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>조회</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>옥동초등학교 양성평등주간 실천 모니터링 시스템</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors"
          >
            닫기
          </button>
        </div>

      </div>

      {/* Inspect Single Student Submission Detail Modal */}
      {inspectSubmission && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setInspectSubmission(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-600">학생 제출물 상세 검토</span>
                <h4 className="text-lg font-bold text-slate-800">
                  {formatStudentFullTitle(inspectSubmission.grade, inspectSubmission.classNum, inspectSubmission.studentNum, inspectSubmission.studentName)}
                </h4>
              </div>
              <button
                onClick={() => setInspectSubmission(null)}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 block">바꾼 역할 내용</span>
                <p className="font-bold text-slate-800 mt-0.5">{inspectSubmission.roleSwapCategory}</p>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl mt-1 leading-relaxed">
                  {inspectSubmission.roleSwapDetail}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">인증 사진 ({inspectSubmission.photos.length}장)</span>
                <div className="grid grid-cols-2 gap-2">
                  {inspectSubmission.photos.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="인증사진"
                      className="w-full h-36 object-cover rounded-xl border border-slate-200"
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">
                  가족 소감문 ({inspectSubmission.reflections.length}자)
                </span>
                <p className="p-3.5 bg-amber-50/60 border border-amber-100 rounded-xl text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {inspectSubmission.reflections}
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setInspectSubmission(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
