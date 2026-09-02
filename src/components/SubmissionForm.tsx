import React, { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, CheckCircle2, AlertCircle, Sparkles, ImagePlus, ArrowLeft, RefreshCw, Lightbulb, Gift, AlertTriangle, Check, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MissionSubmission, StudentAuth } from '../types';

interface SubmissionFormProps {
  currentUser: StudentAuth;
  existingSubmission?: MissionSubmission | null;
  onSubmit: (submission: MissionSubmission) => void;
  onCancel?: () => void;
}

const ROLE_IDEAS_ELEMENTARY = [
  '아빠 ↔ 딸 (저녁 요리 & 빨래 개기)',
  '엄마 ↔ 아들 (분리수거 & 욕실 청소)',
  '부모님 ↔ 자녀 (집안일 및 스케줄 관리)',
  '형제 ↔ 자매 (방 청소 및 정리 정돈)',
  '할머니/할아버지 ↔ 손자/손녀 (식탁 닦기 & 화분 돌보기)'
];

const KINDERGARTEN_PRESETS = [
  {
    icon: '🧸',
    title: '장난감 스스로 정리하기',
    detail: '평소 부모님이 치워주시던 장난감 바구니를 아이가 스스로 제자리에 정리했습니다.',
    reflection: '아이가 스스로 장난감을 정리하는 모습을 보니 정말 대견하고 뿌듯했습니다.'
  },
  {
    icon: '🥣',
    title: '밥상에 수저 놓기 & 식사 돕기',
    detail: '식사 전 가족 수저를 놓고, 식사 후 자기 그릇을 싱크대에 가져다 놓았습니다.',
    reflection: '밥상 차리기를 도우며 부모님의 고마움을 알고 앞으로 매일 돕겠다고 약속했어요.'
  },
  {
    icon: '🧦',
    title: '양말 짝 맞추기 & 신발 정리',
    detail: '빨래 개기를 도우며 양말 짝을 맞추고, 현관 신발을 가지런히 정리했습니다.',
    reflection: '작은 일이지만 함께 도우니 가족 모두 기분 좋고 뜻깊은 시간이었습니다.'
  },
  {
    icon: '🧹',
    title: '바닥 쓸기 & 쓰레기 버리기',
    detail: '작은 빗자루로 바닥을 쓸고, 쓰레기를 쓰레기통에 직접 쏙 버렸습니다.',
    reflection: '아이가 직접 청소를 해보면서 집안을 깨끗이 아끼고 쓰기로 약속했습니다.'
  },
  {
    icon: '❤️',
    title: '부모님 안마 & 간단한 심부름',
    detail: '일하고 오신 부모님 어깨를 주물러 드리고 물을 떠다 드리는 심부름을 했습니다.',
    reflection: '서로 안아주고 안마해주며 가족의 따뜻한 사랑을 듬뿍 느꼈습니다.'
  }
];

const KINDERGARTEN_REFLECTIONS = [
  '아이가 스스로 정리하는 모습을 보니 정말 대견하고 뿌듯했습니다.',
  '엄마·아빠의 고마움을 알고 앞으로 매일 돕겠다고 약속했어요.',
  '작은 일이지만 온 가족이 함께 참여하여 즐겁고 뜻깊은 시간이었습니다.',
  '아이가 직접 역할을 해보며 가족의 소중함과 사랑을 배웠습니다.'
];

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  currentUser,
  existingSubmission,
  onSubmit,
  onCancel,
}) => {
  const isKindergarten = String(currentUser.grade) === '유치원' || String(currentUser.grade) === '0';
  const minCharCount = isKindergarten ? 10 : 100;

  const [roleTitle, setRoleTitle] = useState(
    existingSubmission?.roleSwapCategory || ''
  );
  const [roleDetail, setRoleDetail] = useState(existingSubmission?.roleSwapDetail || '');
  const [photos, setPhotos] = useState<string[]>(existingSubmission?.photos || []);
  const [reflections, setReflections] = useState(existingSubmission?.reflections || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingSubmission, setPendingSubmission] = useState<MissionSubmission | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const charCount = reflections.length;
  const isLengthValid = charCount >= minCharCount;
  const isPhotosValid = photos.length >= 1;
  const isRoleValid = roleTitle.trim().length > 0 && roleDetail.trim().length > 0;
  const isFormValid = isLengthValid && isPhotosValid && isRoleValid;

  // Select Kindergarten Preset (fills title, detail and optionally reflection)
  const handleSelectKindergartenPreset = (preset: typeof KINDERGARTEN_PRESETS[0]) => {
    setRoleTitle(preset.title);
    setRoleDetail(preset.detail);
    if (!reflections.trim()) {
      setReflections(preset.reflection);
    }
  };

  // Handle Photo files
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (!file.type.startsWith('image/')) {
        setUploadError('이미지 파일(JPG, PNG 등)만 업로드할 수 있습니다.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setUploadError('사진 파일 크기는 10MB 이하만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSamplePhoto = () => {
    const sampleUrls = [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ];
    const pick = sampleUrls[photos.length % sampleUrls.length];
    setPhotos((prev) => [...prev, pick]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    const newSubmission: MissionSubmission = {
      id: existingSubmission?.id || `sub-${Date.now()}`,
      studentKey: `g${currentUser.grade}_${currentUser.studentName.trim()}`,
      grade: currentUser.grade,
      studentName: currentUser.studentName,
      roleSwapCategory: roleTitle.trim() || '우리 가족 역할 바꾸기',
      roleSwapDetail: roleDetail.trim(),
      photos,
      reflections: reflections.trim(),
      submittedAt: existingSubmission?.submittedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPendingSubmission(newSubmission);
    setShowConfirmModal(true);

    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#f97316', '#10b981', '#3b82f6', '#ec4899'],
      });
    } catch (e) {
      // ignore
    }
  };

  const handleFinalConfirm = () => {
    if (!pendingSubmission) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);
    onSubmit(pendingSubmission);
  };

  const progressPercent = Math.min(100, Math.round((charCount / minCharCount) * 100));

  return (
    <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl border-4 border-[#4D96FF] relative flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#4D96FF] text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-xs">
              {existingSubmission ? '미션 수정' : '미션 참여하기'}
            </span>
            {isKindergarten && (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                <span>🐣</span>
                <span>유치원 간편 모드</span>
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {existingSubmission ? '✏️ 미션 실천 내용 수정하기' : '📝 미션 실천 내용 작성하기'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isKindergarten
              ? '아이와 함께 바꾼 역할을 사진과 함께 짧고 편안하게 기록해 주세요.'
              : '틀 없이 자유롭게 우리 가족이 역할을 어떻게 바꾸어 실천했는지 적어주세요.'}
          </p>
        </div>

        {onCancel && existingSubmission && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-bold flex items-center gap-1.5 border border-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>조회 화면</span>
          </button>
        )}
      </div>

      {/* 🐣 Kindergarten Friendly Banner */}
      {isKindergarten && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl mb-4 flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center text-xl shrink-0">
            🐣
          </div>
          <div className="space-y-0.5 text-xs text-emerald-950 font-medium">
            <span className="font-black text-emerald-900 block text-xs sm:text-sm">
              유치원 맞춤 간편 작성 모드
            </span>
            <p className="text-emerald-800 leading-relaxed">
              아래의 <strong>추천 예시 버튼을 터치</strong>하시면 활동 내용과 소감문이 손쉽게 자동 입력됩니다! (소감문은 10자 이상의 짧은 한 줄이어도 정상 접수됩니다)
            </p>
          </div>
        </div>
      )}

      {/* 📢 BIG PROMINENT NOTICE BANNER */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-300 text-slate-950 rounded-2xl shadow-md border-2 border-amber-400 flex items-start gap-3.5 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black text-2xl shrink-0 shadow-sm">
          🎁
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide">
              필독 주의사항
            </span>
            <span className="text-xs font-black text-slate-900">참여 가족 기념 선물 안내</span>
          </div>
          <p className="text-sm sm:text-base font-black leading-snug text-slate-950">
            "행사종료 이후 학생편으로 커트러리 세트가 배부됩니다."
          </p>
          <p className="text-xs font-bold text-slate-800">
            ⚠️ <strong>(단, 한 가정당 1개씩 배부합니다)</strong> — 형제나 자매가 각각 제출하더라도 선물은 가정당 1세트만 배부됩니다.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
        {/* 1. Free-form Role Swap Section */}
        <div className="space-y-3 p-4 sm:p-5 bg-blue-50/40 rounded-2xl border-2 border-blue-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs sm:text-sm font-black text-slate-800">
              1. {isKindergarten ? '아이와 함께한 역할 바꾸기' : '우리 가족의 역할 바꾸기 내용'} <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-blue-600 font-bold bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
              {isKindergarten ? '터치 시 자동 완성' : '자유 서술형'}
            </span>
          </div>

          {/* Kindergarten 1-Click Auto Fill Presets */}
          {isKindergarten && (
            <div className="space-y-1.5 p-3 bg-white rounded-xl border border-blue-200">
              <div className="flex items-center gap-1 text-xs font-black text-blue-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>추천 활동 예시 (터치 시 내용이 바로 입력됩니다)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {KINDERGARTEN_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectKindergartenPreset(preset)}
                    className="text-left text-xs p-2.5 bg-blue-50/60 hover:bg-blue-100/80 text-slate-800 rounded-xl border border-blue-200 hover:border-blue-400 font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <span className="text-base">{preset.icon}</span>
                    <div className="truncate">
                      <span className="text-blue-950 font-black block truncate">{preset.title}</span>
                      <span className="text-[10px] text-slate-500 font-normal truncate block">{preset.detail}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Elementary Quick Idea Chips */}
          {!isKindergarten && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                <Lightbulb className="w-3 h-3 text-amber-500" />
                <span>참고 예시 (터치 시 자동 입력)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ROLE_IDEAS_ELEMENTARY.map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRoleTitle(idea)}
                    className="text-[11px] px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg border border-slate-200 hover:border-blue-300 font-medium transition-colors cursor-pointer"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">
              바꾼 역할 한 줄 요약
            </label>
            <input
              type="text"
              placeholder={
                isKindergarten
                  ? '예: 아이가 장난감을 스스로 치우고 부모님을 도와드렸어요'
                  : '예: 아빠 ↔ 딸 (저녁 요리와 빨래 개기 교대), 엄마 휴식 & 아빠와 아들의 대청소'
              }
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              required
              className="w-full bg-white border-2 border-blue-200 rounded-xl px-4 py-3 text-sm focus:border-[#4D96FF] focus:ring-2 focus:ring-blue-100 transition-all outline-none font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">
              {isKindergarten ? '어떻게 실천했나요? (직접 수정하거나 추가하셔도 좋습니다)' : '구체적으로 어떻게 바꾸어 실천했나요?'}
            </label>
            <textarea
              rows={isKindergarten ? 2 : 3}
              placeholder={
                isKindergarten
                  ? '예: 평소 부모님이 치워주시던 장난감 바구니를 아이가 직접 정리하고, 식사 후 자기 그릇을 싱크대에 가져다 놓았습니다.'
                  : '가족 구성원들이 어떻게 역할을 바꾸어 활동했는지 자유롭게 적어주세요. (예: 평소 아빠가 하시던 분리수거와 설거지를 딸 민서가 직접 하고, 민서가 하던 빨래 개기를 아빠가 맡아서 함께 집안일을 나누었습니다.)'
              }
              value={roleDetail}
              onChange={(e) => setRoleDetail(e.target.value)}
              required
              className="w-full bg-white border-2 border-blue-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:border-[#4D96FF] focus:ring-2 focus:ring-blue-100 transition-all outline-none leading-relaxed text-slate-800 font-medium"
            />
          </div>
        </div>

        {/* 2. Photo Upload */}
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="block text-xs font-bold text-slate-500">
              2. 활동 사진 업로드 (1장 이상 필수) <span className="text-rose-500">*</span>
            </label>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              photos.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
            }`}>
              {photos.length}장 등록됨 {photos.length === 0 && '(최소 1장 필요)'}
            </span>
          </div>

          {uploadError && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-bold">
              {uploadError}
            </p>
          )}

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-[#4D96FF] bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-4 text-center transition-colors">
            <input
              type="file"
              id="photo-upload-input"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <label htmlFor="photo-upload-input" className="cursor-pointer block">
              <div className="w-10 h-10 mx-auto rounded-full bg-white text-slate-700 flex items-center justify-center mb-1.5 shadow-sm border border-slate-200">
                <Camera className="w-5 h-5 text-[#4D96FF]" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                📸 사진 파일 터치하여 선택하기
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                스마트폰 카메라 또는 앨범 속 사진 (최대 10MB)
              </p>
            </label>

            {/* Quick Demo Sample Photo Button */}
            <div className="mt-2.5 pt-2 border-t border-slate-200 flex justify-center">
              <button
                type="button"
                onClick={handleAddSamplePhoto}
                className="text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl transition-colors font-bold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>샘플 활동 사진 추가하기 (테스트용)</span>
              </button>
            </div>
          </div>

          {/* Uploaded Photos Grid */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {photos.map((src, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-2xl overflow-hidden border-2 border-slate-200 aspect-[4/3] bg-slate-100 shadow-sm"
                >
                  <img
                    src={src}
                    alt={`인증 사진 ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="p-2 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition-colors cursor-pointer"
                      title="사진 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                    사진 #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Reflections with Live Counter */}
        <div className="space-y-2 flex-1 flex flex-col">
          <div className="flex justify-between items-center ml-1">
            <label className="block text-xs font-bold text-slate-500">
              3. {isKindergarten ? '가족/아이 실천 소감 (10자 이상)' : '활동 소감문 (100자 이상)'} <span className="text-rose-500">*</span>
            </label>
            <span
              className={`text-xs font-black px-3 py-1 rounded-full transition-all ${
                isLengthValid
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : 'bg-red-50 text-red-400 border border-red-200'
              }`}
            >
              {charCount} / {minCharCount}자
            </span>
          </div>

          {/* Kindergarten Quick Reflection Chips */}
          {isKindergarten && (
            <div className="space-y-1.5 p-3 bg-amber-50/70 rounded-xl border border-amber-200">
              <div className="flex items-center gap-1 text-[11px] font-black text-amber-900">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>추천 소감문 (터치 시 바로 입력되며, 수정도 가능합니다)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {KINDERGARTEN_REFLECTIONS.map((refText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReflections(refText)}
                    className="text-[11px] px-2.5 py-1.5 bg-white hover:bg-amber-100 text-amber-950 rounded-lg border border-amber-300 font-bold transition-all text-left cursor-pointer shadow-2xs"
                  >
                    "{refText}"
                  </button>
                ))}
              </div>
            </div>
          )}

          <textarea
            rows={isKindergarten ? 3 : 5}
            placeholder={
              isKindergarten
                ? '아이와 함께 활동하며 느낀 점이나 아이가 한 말을 짧게 적어주세요. (위 추천 문장을 누르셔도 바로 입력됩니다)'
                : '평소 느끼지 못했던 가족의 수고로움을 통해 느낀 점과 앞으로 함께 실천할 다짐을 솔직하게 100자 이상 적어주세요.'
            }
            value={reflections}
            onChange={(e) => setReflections(e.target.value)}
            required
            className="flex-1 w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-xs sm:text-sm focus:border-[#4D96FF] focus:bg-white transition-all outline-none leading-relaxed text-slate-800 font-medium"
          />

          {/* Progress Bar and Guidance */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isLengthValid
                    ? 'bg-[#6BCB77]'
                    : charCount >= (minCharCount / 2)
                    ? 'bg-[#FFD93D]'
                    : 'bg-rose-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] ml-1">
              <span
                className={`font-bold ${
                  isLengthValid ? 'text-[#6BCB77]' : 'text-slate-400'
                }`}
              >
                {isLengthValid
                  ? (isKindergarten ? '🎉 소감이 정성껏 작성되었습니다! (제출 가능)' : '🎉 100자 이상 작성되었습니다! 정성 가득한 소감입니다.')
                  : `${minCharCount}자 이상 작성해야 제출 버튼이 활성화됩니다. (${minCharCount - charCount}자 남음)`}
              </span>
              <span className="text-slate-400 tabular-nums font-mono font-bold">
                {charCount}자
              </span>
            </div>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-4 rounded-2xl font-black text-base sm:text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
              isFormValid && !isSubmitting
                ? 'bg-[#4D96FF] hover:bg-[#3b82f6] text-white cursor-pointer hover:shadow-xl'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>제출 처리 중입니다...</span>
              </>
            ) : isFormValid ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>
                  {existingSubmission
                    ? '수정된 미션 다시 제출하기 ✨'
                    : '미션 제출 완료하기 ✨'}
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-slate-400" />
                <span>
                  {!isRoleValid
                    ? '바꾼 역할 내용을 입력해 주세요'
                    : !isPhotosValid
                    ? '사진 1장 이상 등록 필요'
                    : !isLengthValid
                    ? `활동 소감 ${minCharCount}자 이상 작성 필요 (${minCharCount - charCount}자 남음)`
                    : '필수 항목을 모두 입력해 주세요'}
                </span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* 🎉 POST-SUBMISSION CONFIRMATION & NOTICE MODAL */}
      {showConfirmModal && pendingSubmission && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-[#6BCB77] space-y-5 animate-in fade-in zoom-in duration-200">
            {/* Top Celebration Icon */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
                🎉
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                미션 실천 내용이 준비되었습니다!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {currentUser.studentName} 학생 가정의 소중한 역할 바꾸기 실천이 정상 접수됩니다.
              </p>
            </div>

            {/* Crucial Notice Spotlight Card */}
            <div className="p-5 bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 border-3 border-amber-400 rounded-2xl space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                <span className="p-1 bg-amber-400 text-slate-950 rounded-lg text-sm">📢</span>
                <span>[필독] 참여 가족 기념 선물 및 주의사항</span>
              </div>
              
              <div className="p-3.5 bg-white rounded-xl border border-amber-300 shadow-2xs">
                <p className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  "행사종료 이후 학생편으로 커트러리 세트가 배부됩니다."
                </p>
                <p className="text-xs sm:text-sm font-bold text-rose-600 mt-1">
                  (단, 한 가정당 1개씩 배부합니다)
                </p>
              </div>

              <ul className="text-xs text-slate-700 font-medium space-y-1 pl-1">
                <li>• <strong>배부 방식:</strong> 행사 마감(9월 11일) 후 담임선생님을 통해 학생편으로 가정에 전달됩니다.</li>
                <li>• <strong>중복 제한:</strong> 형제/자매가 유치원이나 초등학교에 함께 재학 중이더라도 가정당 1세트가 지급됩니다.</li>
              </ul>
            </div>

            {/* Confirm Action Button */}
            <button
              type="button"
              onClick={handleFinalConfirm}
              className="w-full py-4 bg-[#6BCB77] hover:bg-[#5bb866] text-white font-black rounded-2xl text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>네, 확인했습니다! 최종 제출 완료 🚀</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

