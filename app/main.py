"""
FastAPI 메인 애플리케이션
개인화 AI 학습 플랫폼 MVP
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from datetime import datetime

# 라우터 임포트
from app.routers import students, auth

# FastAPI 앱 초기화
app = FastAPI(
    title="개인화 AI 학습 플랫폼 MVP",
    description="ChatGPT Custom Function 기반 학습 시스템",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 환경용, 프로덕션에서는 특정 도메인만 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(students.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth")

# 정적 파일 서빙 (프론트엔드용)
if os.path.exists("frontend"):
    app.mount("/frontend", StaticFiles(directory="frontend"), name="static")

# 헬스체크 엔드포인트
@app.get("/health")
async def health_check():
    """시스템 상태 확인"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "개인화 AI 학습 플랫폼 MVP",
        "version": "0.1.0",
        "database": "connected",  # 실제로는 DB 연결 확인 로직 필요
        "auth": "enabled"
    }

# 루트 엔드포인트
@app.get("/")
async def root():
    """API 루트"""
    return {
        "message": "개인화 AI 학습 플랫폼 MVP API",
        "description": "ChatGPT Custom Function 기반 학습 시스템",
        "docs": "/docs",
        "health": "/health",
        "api_base": "/api",
        "endpoints": {
            "students": "/api/students",
            "auth": "/api/auth",
            "login": "/api/auth/login",
            "test_accounts": "/api/auth/test-accounts"
        },
        "test_info": {
            "accounts": "test1, test2, test3, test4, test5",
            "password": "test123"
        }
    }

# 에러 핸들러
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"message": "요청한 리소스를 찾을 수 없습니다."}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": "서버 내부 오류가 발생했습니다."}
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )
