최종 완성본을 아래와 같이 정리해 드립니다.
복사해서 README.md에 붙여 넣으면 바로 사용하실 수 있습니다.

---

# 🎃 React + Express Server를 이용한 SNS 만들기

이 프로젝트는 **React + Express + MySQL 기반**의 **할로윈 테마 미니 SNS**입니다.
할로윈 몬스터 캐릭터를 **피드, 알림, 배경**에 활용하여 재미를 더했습니다.

---

## 📸 미리보기

![프로젝트 배너](./assets/banner.png)

---

## 🛠️ 사용 기술

* **Frontend**: React, MUI
* **Backend**: Node.js, Express, JWT, Bcrypt
* **Database**: MySQL
* **배포환경**: Localhost

---

## 🧩 주요 기능

* ✅ 회원가입 / 로그인 (JWT 인증)
* ✅ 피드 작성 / 수정 / 삭제 / 이미지 첨부
* ✅ 댓글 / 좋아요 / 팔로우
* ✅ 알림 기능 (맨션 알림)
* ✅ 마이페이지 프로필 수정
* ✅ 할로윈 테마 UI 적용

---

## ⚙️ 설치 및 실행

```bash
git clone https://github.com/yourname/your-project.git
cd your-project

# 클라이언트 실행
cd client
npm install
npm start

# 서버 실행
cd server
npm install
npm start
```

---

## 🔐 JWT 인증 설명

\*\*JWT(Json Web Token)\*\*는 서버가 발급한 사용자 인증 토큰으로
서버가 세션 없이도 사용자를 식별할 수 있는 **토큰 기반 인증 방식**입니다.

1. **로그인 성공 시 토큰 발급** (user\_id 포함)
2. **프론트엔드에 토큰 저장** (localStorage)
3. **요청 시 Authorization 헤더에 토큰 전달**
4. **서버는 토큰을 검증해 권한 처리**

* ✅ 장점: 서버 확장성, 상태 없는 인증, 간편한 API 인증
* ⚠️ 주의: HTTPS 사용 필수, 토큰 노출 방지, 민감 정보 금지

---

## 🗂️ 폴더 구조

```
root/
 ├── client/        # React 프론트엔드
 │    ├── public/
 │    └── src/
 └── server/        # Express 백엔드
      ├── routes/    # API 라우터
      ├── middleware/ # 인증 미들웨어
      ├── uploads/    # 업로드 파일 저장
      └── db.js      # 데이터베이스 연결
```

---

필요 시 라이선스, 기여 방법, 연락처를 추가해도 좋습니다.
배포 링크나 데모 링크도 있다면 맨 위에 추가해보세요.
혹시 추가하고 싶은 항목이 있을까요?
