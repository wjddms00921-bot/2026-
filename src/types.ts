export interface StudentAuth {
  grade: number;
  classNum: number;
  studentNum: number;
  studentName: string;
  password: string; // 4-digit number
}

export interface MissionSubmission {
  id: string;
  studentKey: string; // e.g., 'g3_c2_n15_홍길동'
  grade: number;
  classNum: number;
  studentNum: number;
  studentName: string;
  passwordHash?: string;
  roleSwapCategory: string;
  roleSwapDetail: string;
  photos: string[]; // Base64 data URLs or Firebase Storage URLs
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
