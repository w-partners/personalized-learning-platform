# 개인화 AI 학습 플랫폼 MVP

## 📘 프로젝트 개요

ChatGPT Custom Function 기반으로 학생의 개별 성취도와 개념 이해 상태에 따라 자동으로 문제를 생성하고 반복 학습을 유도하는 AI 기반 MVP 시스템

### 🎯 핵심 목표
- 학생 개별 성취도 관리 (개념별 이해도 1-5단계)
- ChatGPT를 통한 자동 문제 생성 및 피드백
- 서버는 최소한의 중개 역할만 담당

### 🛠 기술 스택
- **백엔드**: FastAPI + PostgreSQL + Docker
- **연동**: ChatGPT Custom Function (Webhook 기반)
- **문서 변환**: HTML → PDF 생성
- **배포**: Docker Compose + SSH 서버

## 📋 작업 계획

### 작업 목록 (총 7개)
1. ✅ **프로젝트 환경 초기화 및 Docker 구성** - 진행 중
2. ⏳ **데이터베이스 스키마 설계 및 구현**
3. ⏳ **FastAPI 웹서버 기본 구조 구현**
4. ⏳ **학생 정보 관리 API 구현**
5. ⏳ **ChatGPT Custom Function 연동 Webhook 구현**
6. ⏳ **HTML to PDF 변환 기능 구현**
7. ⏳ **Docker 배포 및 통합 테스트**

## 🔄 실행 로그

### 2025-06-17 04:38
- 프로젝트 디렉토리 생성: `/home/mvp1/projects/개인화AI학습플랫폼MVP`
- Git 저장소 초기화 완료
- README.md 기본 구조 생성


### 2025-06-17 04:42
- Git 저장소 로컬 초기화 완료
- .gitignore 파일 생성 (Python, Docker, 환경변수 등)
- GitHub CLI 설치 완료 (v2.74.1)
- 첫 번째 커밋 완료: 프로젝트 기본 구조
- **다음 단계**: GitHub 원격 저장소 연결 예정

### 작업 진행 상황
- ✅ 프로젝트 디렉토리 생성
- ✅ Git 초기화
- ✅ README.md 구조 설정  
- ✅ .gitignore 구성
- ⏳ GitHub 원격 저장소 연결 (대기 중)


### 2025-06-17 04:45
- Git 원격 저장소 URL 설정 완료
  - Origin: https://github.com/mvp1-user/personalized-learning-platform.git
- GitHub 인증이 필요한 상태 (Personal Access Token 또는 SSH 키)
- **결정**: 로컬에서 개발 진행 후 나중에 GitHub 연결

### 📋 GitHub 연결 계획
1. Personal Access Token 생성 또는 SSH 키 등록
2. Git credential 설정
3. 첫 push 실행
4. GitHub 저장소 공개 후 자동 배포 설정

**현재 상황**: 로컬 Git 저장소 완료, 원격 연결 대기 중


### 2025-06-17 04:56
- 🚀 연속 실행 모드 시작

- restore_point.json 생성 (세션 복원 포인트)
- auto_git_record.sh 자동 Git 기록 시스템 구축
- 에러 처리 및 재시도 로직 활성화
- 다음: Task 1 실행 - Docker 환경 구성

### 2025-06-17 05:03
- ✅ Task 1 완료: 프로젝트 환경 초기화 및 Docker 구성

📦 생성된 파일들:
- docker-compose.yml (웹서버 + PostgreSQL 구성)
- Dockerfile (Python 3.11 기반)
- requirements.txt (FastAPI, PostgreSQL 등)
- app/main.py (기본 FastAPI 애플리케이션)
- .env.example (환경 변수 템플릿)

🚀 실행 상태:
- PostgreSQL: 5433 포트에서 healthy 상태
- Web Server: 8000 포트에서 정상 응답
- Health Check: ✅ 통과

🔄 다음 단계: Task 2 - 데이터베이스 스키마 설계

### 2025-06-17 05:48
- ✅ Task 2 완료: 데이터베이스 스키마 설계 및 구현

🗄️ 완성된 구성요소:
- SQLAlchemy Student 모델 (JSONB 개념별 이해도)
- PostgreSQL 테이블 생성 완료 (students)
- StudentService CRUD 클래스 구현
- 데이터베이스 연결 모듈 (database.py)
- 마이그레이션 스크립트 (migrations/init_db.py)

✅ 서버 테스트 결과:
- PostgreSQL 연결: ✅ 성공
- 테이블 생성: ✅ students 테이블 + 인덱스
- CRUD 작업: ✅ 생성/조회/업데이트 모두 통과
- API 문서: ✅ /docs 정상 생성

📊 테이블 구조:
- id (SERIAL PRIMARY KEY)
- student_code (VARCHAR 50, UNIQUE) 
- name, grade, school
- concepts (JSONB) - 개념별 이해도 1-5점
- created_at, updated_at, notes, parent_email

🔄 다음 단계: Task 3 - FastAPI 웹서버 기본 구조
