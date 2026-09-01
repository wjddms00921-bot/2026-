export interface StudentAuth {
  grade: string | number; // '유치원' | 1 | 2 | 3 | 4 | 5 | 6
  studentName: string;
  password: string; // 4-digit number
  classNum?: string | number;
  studentNum?: string | number;
}

export interface MissionSubmission {
  id: string;
  studentKey: string; // e.g., 'g유치원_이사랑' or 'g3_김민서'
  grade: string | number;
  studentName: string;
  classNum?: string | number;
  studentNum?: string | number;
  passwordHash?: string;
  roleSwapCategory: string; // 자유 작성 역할 바꾸기 제목/요약
  roleSwapDetail: string;   // 자유 작성 역할 바꾸기 세부 내용
  photos: string[]; // Base64 data URLs or Storage URLs
  reflections: string;
  submittedAt: string;
  updatedAt?: string;
}

export interface DDayInfo {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  targetDateStr: string;
}

export function formatGradeText(grade: string | number): string {
  if (String(grade) === '유치원' || String(grade) === '0') {
    return '유치원';
  }
  return `${grade}학년`;
}

export function formatStudentFullTitle(
  grade: string | number,
  studentName: string,
  classNum?: string | number,
  studentNum?: string | number
): string {
  const gText = formatGradeText(grade);
  if (classNum && studentNum) {
    return `${gText} ${classNum}반 ${studentNum}번 ${studentName}`;
  }
  if (classNum) {
    return `${gText} ${classNum}반 ${studentName}`;
  }
  return `${gText} ${studentName}`;
}
