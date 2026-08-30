# SK Escape Consultation Landing Page

토지 투자 전문 기업 SK Escape의 무료 상담 신청 랜딩페이지입니다.

## 🚀 기능

- ✅ 반응형 웹 디자인 (PC/모바일)
- ✅ 상담신청 폼 (이름, 연락처, 투자 금액, 상담 내용)
- ✅ 실시간 Telegram 알림
- ✅ 폼 검증 및 에러 처리
- ✅ 성공 메시지 표시
- ✅ 하단 고정 CTA 버튼

## 🛠️ 기술 스택

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend API**: Vercel Serverless Functions (Node.js)
- **Notifications**: Telegram Bot API
- **Deployment**: Vercel

## 📦 프로젝트 구조

```
.
├── index.html              # 메인 페이지
├── api/
│   └── contact.js         # 상담신청 API 엔드포인트
├── package.json           # NPM 설정
├── vercel.json            # Vercel 배포 설정
├── .env.example           # 환경변수 예시
└── .env                   # 환경변수 (Git에 포함 안 됨)
```

## 🔧 설치 및 개발

### 필수 사항
- Node.js 18.x 이상
- Telegram Bot Token (BotFather에서 발급)

### 로컬 설정

1. **의존성 설치**
```bash
npm install
```

2. **환경변수 설정**
```bash
# .env 파일에 Telegram Bot Token 입력
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=8824117359
```

3. **개발 서버 실행**
```bash
npm run dev
```

4. **빌드**
```bash
npm run build
```

## 📱 배포 (Vercel)

### GitHub 저장소 연결
1. GitHub에서 `consultation-landing-page` 저장소 생성
2. 로컬 저장소를 GitHub에 Push
3. Vercel Dashboard에서 GitHub 저장소 연결
4. Vercel에서 환경변수 설정

### Vercel 환경변수 설정

Vercel Dashboard → Project Settings → Environment Variables에서:

```
TELEGRAM_BOT_TOKEN = your_bot_token_here
TELEGRAM_CHAT_ID = 8824117359
```

### 배포
```bash
vercel deploy --prod
```

## 🤖 Telegram Bot 설정

### Bot 생성
1. Telegram에서 [@BotFather](https://t.me/BotFather) 메시지
2. `/newbot` 명령 입력
3. Bot 이름과 사용자명 입력
4. 발급받은 Token을 `.env`의 `TELEGRAM_BOT_TOKEN`에 입력

### Chat ID 확인
1. [@userinfobot](https://t.me/userinfobot)에 메시지
2. Your ID 확인 (숫자 값)
3. `.env`의 `TELEGRAM_CHAT_ID`에 입력

## 📊 API 엔드포인트

### POST /api/contact

상담신청 데이터를 수신하고 Telegram으로 알림을 전송합니다.

**요청 예시:**
```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "amount": "10000_30000",
  "content": "land",
  "message": "용인 인근 토지 상담 희망",
  "agree": true,
  "timestamp": "2024-08-30T14:30:00Z"
}
```

**응답 예시:**
```json
{
  "success": true,
  "message": "상담 신청이 접수되었습니다. 빠른 시간 내에 연락드리겠습니다."
}
```

## 🔒 보안

- Telegram Bot Token은 코드에 하드코딩하지 않음
- 환경변수로만 관리
- `.env` 파일은 `.gitignore`에 포함되어 Git 커밋 안 됨
- 모든 입력값은 검증됨

## 📝 라이선스

© THE SK. All rights reserved.

## 👨‍💼 회사 정보

**주식회사 더에스케이파트너스**
- 대표자: 김현구
- 사업자등록번호: 830-81-03687
- 법인등록번호: 130111-0129868

---

문제 발생 시 GitHub Issues에 등록해주세요.
