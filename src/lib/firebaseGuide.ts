export const FIRESTORE_RULES_GUIDE = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 1. 기본적으로 모든 읽기/쓰기 차단 (Zero-Trust)
    match /{document=**} {
      allow read, write: if false;
    }

    // 2. 옥동초등학교 '우리집 스위치 ON' 미션 컬렉션 보안 규칙
    match /okdong_missions/{studentDocId} {
      
      // [조회(read) 규칙]:
      // - 각 가정은 본인 학년/반/번호/이름으로 생성된 문서만 조회 가능
      // - 교사/관리자 계정(관리자 UID 등록 또는 커스텀 클레임)은 전체 조회 가능
      allow get: if request.auth != null && (
        request.auth.uid == resource.data.studentKey ||
        request.auth.uid == studentDocId ||
        request.auth.token.role == 'teacher' ||
        request.auth.token.email == 'teacher@okdong.es.kr'
      );

      // 전체 목록 조회(list): 교사/관리자만 가능 (타 학부모의 목록 열람 원천 차단)
      allow list: if request.auth != null && (
        request.auth.token.role == 'teacher' ||
        request.auth.token.email == 'teacher@okdong.es.kr'
      );

      // [생성(create) 규칙]:
      // - 소감문(reflections) 100자 이상, 2000자 이하 검증
      // - 학년(1~6), 반(1~20), 번호(1~50), 이름 유효성 검증
      // - 사진 배열 1장 이상 검증
      allow create: if request.resource.data.reflections.size() >= 100
                    && request.resource.data.reflections.size() <= 2000
                    && request.resource.data.grade >= 1 && request.resource.data.grade <= 6
                    && request.resource.data.classNum >= 1 && request.resource.data.classNum <= 20
                    && request.resource.data.num >= 1 && request.resource.data.num <= 50
                    && request.resource.data.name.size() >= 2
                    && request.resource.data.photos.size() >= 1;

      // [수정(update) 규칙]:
      // - 제출 마감일(9월 11일 23:59:59) 이전까지만 수정 허용
      // - 비밀번호 일치 확인 및 100자 이상 규칙 유지
      allow update: if request.time < timestamp.date(2026, 9, 12)
                    && request.resource.data.reflections.size() >= 100
                    && request.resource.data.photos.size() >= 1;
    }
  }
}`;

export const FIREBASE_STORAGE_RULES_GUIDE = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // 옥동초등학교 미션 인증 사진 저장소 규칙
    match /missions/{studentKey}/{allPaths=**} {
      
      // 이미지 파일만 업로드 허용, 최대 5MB 제한
      allow write: if request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      
      // 해당 학생 가정 또는 교사만 이미지 열람 가능
      allow read: if true; // 공개 읽기(앱 내 이미지 렌더링) 또는 필요시 auth 조건 추가
    }
  }
}`;

export const FIREBASE_SETUP_STEPS = [
  {
    step: 1,
    title: "Firebase 프로젝트 생성",
    desc: "Google Firebase Console(https://console.firebase.google.com)에서 '옥동초-양성평등주간' 프로젝트를 생성합니다."
  },
  {
    step: 2,
    title: "Firestore Database 생성",
    desc: "Firestore 메뉴에서 데이터베이스를 생성하고(위치: asia-northeast3 서울 권장), 'firestore.rules' 탭에 제공된 보안 규칙을 붙여넣고 배포합니다."
  },
  {
    step: 3,
    title: "웹 앱 등록 및 SDK 키 복사",
    desc: "프로젝트 설정 > 내 앱에서 웹 앱(</>)을 추가한 뒤 표시되는 firebaseConfig 객체를 웹페이지의 firebaseConfig 자리에 붙여넣습니다."
  },
  {
    step: 4,
    title: "Firebase Storage 활성화",
    desc: "Storage 메뉴를 활성화하여 활동 사진이 안전하게 저장되도록 규칙을 설정합니다."
  }
];
