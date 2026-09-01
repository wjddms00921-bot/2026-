import React, { useState } from 'react';
import { X, Code2, Copy, Download, Check, FileCode, Sparkles } from 'lucide-react';
import { generateSingleFileHtml } from '../lib/singleHtmlTemplate';

interface SingleFileCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SingleFileCodeModal: React.FC<SingleFileCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const htmlCode = generateSingleFileHtml();

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'okdong_switch_on_single_app.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 rounded-xl text-slate-950 font-bold">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">완성형 단일 웹페이지(Single File HTML) 코드</h3>
              <p className="text-xs text-slate-400">HTML + CSS + JavaScript + Firebase SDK가 포함된 완전 독립형 파일</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>이 파일 하나만 저장하여 브라우저에서 바로 열거나 웹 서버에 올리면 동작합니다!</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사되었습니다!' : '전체 코드 복사'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.html 파일 다운로드</span>
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed custom-scrollbar">
          <pre className="whitespace-pre-wrap">{htmlCode}</pre>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end shrink-0">
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
