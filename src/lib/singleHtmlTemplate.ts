export function generateSingleFileHtml(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>옥동초등학교 양성평등주간 미션 '우리집 스위치 ON'</title>
  <meta name="description" content="옥동초등학교 양성평등주간 역할 바꾸기 미션 제출 웹앱">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Pretendard Web Font -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
  <!-- Canvas Confetti for Celebration -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>

  <!-- Firebase SDK v9 (Compat 모드 또는 모듈 방식으로 쉽게 사용 가능) -->
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js"></script>

  <style>
    body {
      font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #cbd5e1;
      border-radius: 9999px;
    }
  </style>
</head>
<body class="bg-amber-50/50 text-slate-800 min-h-screen antialiased selection:bg-amber-200">

  <!-- =============================== -->
  <!-- 1. 상단 마감일 D-Day 카운트다운 배너 -->
  <!-- =============================== -->
  <header class="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-md">
    <div class="max-w-3xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div class="flex items-center gap-2.5 text-center sm:text-left">
        <span class="inline-flex p-2 bg-white/20 rounded-xl text-xl">💡</span>
        <div>
          <div class="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-amber-100 tracking-wide uppercase">
            <span>옥동초등학교</span>
            <span>•</span>
            <span>양성평등주간 행사</span>
          </div>
          <h1 class="text-base sm:text-lg font-bold tracking-tight">우리집 스위치 ON (역할 바꾸기 미션)</h1>
        </div>
      </div>

      <!-- D-Day 태그 및 남은 시간 카운터 -->
      <div class="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/20">
        <span class="bg-white text-orange-600 font-extrabold text-xs px-2 py-0.5 rounded-full shadow-sm" id="ddayBadge">D-Day</span>
        <div class="text-xs sm:text-sm font-medium tracking-tight text-white flex items-center gap-1" id="ddayTimer">
          <span>마감: 9월 11일 23:59</span>
        </div>
      </div>
    </div>
  </header>

  <!-- 메인 컨테이너 -->
  <main class="max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6">

    <!-- 안내 카드 -->
    <section class="bg-white/90 backdrop-blur rounded-2xl p-5 sm:p-6 shadow-sm border border-amber-100/80">
      <div class="flex items-start gap-3.5">
        <div class="p-2.5 bg-amber-100 text-amber-800 rounded-xl text-xl flex-shrink-0">🔄</div>
        <div>
          <h2 class="text-base sm:text-lg font-bold text-slate-800">가족과 함께하는 '우리집 스위치 ON' 미션</h2>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            학생과 가족이 하루 동안 역할을 바꾸어 실천해 보는 소중한 시간입니다.<br>
            가정별로 로그인 후 바꾼 역할, 활동 사진, 100자 이상의 진솔한 소감문을 작성해 주세요!
          </p>
        </div>
      </div>
    </section>

    <!-- =============================== -->
    <!-- 2. 로그인 / 학부모 인증 카드 -->
    <!-- =============================== -->
    <section id="authSection" class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl mb-2 text-2xl font-bold">
          🏠
        </div>
        <h2 class="text-lg sm:text-xl font-bold text-slate-800">가정별 로그인 &amp; 참여</h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          자녀의 학년, 반, 번호, 이름과 4자리 비밀번호를 입력해 주세요.
        </p>
      </div>

      <form id="authForm" class="space-y-4" onsubmit="handleAuthSubmit(event)">
        <div class="grid grid-cols-3 gap-2.5 sm:gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">학년 <span class="text-rose-500">*</span></label>
            <select id="gradeInput" required class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
              <option value="">선택</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
              <option value="4">4학년</option>
              <option value="5">5학년</option>
              <option value="6">6학년</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">반 <span class="text-rose-500">*</span></label>
            <input type="number" id="classInput" min="1" max="20" placeholder="예: 2" required class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">번호 <span class="text-rose-500">*</span></label>
            <input type="number" id="numInput" min="1" max="50" placeholder="예: 15" required class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">학생 이름 <span class="text-rose-500">*</span></label>
          <input type="text" id="nameInput" placeholder="예: 김옥동" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
        </div>

        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="block text-xs font-semibold text-slate-700">비밀번호 (숫자 4자리) <span class="text-rose-500">*</span></label>
            <span class="text-[11px] text-slate-400">제출 조회/수정 시 사용</span>
          </div>
          <input type="password" id="pwInput" maxlength="4" pattern="[0-9]{4}" inputmode="numeric" placeholder="4자리 숫자 입력 (예: 1234)" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm tracking-widest focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
        </div>

        <button type="submit" class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-md hover:shadow transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2">
          <span>미션 작성 및 조회하기</span>
          <span>➜</span>
        </button>
      </form>
    </section>

    <!-- =============================== -->
    <!-- 3. 로그인 후 상태 헤더 -->
    <!-- =============================== -->
    <div id="userHeader" class="hidden bg-amber-100/90 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-xs sm:text-sm font-semibold text-slate-800" id="userHeaderInfo">3학년 2반 14번 김민서 가정</span>
      </div>
      <button onclick="handleLogout()" class="text-xs text-slate-500 hover:text-rose-600 underline font-medium">로그아웃</button>
    </div>

    <!-- =============================== -->
    <!-- 4. 제출 완료 화면 (조회 및 재수정) -->
    <!-- =============================== -->
    <section id="submittedViewSection" class="hidden bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-200 space-y-6">
      <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 text-center">
        <span class="inline-flex p-2 bg-emerald-500 text-white rounded-full text-lg mb-2">✓</span>
        <h3 class="text-base sm:text-lg font-bold text-emerald-900">이미 미션 제출이 완료되었습니다!</h3>
        <p class="text-xs sm:text-sm text-emerald-700 mt-1">옥동초등학교 양성평등주간 실천에 참여해 주셔서 감사합니다. ❤️</p>
        <p class="text-[11px] text-emerald-600/80 mt-1" id="submittedTimeText">제출일시: -</p>
      </div>

      <div class="space-y-4">
        <div class="border-b border-slate-100 pb-3">
          <span class="text-xs font-semibold text-slate-400">바꾼 역할 내용</span>
          <p class="text-sm font-bold text-slate-800 mt-0.5" id="viewRoleCategory">-</p>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 bg-slate-50 p-2.5 rounded-xl" id="viewRoleDetail">-</p>
        </div>

        <div class="border-b border-slate-100 pb-3">
          <span class="text-xs font-semibold text-slate-400">활동 인증 사진</span>
          <div class="grid grid-cols-2 gap-2 mt-2" id="viewPhotosContainer">
            <!-- 사진 미리보기 렌더링 -->
          </div>
        </div>

        <div>
          <span class="text-xs font-semibold text-slate-400">가족 소감문</span>
          <p class="text-xs sm:text-sm text-slate-700 mt-1.5 bg-amber-50/50 border border-amber-100 p-3.5 rounded-xl whitespace-pre-wrap leading-relaxed" id="viewReflections">-</p>
        </div>
      </div>

      <div class="flex gap-2.5 pt-2">
        <button onclick="enableEditMode()" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition-all">
          ✏️ 내용 수정하기
        </button>
      </div>
    </section>

    <!-- =============================== -->
    <!-- 5. 미션 제출 Form -->
    <!-- =============================== -->
    <section id="formSection" class="hidden bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h2 class="text-lg font-bold text-slate-800" id="formTitle">📝 미션 실천 내용 제출하기</h2>
          <p class="text-xs text-slate-500 mt-0.5">역할을 바꾸어 진행한 활동 내용과 사진, 소감을 남겨주세요.</p>
        </div>
        <span class="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">우리집 스위치 ON</span>
      </div>

      <form id="missionForm" class="space-y-6" onsubmit="handleMissionSubmit(event)">
        
        <!-- 1) 역할 바꾼 내용 선택/입력 -->
        <div class="space-y-2">
          <label class="block text-xs sm:text-sm font-bold text-slate-800">
            1. 바꾼 역할 선택 및 세부 내용 <span class="text-rose-500">*</span>
          </label>
          <select id="roleCategorySelect" onchange="handleRoleCategoryChange()" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none">
            <option value="">어떤 역할을 서로 바꾸었나요?</option>
            <option value="아빠 ↔ 자녀 (요리 & 밥상 차리기 / 청소)">아빠 ↔ 자녀 (요리 &amp; 밥상 차리기 / 청소)</option>
            <option value="엄마 ↔ 자녀 (빨래 개기 / 분리수거 / 설거지)">엄마 ↔ 자녀 (빨래 개기 / 분리수거 / 설거지)</option>
            <option value="부모님 ↔ 자녀 (가족 하루 스케줄 관리 & 집안 정리)">부모님 ↔ 자녀 (가족 하루 스케줄 관리 &amp; 집안 정리)</option>
            <option value="형제 ↔ 자매 (각자의 방 청소 및 물건 정리 역할 교환)">형제 ↔ 자매 (각자의 방 청소 및 물건 정리 역할 교환)</option>
            <option value="custom">직접 입력 (우리 가족만의 특별한 역할 바꾸기)</option>
          </select>

          <input type="text" id="roleCustomInput" placeholder="직접 역할을 입력해 주세요 (예: 할머니-손자 화분 물주기 & 시장보기)" class="hidden w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none">

          <textarea id="roleDetailInput" rows="2" placeholder="어떤 활동을 구체적으로 바꾸어 수행했는지 간단히 적어주세요. (예: 아빠가 저녁 식사를 준비하고, 자녀가 빨래를 개었습니다.)" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"></textarea>
        </div>

        <!-- 2) 사진 업로드 (1장 이상) -->
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <label class="block text-xs sm:text-sm font-bold text-slate-800">
              2. 인증 사진 업로드 (1장 이상 필수) <span class="text-rose-500">*</span>
            </label>
            <span class="text-[11px] text-slate-400" id="photoCountBadge">0장 등록됨</span>
          </div>

          <div class="border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50/70 hover:bg-amber-50/30 rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-colors" onclick="document.getElementById('photoFileInput').click()">
            <input type="file" id="photoFileInput" accept="image/*" multiple class="hidden" onchange="handlePhotoSelect(event)">
            <div class="text-3xl mb-1.5">📷</div>
            <p class="text-xs sm:text-sm font-semibold text-slate-700">활동 사진을 터치하여 업로드해 주세요</p>
            <p class="text-[11px] text-slate-400 mt-0.5">JPG, PNG 등 이미지 파일 (최대 3장 권장)</p>
          </div>

          <!-- 업로드된 사진 미리보기 목록 -->
          <div id="photosPreviewGrid" class="grid grid-cols-3 gap-2.5 pt-1">
            <!-- Dynamic Previews -->
          </div>
        </div>

        <!-- 3) 소감문 작성 (100자 이상 실시간 카운터) -->
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <label class="block text-xs sm:text-sm font-bold text-slate-800">
              3. 가족 소감문 작성 (100자 이상) <span class="text-rose-500">*</span>
            </label>
            <!-- 실시간 카운터 배지 -->
            <span id="charCountBadge" class="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
              0 / 100자
            </span>
          </div>

          <!-- 소감문 팁 -->
          <div class="bg-amber-50 border border-amber-100 rounded-xl p-2.5 text-[11px] text-amber-800 flex items-start gap-2">
            <span class="text-amber-600 font-bold">💡 팁:</span>
            <span>역할을 바꾸어 보며 느낀 점, 평소 가족의 노고에 대한 감사함, 양성평등의 가치 등을 100자 이상 작성해 주세요.</span>
          </div>

          <textarea id="reflectionsInput" rows="5" placeholder="역할을 바꾸어 실천하며 가족 모두가 느낀 솔직하고 따뜻한 소감을 100자 이상 적어주세요." oninput="handleReflectionInput()" required class="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none leading-relaxed custom-scrollbar"></textarea>

          <!-- 글자 수 미달 안내 및 프로그레스 바 -->
          <div class="space-y-1">
            <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div id="charProgressBar" class="bg-amber-400 h-full w-0 transition-all duration-200"></div>
            </div>
            <p id="charStatusText" class="text-[11px] text-slate-400 font-medium">100자 이상 작성해야 제출 버튼이 활성화됩니다. (100자 남음)</p>
          </div>
        </div>

        <!-- 제출 버튼 (100자 미만 및 필수값 누락 시 비활성화) -->
        <div class="pt-2">
          <button type="submit" id="submitBtn" disabled class="w-full py-3.5 bg-slate-300 text-slate-500 font-bold rounded-xl text-sm sm:text-base cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2">
            <span id="submitBtnText">100자 이상 작성 후 제출 가능합니다</span>
          </button>
        </div>

      </form>
    </section>

    <!-- 학교 Footer & 교사용 링크 -->
    <footer class="text-center text-xs text-slate-400 pt-6 pb-12 space-y-2">
      <p>© 옥동초등학교 양성평등주간 교육활동</p>
      <p class="text-[11px] text-slate-400">
        제출된 모든 내용은 본인 가정 및 담당 교사 외에 절대 공개되지 않습니다.
      </p>
    </footer>

  </main>

  <!-- =============================== -->
  <!-- Javascript & Firebase Logic -->
  <!-- =============================== -->
  <script>
    /* ============================================================
     * [Firebase SDK 연동 설정 공간]
     * Firebase를 실제 연결하려면 아래 주석을 풀고 프로젝트 키를 넣어주세요.
     * 키가 없더라도 로컬 스토리지(LocalStorage)로 100% 정상 작동합니다.
     * ============================================================ */
    const firebaseConfig = {
      // apiKey: "YOUR_FIREBASE_API_KEY",
      // authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      // projectId: "YOUR_PROJECT_ID",
      // storageBucket: "YOUR_PROJECT_ID.appspot.com",
      // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      // appId: "YOUR_APP_ID"
    };

    let isFirebaseReady = false;
    let db = null;
    let storage = null;
    let auth = null;

    if (firebaseConfig.apiKey) {
      try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        storage = firebase.storage();
        auth = firebase.auth();
        isFirebaseReady = true;
        console.log("Firebase initialized successfully!");
      } catch (e) {
        console.warn("Firebase config error, falling back to LocalStorage:", e);
      }
    }

    // App State
    let currentUser = null;
    let currentUploadedPhotos = [];
    let existingSubmission = null;

    // 1. D-Day 카운트다운 타이머 (9월 11일 23:59:59)
    function updateDDay() {
      const now = new Date();
      const currentYear = now.getFullYear();
      let targetDate = new Date(currentYear, 8, 11, 23, 59, 59); // 9월은 index 8

      // 만약 9월 11일이 지난 시점이면 내년 9월 11일로 기준
      if (now > targetDate && now.getMonth() > 8) {
        targetDate = new Date(currentYear + 1, 8, 11, 23, 59, 59);
      }

      const diffMs = targetDate - now;
      const ddayBadge = document.getElementById('ddayBadge');
      const ddayTimer = document.getElementById('ddayTimer');

      if (diffMs <= 0) {
        ddayBadge.textContent = '마감됨';
        ddayBadge.className = 'bg-rose-600 text-white font-extrabold text-xs px-2 py-0.5 rounded-full';
        ddayTimer.innerHTML = '<span>제출이 마감되었습니다</span>';
        return;
      }

      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const diffMins = Math.floor((diffMs / (1000 * 60)) % 60);
      const diffSecs = Math.floor((diffMs / 1000) % 60);

      ddayBadge.textContent = diffDays === 0 ? 'D-Day' : \`D-\${diffDays}\`;
      ddayTimer.innerHTML = \`<span>마감까지 \${diffDays}일 \${diffHours}시간 \${diffMins}분 \${diffSecs}초</span>\`;
    }

    setInterval(updateDDay, 1000);
    updateDDay();

    // 2. 학생 고유 식별키 생성
    function getStudentKey(grade, classNum, num, name) {
      return \`g\${grade}_c\${classNum}_n\${num}_\${name.trim()}\`;
    }

    // 3. 로그인 및 인증 처리
    function handleAuthSubmit(event) {
      event.preventDefault();
      const grade = document.getElementById('gradeInput').value;
      const classNum = document.getElementById('classInput').value;
      const num = document.getElementById('numInput').value;
      const name = document.getElementById('nameInput').value.trim();
      const password = document.getElementById('pwInput').value.trim();

      if (!grade || !classNum || !num || !name || password.length !== 4) {
        alert('모든 필수 항목과 4자리 비밀번호를 올바르게 입력해 주세요.');
        return;
      }

      const studentKey = getStudentKey(grade, classNum, num, name);
      currentUser = { grade, classNum, num, name, password, studentKey };

      // 비밀번호 검증 및 기존 제출 데이터 확인
      loadSubmissionForUser(studentKey, password);
    }

    // 제출 내역 로드
    async function loadSubmissionForUser(studentKey, password) {
      // 로컬 스토리지 또는 Firestore에서 로드
      let submission = null;

      if (isFirebaseReady && db) {
        try {
          const docRef = await db.collection("okdong_missions").doc(studentKey).get();
          if (docRef.exists) {
            submission = docRef.data();
          }
        } catch (err) {
          console.error("Firestore read error:", err);
        }
      } else {
        const stored = localStorage.getItem("okdong_submission_" + studentKey);
        if (stored) {
          submission = JSON.parse(stored);
        }
      }

      if (submission) {
        if (submission.password && submission.password !== password) {
          alert('비밀번호가 일치하지 않습니다. 처음 설정하신 4자리 숫자를 입력해 주세요.');
          return;
        }
        existingSubmission = submission;
        showSubmittedView(submission);
      } else {
        existingSubmission = null;
        showSubmissionForm();
      }

      // 헤더 표시
      document.getElementById('authSection').classList.add('hidden');
      document.getElementById('userHeader').classList.remove('hidden');
      document.getElementById('userHeaderInfo').textContent = \`\${currentUser.grade}학년 \${currentUser.classNum}반 \${currentUser.num}번 \${currentUser.name} 가정\`;
    }

    // 4. 소감문 글자 수 실시간 검증 (100자 이상)
    function handleReflectionInput() {
      const text = document.getElementById('reflectionsInput').value;
      const count = text.length;
      const charBadge = document.getElementById('charCountBadge');
      const progressBar = document.getElementById('charProgressBar');
      const statusText = document.getElementById('charStatusText');
      const submitBtn = document.getElementById('submitBtn');
      const submitBtnText = document.getElementById('submitBtnText');

      charBadge.textContent = \`\${count} / 100자\`;
      const progressPercent = Math.min(100, Math.round((count / 100) * 100));
      progressBar.style.width = \`\${progressPercent}%\`;

      if (count >= 100) {
        charBadge.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 animate-bounce';
        progressBar.className = 'bg-emerald-500 h-full transition-all duration-200';
        statusText.textContent = '🌟 100자 이상 충족 완료! 정성 가득한 소감문입니다.';
        statusText.className = 'text-[11px] text-emerald-600 font-semibold';

        // 사진 1장 이상 체크
        if (currentUploadedPhotos.length > 0) {
          submitBtn.disabled = false;
          submitBtn.className = 'w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold rounded-xl text-sm sm:text-base shadow-lg hover:shadow cursor-pointer transition-all duration-200 flex items-center justify-center gap-2';
          submitBtnText.textContent = existingSubmission ? '수정된 미션 다시 제출하기 ✨' : '우리집 스위치 ON 미션 제출하기 ✨';
        } else {
          submitBtn.disabled = true;
          submitBtn.className = 'w-full py-3.5 bg-slate-300 text-slate-500 font-bold rounded-xl text-sm sm:text-base cursor-not-allowed';
          submitBtnText.textContent = '인증 사진을 1장 이상 등록해 주세요';
        }
      } else {
        const remaining = 100 - count;
        charBadge.className = 'text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200';
        progressBar.className = 'bg-amber-400 h-full transition-all duration-200';
        statusText.textContent = \`100자 이상 작성해야 제출 버튼이 활성화됩니다. (\${remaining}자 남음)\`;
        statusText.className = 'text-[11px] text-slate-400 font-medium';

        submitBtn.disabled = true;
        submitBtn.className = 'w-full py-3.5 bg-slate-300 text-slate-500 font-bold rounded-xl text-sm sm:text-base cursor-not-allowed';
        submitBtnText.textContent = \`소감문 100자 이상 작성 필요 (\${remaining}자 남음)\`;
      }
    }

    // 역할 카테고리 변경 처리
    function handleRoleCategoryChange() {
      const val = document.getElementById('roleCategorySelect').value;
      const customInput = document.getElementById('roleCustomInput');
      if (val === 'custom') {
        customInput.classList.remove('hidden');
        customInput.required = true;
      } else {
        customInput.classList.add('hidden');
        customInput.required = false;
      }
    }

    // 사진 선택 및 Base64 변환 / 업로드
    function handlePhotoSelect(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          currentUploadedPhotos.push(e.target.result);
          renderPhotosPreview();
          handleReflectionInput(); // 사진 유무에 따른 버튼 활성화 갱신
        };
        reader.readAsDataURL(file);
      });
    }

    function removePhoto(index) {
      currentUploadedPhotos.splice(index, 1);
      renderPhotosPreview();
      handleReflectionInput();
    }

    function renderPhotosPreview() {
      const grid = document.getElementById('photosPreviewGrid');
      const countBadge = document.getElementById('photoCountBadge');
      grid.innerHTML = '';
      countBadge.textContent = \`\${currentUploadedPhotos.length}장 등록됨\`;

      currentUploadedPhotos.forEach((src, idx) => {
        const item = document.createElement('div');
        item.className = 'relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100';
        item.innerHTML = \`
          <img src="\${src}" class="w-full h-full object-cover">
          <button type="button" onclick="removePhoto(\${idx})" class="absolute top-1 right-1 bg-rose-500/80 hover:bg-rose-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow">✕</button>
        \`;
        grid.appendChild(item);
      });
    }

    // 5. 미션 제출 처리
    async function handleMissionSubmit(event) {
      event.preventDefault();
      if (!currentUser) return;

      const roleCategorySelect = document.getElementById('roleCategorySelect').value;
      const roleCustomInput = document.getElementById('roleCustomInput').value.trim();
      const roleCategory = roleCategorySelect === 'custom' ? roleCustomInput : roleCategorySelect;
      const roleDetail = document.getElementById('roleDetailInput').value.trim();
      const reflections = document.getElementById('reflectionsInput').value.trim();

      if (reflections.length < 100) {
        alert('소감문을 100자 이상 작성해 주세요.');
        return;
      }
      if (currentUploadedPhotos.length === 0) {
        alert('인증 사진을 최소 1장 이상 등록해 주세요.');
        return;
      }

      const payload = {
        studentKey: currentUser.studentKey,
        grade: currentUser.grade,
        classNum: currentUser.classNum,
        num: currentUser.num,
        name: currentUser.name,
        password: currentUser.password,
        roleCategory,
        roleDetail,
        photos: currentUploadedPhotos,
        reflections,
        submittedAt: new Date().toISOString()
      };

      // Firestore 저장 또는 LocalStorage 저장
      if (isFirebaseReady && db) {
        try {
          await db.collection("okdong_missions").doc(currentUser.studentKey).set(payload);
        } catch (e) {
          console.error("Firestore save error:", e);
          localStorage.setItem("okdong_submission_" + currentUser.studentKey, JSON.stringify(payload));
        }
      } else {
        localStorage.setItem("okdong_submission_" + currentUser.studentKey, JSON.stringify(payload));
      }

      // 축하 폭죽 효과 (Confetti)
      if (window.confetti) {
        window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }

      existingSubmission = payload;
      showSubmittedView(payload);
    }

    // 제출 완료 화면 표시
    function showSubmittedView(sub) {
      document.getElementById('formSection').classList.add('hidden');
      document.getElementById('submittedViewSection').classList.remove('hidden');

      document.getElementById('submittedTimeText').textContent = '제출일시: ' + new Date(sub.submittedAt).toLocaleString('ko-KR');
      document.getElementById('viewRoleCategory').textContent = sub.roleCategory || '-';
      document.getElementById('viewRoleDetail').textContent = sub.roleDetail || '-';
      document.getElementById('viewReflections').textContent = sub.reflections || '-';

      const photoContainer = document.getElementById('viewPhotosContainer');
      photoContainer.innerHTML = '';
      if (sub.photos && sub.photos.length > 0) {
        sub.photos.forEach(src => {
          const img = document.createElement('img');
          img.src = src;
          img.className = 'w-full h-40 object-cover rounded-xl border border-slate-200 shadow-sm';
          photoContainer.appendChild(img);
        });
      }
    }

    // 작성 폼 표시
    function showSubmissionForm() {
      document.getElementById('submittedViewSection').classList.add('hidden');
      document.getElementById('formSection').classList.remove('hidden');

      if (existingSubmission) {
        document.getElementById('formTitle').textContent = '✏️ 제출 내용 수정하기';
        document.getElementById('roleCategorySelect').value = existingSubmission.roleCategory.includes('자녀') ? existingSubmission.roleCategory : 'custom';
        if (document.getElementById('roleCategorySelect').value === 'custom') {
          document.getElementById('roleCustomInput').value = existingSubmission.roleCategory;
          document.getElementById('roleCustomInput').classList.remove('hidden');
        }
        document.getElementById('roleDetailInput').value = existingSubmission.roleDetail || '';
        document.getElementById('reflectionsInput').value = existingSubmission.reflections || '';
        currentUploadedPhotos = [...(existingSubmission.photos || [])];
        renderPhotosPreview();
        handleReflectionInput();
      } else {
        document.getElementById('missionForm').reset();
        currentUploadedPhotos = [];
        renderPhotosPreview();
        handleReflectionInput();
      }
    }

    function enableEditMode() {
      showSubmissionForm();
    }

    function handleLogout() {
      currentUser = null;
      existingSubmission = null;
      currentUploadedPhotos = [];
      document.getElementById('userHeader').classList.add('hidden');
      document.getElementById('formSection').classList.add('hidden');
      document.getElementById('submittedViewSection').classList.add('hidden');
      document.getElementById('authSection').classList.remove('hidden');
      document.getElementById('authForm').reset();
    }
  </script>
</body>
</html>`;
}
