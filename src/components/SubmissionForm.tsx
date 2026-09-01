import React, { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, CheckCircle2, AlertCircle, Sparkles, ImagePlus, ArrowLeft, RefreshCw, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MissionSubmission, StudentAuth } from '../types';

interface SubmissionFormProps {
  currentUser: StudentAuth;
  existingSubmission?: MissionSubmission | null;
  onSubmit: (submission: MissionSubmission) => void;
  onCancel?: () => void;
}

const ROLE_IDEAS = [
  '아빠 ↔ 딸 (저녁 요리 & 빨래 개기)',
  '엄마 ↔ 아들 (분리수거 & 욕실 청소)',
  '부모님 ↔ 자녀 (집안일 및 스케줄 관리)',
  '형제 ↔ 자매 (방 청소 및 정리 정돈)',
  '할머니/할아버지 ↔ 손자/손녀 (식탁 닦기 & 화분 돌보기)'
];

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  currentUser,
  existingSubmission,
  onSubmit,
  onCancel,
}) => {
  const [roleTitle, setRoleTitle] = useState(
    existingSubmission?.roleSwapCategory || ''
  );
  const [roleDetail, setRoleDetail] = useState(existingSubmission?.roleSwapDetail || '');
  const [photos, setPhotos] = useState<string[]>(existingSubmission?.photos || []);
  const [reflections, setReflections] = useState(existingSubmission?.reflections || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const charCount = reflections.length;
  const isLengthValid = charCount >= 100;
  const isPhotosValid = photos.length >= 1;
  const isRoleValid = roleTitle.trim().length > 0 && roleDetail.trim().length > 0;
  const isFormValid = isLengthValid && isPhotosValid && isRoleValid;

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

    setIsSubmitting(true);

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

    // Confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#f97316', '#10b981', '#3b82f6', '#ec4899'],
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      onSubmit(newSubmission);
      setIsSubmitting(false);
    }, 400);
  };

  const progressPercent = Math.min(100, Math.round((charCount / 100) * 100));

  return (
    <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl border-4 border-[#4D96FF] relative flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <div className="bg-[#4D96FF] text-white w-fit px-3.5 py-1 rounded-full text-xs font-bold mb-2 shadow-xs">
            {existingSubmission ? '미션 수정' : '미션 참여하기'}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {existingSubmission ? '✏️ 미션 실천 내용 수정하기' : '📝 미션 실천 내용 작성하기'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            틀 없이 자유롭게 우리 가족이 역할을 어떻게 바꾸어 실천했는지 적어주세요.
          </p>
        </div>

        {onCancel && existingSubmission && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-bold flex items-center gap-1.5 border border-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>조회 화면</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
        {/* 1. Free-form Role Swap Section */}
        <div className="space-y-3 p-4 sm:p-5 bg-blue-50/40 rounded-2xl border-2 border-blue-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs sm:text-sm font-black text-slate-800">
              1. 우리 가족의 역할 바꾸기 내용 (자유 작성) <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-blue-600 font-bold bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
              자유 서술형
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">
              바꾼 역할 한 줄 요약
            </label>
            <input
              type="text"
              placeholder="예: 아빠 ↔ 딸 (저녁 요리와 빨래 개기 교대), 엄마 휴식 &amp; 아빠와 아들의 대청소"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              required
              className="w-full bg-white border-2 border-blue-200 rounded-xl px-4 py-3 text-sm focus:border-[#4D96FF] focus:ring-2 focus:ring-blue-100 transition-all outline-none font-bold text-slate-800"
            />
          </div>

          {/* Quick Idea Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>참고 예시 (터치 시 자동 입력)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ROLE_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRoleTitle(idea)}
                  className="text-[11px] px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg border border-slate-200 hover:border-blue-300 font-medium transition-colors"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">
              구체적으로 어떻게 바꾸어 실천했나요?
            </label>
            <textarea
              rows={3}
              placeholder="가족 구성원들이 어떻게 역할을 바꾸어 활동했는지 자유롭게 적어주세요. (예: 평소 아빠가 하시던 분리수거와 설거지를 딸 민서가 직접 하고, 민서가 하던 빨래 개기를 아빠가 맡아서 함께 집안일을 나누었습니다.)"
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
                className="text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl transition-colors font-bold inline-flex items-center gap-1.5 shadow-2xs"
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
                      className="p-2 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition-colors"
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
              3. 활동 소감문 (100자 이상) <span className="text-rose-500">*</span>
            </label>
            <span
              className={`text-xs font-black px-3 py-1 rounded-full transition-all ${
                isLengthValid
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : 'bg-red-50 text-red-400 border border-red-200'
              }`}
            >
              {charCount} / 100자
            </span>
          </div>

          <textarea
            rows={5}
            placeholder="평소 느끼지 못했던 가족의 수고로움을 통해 느낀 점과 앞으로 함께 실천할 다짐을 솔직하게 100자 이상 적어주세요."
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
                    : charCount >= 50
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
                  ? '🎉 100자 이상 작성되었습니다! 정성 가득한 소감입니다.'
                  : `100자 이상 작성해야 제출 버튼이 활성화됩니다. (${100 - charCount}자 남음)`}
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
                    ? `활동 소감 100자 이상 작성 필요 (${100 - charCount}자 남음)`
                    : '필수 항목을 모두 입력해 주세요'}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
