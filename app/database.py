"""
데이터베이스 연결 및 설정
PostgreSQL + SQLAlchemy 구성
"""

from sqlalchemy import create_engine, MetaData, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os
from typing import Generator

# 환경 변수에서 데이터베이스 URL 가져오기
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:password@postgres:5432/learning_platform"
)

# SQLAlchemy 엔진 생성
engine = create_engine(
    DATABASE_URL,
    poolclass=StaticPool,
    pool_pre_ping=True,
    echo=True  # 개발 환경에서 SQL 쿼리 로깅
)

# 세션 팩토리 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base 모델 클래스
Base = declarative_base()

# 메타데이터
metadata = MetaData()

def get_database_url() -> str:
    """데이터베이스 URL 반환"""
    return DATABASE_URL

def get_db() -> Generator:
    """
    데이터베이스 세션 의존성
    FastAPI에서 Depends()와 함께 사용
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """모든 테이블 생성"""
    Base.metadata.create_all(bind=engine)
    print("✅ 데이터베이스 테이블 생성 완료")

def drop_tables():
    """모든 테이블 삭제 (개발용)"""
    Base.metadata.drop_all(bind=engine)
    print("🗑️ 데이터베이스 테이블 삭제 완료")

def test_connection():
    """데이터베이스 연결 테스트"""
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            return True
    except Exception as e:
        print(f"❌ 데이터베이스 연결 실패: {e}")
        return False

if __name__ == "__main__":
    # 연결 테스트
    if test_connection():
        print("✅ 데이터베이스 연결 성공!")
    else:
        print("❌ 데이터베이스 연결 실패!")
