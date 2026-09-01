import { doc, getDoc, setDoc, onSnapshot, collection, query } from 'firebase/firestore';
import { db } from './firebase';
import { MissionSubmission, StudentAuth } from '../types';

const STORAGE_KEY_SUBMISSIONS = 'okdong_switch_on_submissions';
const STORAGE_KEY_CURRENT_USER = 'okdong_switch_on_current_user';
export const FIRESTORE_COLLECTION = 'okdong_missions';

export function makeStudentKey(
  grade: string | number,
  name: string
): string {
  return `g${grade}_${name.trim()}`;
}

const INITIAL_DEMO_SUBMISSIONS: MissionSubmission[] = [
  {
    id: 'demo-sub-1',
    studentKey: makeStudentKey(3, '김민서'),
    grade: 3,
    studentName: '김민서',
    roleSwapCategory: '아빠 ↔ 딸 (저녁 요리 & 빨래 개기)',
    roleSwapDetail: '아빠는 딸 민서 대신 뽀송하게 빨래를 개고, 민서는 아빠와 함께 저녁 된장찌개 두부를 썰고 밥상을 차렸습니다!',
    photos: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80'
    ],
    reflections: '평소에는 엄마와 아빠가 해주시는 일이 당연하다고 생각했는데, 직접 저녁을 준비하고 빨래를 개어보니 생각보다 손도 많이 가고 힘든 일이라는 걸 깨달았습니다. 아빠와 함께 역할을 바꾸어 활동하면서 우리 집안일에는 남녀나 어른, 아이의 구분이 없다는 것을 배웠습니다. 앞으로도 가족 모두가 함께 도우며 즐겁게 생활하겠습니다!',
    submittedAt: '2026-09-01T18:30:00.000Z'
  },
  {
    id: 'demo-sub-2',
    studentKey: makeStudentKey(5, '박준우'),
    grade: 5,
    studentName: '박준우',
    roleSwapCategory: '엄마 ↔ 아들 (분리수거 & 욕실 청소)',
    roleSwapDetail: '매번 엄마가 하시던 베란다 분리수거와 욕실 바닥 청소를 준우가 맡아서 하고, 엄마는 거실에서 편안하게 책을 읽으셨습니다.',
    photos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ],
    reflections: '엄마께서 매주 힘드셨을 분리수거와 욕실 청소를 제가 직접 해보니 땀도 나고 힘들었지만, 반짝반짝 깨끗해진 욕실을 보니 정말 뿌듯했습니다. 집안일은 엄마만의 몫이 아니라 가족 구성원 모두가 공평하게 나누어야 하는 소중한 일이라는 것을 가슴 깊이 느꼈습니다. 이번 양성평등주간 미션 덕분에 가족의 소중함을 다시 한번 생각해보게 되었습니다.',
    submittedAt: '2026-09-02T10:15:00.000Z'
  },
  {
    id: 'demo-sub-3',
    studentKey: makeStudentKey('유치원', '이사랑'),
    grade: '유치원',
    studentName: '이사랑',
    roleSwapCategory: '엄마 ↔ 사랑이 (장난감 정리 & 식탁 닦기)',
    roleSwapDetail: '엄마는 유치원생 사랑이 대신 블록과 인형을 바구니에 정리해주시고, 사랑이는 물티슈로 밥 먹기 전 식탁을 깨끗하게 닦아드렸어요!',
    photos: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
    ],
    reflections: '엄마가 매일 제가 어지른 장난감을 치우느라 힘드셨을 텐데 제가 직접 식탁도 닦고 엄마를 도와드리니 엄마가 꼭 안아주시며 기뻐하셨어요. 유치원에서도 친구들과 사이좋게 지내고 집에서도 스스로 할 수 있는 일은 혼자서 척척 해내는 멋진 어린이가 될래요!',
    submittedAt: '2026-09-02T14:20:00.000Z'
  }
];

// Subscribe to all submissions in Firestore in real-time
export function subscribeToSubmissions(
  onUpdate: (submissions: MissionSubmission[]) => void,
  onError?: (error: any) => void
): () => void {
  try {
    const q = query(collection(db, FIRESTORE_COLLECTION));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: MissionSubmission[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as MissionSubmission);
          });
          // Sort by submittedAt desc
          list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
          
          // Cache in local storage for fast initial render
          localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(list));
          onUpdate(list);
        } else {
          // If Firestore is empty yet, initialize with demo submissions in local
          const local = getStoredSubmissions();
          onUpdate(local);
        }
      },
      (err) => {
        console.warn('Firestore snapshot error, falling back to local storage', err);
        if (onError) onError(err);
        onUpdate(getStoredSubmissions());
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('Firestore subscription failed, using local storage fallback', e);
    onUpdate(getStoredSubmissions());
    return () => {};
  }
}

export function getStoredSubmissions(): MissionSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(INITIAL_DEMO_SUBMISSIONS));
      return INITIAL_DEMO_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load submissions from localStorage', e);
    return INITIAL_DEMO_SUBMISSIONS;
  }
}

export async function saveSubmissionToCloudAndLocal(submission: MissionSubmission): Promise<void> {
  // 1. Save to LocalStorage for instant UI response & offline safety
  const list = getStoredSubmissions();
  const index = list.findIndex(s => s.studentKey === submission.studentKey);
  const updatedSub = { ...submission, updatedAt: new Date().toISOString() };
  if (index >= 0) {
    list[index] = updatedSub;
  } else {
    list.unshift(updatedSub);
  }
  localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(list));

  // 2. Persist to Firestore cloud database
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, submission.studentKey);
    await setDoc(docRef, updatedSub, { merge: true });
  } catch (err) {
    console.error('Failed to save submission to Firestore Cloud DB:', err);
    throw err;
  }
}

export async function fetchSubmissionFromCloud(studentKey: string): Promise<MissionSubmission | null> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, studentKey);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as MissionSubmission;
    }
  } catch (err) {
    console.warn('Failed to fetch from Firestore, falling back to local storage:', err);
  }
  return findSubmissionByStudentKey(studentKey) || null;
}

export function saveSubmission(submission: MissionSubmission): void {
  saveSubmissionToCloudAndLocal(submission).catch((e) => console.error(e));
}

export function findSubmissionByStudentKey(key: string): MissionSubmission | undefined {
  const list = getStoredSubmissions();
  return list.find(s => s.studentKey === key);
}

export function getStoredUser(): StudentAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setStoredUser(user: StudentAuth | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  }
}

const STORAGE_KEY_ADMIN_PW = 'okdong_admin_custom_pw';
const SETTINGS_COLLECTION = 'okdong_settings';
const ADMIN_DOC_ID = 'admin_auth';

export function getStoredAdminPassword(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_ADMIN_PW) || '1234';
  } catch (e) {
    return '1234';
  }
}

export async function fetchAdminPasswordFromCloud(): Promise<string> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, ADMIN_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.password) {
        localStorage.setItem(STORAGE_KEY_ADMIN_PW, data.password);
        return data.password;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch admin password from Firestore:', err);
  }
  return getStoredAdminPassword();
}

export async function saveAdminPasswordToCloudAndLocal(newPw: string): Promise<void> {
  const cleanPw = newPw.trim();
  localStorage.setItem(STORAGE_KEY_ADMIN_PW, cleanPw);
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, ADMIN_DOC_ID);
    await setDoc(docRef, { password: cleanPw, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.error('Failed to save admin password to Firestore:', err);
    throw err;
  }
}

