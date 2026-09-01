import React, { useState } from 'react';
import { X, ShieldCheck, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { FIRESTORE_RULES_GUIDE, FIREBASE_STORAGE_RULES_GUIDE, FIREBASE_SETUP_STEPS } from '../lib/firebaseGuide';

interface FirebaseRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseRulesModal: React.FC<FirebaseRulesModalProps> = ({ isOpen, onClose }) => {
  const [copiedFirestore, setCopiedFirestore] = useState(false);
  const [copiedStorage, setCopiedStorage] = useState(false);
  const [activeTab, setActiveTab] = useState<'firestore' | 'storage' | 'guide'>('firestore');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: 'firestore' | 'storage') => {
    navigator.clipboard.writeText(text);
    if (type === 'firestore') {
      setCopiedFirestore(true);
      setTimeout(() => setCopiedFirestore(false), 2000);
    } else {
      setCopiedStorage(true);
      setTimeout(() => setCopiedStorage(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500 rounded-xl text-slate-950 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Firebase 보안 규칙(Security Rules) 가이드</h3>
              <p className="text-xs text-slate-400">교사만 전체 조회 가능 &amp; 타 학부모의 개인정보 열람 원천 차단</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('firestore')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'firestore'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Firestore Database 규칙
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'storage'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Storage (사진 저장소) 규칙
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'guide'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            연동 설정 가이드
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar">
          {activeTab === 'firestore' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Firestore 보안 규칙 (firestore.rules)</h4>
                  <p className="text-xs text-slate-500">Firebase 콘솔 &gt; Firestore &gt; 규칙 탭에 붙여넣으세요.</p>
                </div>
                <button
                  onClick={() => copyToClipboard(FIRESTORE_RULES_GUIDE, 'firestore')}
                  className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copiedFirestore ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFirestore ? '복사 완료!' : '규칙 복사'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                <pre>{FIRESTORE_RULES_GUIDE}</pre>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>보안 핵심 포인트:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-emerald-900/90 pl-1">
                  <li><strong>가정별 독립성:</strong> 본인 가정의 학생 정보로 생성된 문서 외에는 타인의 제출물 열람 불가</li>
                  <li><strong>교사 전용 권한:</strong> `teacher` 역할 계정만 전체 목록(list) 및 통계 열람 가능</li>
                  <li><strong>글자 수 및 사진 무결성 검증:</strong> 클라이언트 조작 방지를 위해 100자 이상 및 사진 필수 룰 서버 강제</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Firebase Storage 보안 규칙 (storage.rules)</h4>
                  <p className="text-xs text-slate-500">Firebase 콘솔 &gt; Storage &gt; Rules 탭에 붙여넣으세요.</p>
                </div>
                <button
                  onClick={() => copyToClipboard(FIREBASE_STORAGE_RULES_GUIDE, 'storage')}
                  className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copiedStorage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStorage ? '복사 완료!' : '규칙 복사'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                <pre>{FIREBASE_STORAGE_RULES_GUIDE}</pre>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800">Firebase 프로젝트 연결 4단계</h4>
              <div className="space-y-2.5">
                {FIREBASE_SETUP_STEPS.map((s) => (
                  <div key={s.step} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {s.step}
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-800">{s.title}</h5>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
