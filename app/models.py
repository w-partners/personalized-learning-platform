"""
SQLAlchemy 데이터 모델 정의
학생 정보 및 개념별 이해도 관리
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Index
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from app.database import Base
import re
from typing import Optional, Dict, Any
from datetime import datetime

class Student(Base):
    """
    학생 정보 모델
    개념별 이해도를 JSONB로 저장하여 유연한 데이터 구조 지원
    """
    __tablename__ = "students"

    # 기본 필드
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    grade = Column(Integer, nullable=False)
    school = Column(String(200), nullable=False)
    
    # 개념별 이해도 (JSONB 형태)
    # 예시: {"분수의덧셈": 3, "소수의곱셈": 1, "도형의넓이": 5}
    concepts = Column(JSONB, default={}, nullable=False)
    
    # 메타데이터
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 추가 정보 (선택적)
    notes = Column(Text, nullable=True)  # 특이사항 기록
    parent_email = Column(String(100), nullable=True)  # 보호자 이메일
    
    # 인덱스 정의
    __table_args__ = (
        Index('idx_student_grade_school', 'grade', 'school'),
        Index('idx_student_created_at', 'created_at'),
        Index('idx_student_concepts', 'concepts', postgresql_using='gin'),
    )

    def __init__(self, student_code: str, name: str, grade: int, school: str, **kwargs):
        """학생 객체 초기화"""
        # 학생코드 형식 검증
        if not self.validate_student_code(student_code):
            raise ValueError(f"올바르지 않은 학생코드 형식: {student_code}")
        
        self.student_code = student_code
        self.name = name
        self.grade = grade
        self.school = school
        self.concepts = kwargs.get('concepts', {})
        self.notes = kwargs.get('notes')
        self.parent_email = kwargs.get('parent_email')

    @staticmethod
    def validate_student_code(code: str) -> bool:
        """
        학생코드 형식 검증
        형식: 년도(4자리)+지역코드(2자리)+학교코드(3자리)+학년(1자리)+반(2자리)+번호(2자리)
        예시: 2025SE001302015 (2025년 서울 001학교 3학년 02반 15번)
        """
        pattern = r'^20[0-9]{2}[A-Z]{2}[0-9]{3}[1-6][0-9]{2}[0-9]{2}$'
        return bool(re.match(pattern, code))

    def update_concept_score(self, concept: str, score: int) -> None:
        """개념별 이해도 업데이트 (1-5 점수)"""
        if not 1 <= score <= 5:
            raise ValueError("이해도 점수는 1-5 사이여야 합니다")
        
        if self.concepts is None:
            self.concepts = {}
        
        self.concepts[concept] = score

    def get_concept_score(self, concept: str) -> Optional[int]:
        """특정 개념의 이해도 조회"""
        if self.concepts is None:
            return None
        return self.concepts.get(concept)

    def get_weak_concepts(self, threshold: int = 3) -> Dict[str, int]:
        """약한 개념들 반환 (threshold 이하)"""
        if self.concepts is None:
            return {}
        
        return {
            concept: score 
            for concept, score in self.concepts.items() 
            if score <= threshold
        }

    def get_strong_concepts(self, threshold: int = 4) -> Dict[str, int]:
        """강한 개념들 반환 (threshold 이상)"""
        if self.concepts is None:
            return {}
        
        return {
            concept: score 
            for concept, score in self.concepts.items() 
            if score >= threshold
        }

    def to_dict(self) -> Dict[str, Any]:
        """딕셔너리 형태로 변환"""
        return {
            "id": self.id,
            "student_code": self.student_code,
            "name": self.name,
            "grade": self.grade,
            "school": self.school,
            "concepts": self.concepts,
            "notes": self.notes,
            "parent_email": self.parent_email,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f"<Student(code='{self.student_code}', name='{self.name}', grade={self.grade})>"

    def __str__(self):
        return f"{self.name} ({self.student_code}) - {self.grade}학년 {self.school}"
