"""
데이터베이스 초기화 및 마이그레이션 스크립트
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.database import engine, create_tables, test_connection, get_database_url
from app.models import Student
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_database():
    """데이터베이스 초기화"""
    print("🚀 데이터베이스 초기화 시작...")
    print(f"📍 연결 URL: {get_database_url()}")
    
    # 1. 연결 테스트
    if not test_connection():
        print("❌ 데이터베이스 연결 실패!")
        return False
    
    # 2. 테이블 생성
    try:
        create_tables()
        print("✅ 테이블 생성 완료!")
        
        # 3. 테이블 확인
        with engine.connect() as conn:
            result = conn.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)
            tables = [row[0] for row in result]
            print(f"📋 생성된 테이블: {tables}")
        
        return True
        
    except Exception as e:
        print(f"❌ 초기화 실패: {e}")
        return False

def create_sample_data():
    """샘플 데이터 생성"""
    from app.database import SessionLocal
    from app.services.student_service import StudentService
    
    print("📝 샘플 데이터 생성...")
    
    db = SessionLocal()
    try:
        # 샘플 학생들
        sample_students = [
            {
                "student_code": "2025SE00130201",
                "name": "김철수",
                "grade": 3,
                "school": "서울초등학교",
                "concepts": {"분수의덧셈": 2, "소수의곱셈": 4, "도형의넓이": 3},
                "parent_email": "parent1@example.com"
            },
            {
                "student_code": "2025SE00130202",
                "name": "이영희",
                "grade": 3,
                "school": "서울초등학교", 
                "concepts": {"분수의덧셈": 5, "소수의곱셈": 3, "도형의넓이": 4},
                "parent_email": "parent2@example.com"
            },
            {
                "student_code": "2025SE00130203",
                "name": "박민수",
                "grade": 3,
                "school": "서울초등학교",
                "concepts": {"분수의덧셈": 1, "소수의곱셈": 2, "도형의넓이": 2},
                "parent_email": "parent3@example.com"
            }
        ]
        
        for student_data in sample_students:
            try:
                student = StudentService.create_student(db, **student_data)
                print(f"✅ 샘플 학생 생성: {student.name} ({student.student_code})")
            except ValueError as e:
                print(f"⚠️ 이미 존재하는 학생: {student_data['name']}")
        
        print("✅ 샘플 데이터 생성 완료!")
        
    except Exception as e:
        print(f"❌ 샘플 데이터 생성 실패: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if init_database():
        create_sample_data()
        print("🎉 데이터베이스 초기화 완료!")
    else:
        print("💥 초기화 실패!")
        sys.exit(1)
