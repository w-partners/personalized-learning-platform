"""
학생 관리 API 라우터
학생 등록, 조회, 개념별 이해도 업데이트 기능
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator
import logging

from app.database import get_db
from app.services.student_service import StudentService
from app.models import Student

logger = logging.getLogger(__name__)

# 라우터 생성
router = APIRouter(
    prefix="/students",
    tags=["Students"],
    responses={404: {"description": "학생을 찾을 수 없습니다"}}
)

# Pydantic 모델 정의
class StudentCreate(BaseModel):
    """학생 등록 요청 모델"""
    student_code: str = Field(..., description="학생 코드 (형식: 2025SE001302015)")
    name: str = Field(..., min_length=1, max_length=100, description="학생 이름")
    grade: int = Field(..., ge=1, le=6, description="학년 (1-6)")
    school: str = Field(..., min_length=1, max_length=200, description="학교명")
    concepts: Optional[Dict[str, int]] = Field(default_factory=dict, description="개념별 이해도 (1-5)")
    notes: Optional[str] = Field(None, max_length=1000, description="특이사항")
    parent_email: Optional[str] = Field(None, description="보호자 이메일")

    @validator('concepts')
    def validate_concepts(cls, v):
        if v:
            for concept, score in v.items():
                if not 1 <= score <= 5:
                    raise ValueError(f"개념 '{concept}'의 점수는 1-5 사이여야 합니다")
        return v

class StudentResponse(BaseModel):
    """학생 정보 응답 모델"""
    id: int
    student_code: str
    name: str
    grade: int
    school: str
    concepts: Dict[str, int]
    notes: Optional[str]
    parent_email: Optional[str]
    created_at: str
    updated_at: Optional[str]

    class Config:
        from_attributes = True

class ConceptUpdate(BaseModel):
    """개념별 이해도 업데이트 모델"""
    concepts: Dict[str, int] = Field(..., description="업데이트할 개념별 점수")

    @validator('concepts')
    def validate_concepts(cls, v):
        if not v:
            raise ValueError("최소 하나의 개념 점수가 필요합니다")
        
        for concept, score in v.items():
            if not 1 <= score <= 5:
                raise ValueError(f"개념 '{concept}'의 점수는 1-5 사이여야 합니다")
        return v

class StudentSearch(BaseModel):
    """학생 검색 모델"""
    name: Optional[str] = None
    school: Optional[str] = None
    grade: Optional[int] = Field(None, ge=1, le=6)
    limit: int = Field(100, ge=1, le=1000)

# API 엔드포인트 구현

@router.post("/register", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def register_student(
    student_data: StudentCreate,
    db: Session = Depends(get_db)
):
    """새 학생 등록"""
    try:
        # 중복 확인
        existing_student = StudentService.get_student_by_code(db, student_data.student_code)
        if existing_student:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"이미 등록된 학생 코드입니다: {student_data.student_code}"
            )

        # 학생 생성
        student = StudentService.create_student(
            db=db,
            student_code=student_data.student_code,
            name=student_data.name,
            grade=student_data.grade,
            school=student_data.school,
            concepts=student_data.concepts,
            notes=student_data.notes,
            parent_email=student_data.parent_email
        )

        logger.info(f"학생 등록 완료: {student.student_code} - {student.name}")
        
        return StudentResponse(
            id=student.id,
            student_code=student.student_code,
            name=student.name,
            grade=student.grade,
            school=student.school,
            concepts=student.concepts,
            notes=student.notes,
            parent_email=student.parent_email,
            created_at=student.created_at.isoformat(),
            updated_at=student.updated_at.isoformat() if student.updated_at else None
        )

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"학생 등록 실패: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="학생 등록 중 오류가 발생했습니다")

@router.get("/{student_code}", response_model=StudentResponse)
async def get_student(
    student_code: str,
    db: Session = Depends(get_db)
):
    """학생 코드로 학생 조회"""
    student = StudentService.get_student_by_code(db, student_code)
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"학생을 찾을 수 없습니다: {student_code}"
        )

    return StudentResponse(
        id=student.id,
        student_code=student.student_code,
        name=student.name,
        grade=student.grade,
        school=student.school,
        concepts=student.concepts,
        notes=student.notes,
        parent_email=student.parent_email,
        created_at=student.created_at.isoformat(),
        updated_at=student.updated_at.isoformat() if student.updated_at else None
    )

@router.put("/{student_code}/concepts", response_model=StudentResponse)
async def update_student_concepts(
    student_code: str,
    concept_update: ConceptUpdate,
    db: Session = Depends(get_db)
):
    """학생의 개념별 이해도 업데이트"""
    try:
        student = StudentService.update_student_concepts(
            db=db,
            student_code=student_code,
            concepts=concept_update.concepts
        )

        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"학생을 찾을 수 없습니다: {student_code}"
            )

        logger.info(f"개념 이해도 업데이트 완료: {student_code}")
        
        return StudentResponse(
            id=student.id,
            student_code=student.student_code,
            name=student.name,
            grade=student.grade,
            school=student.school,
            concepts=student.concepts,
            notes=student.notes,
            parent_email=student.parent_email,
            created_at=student.created_at.isoformat(),
            updated_at=student.updated_at.isoformat() if student.updated_at else None
        )

    except Exception as e:
        logger.error(f"개념 이해도 업데이트 실패: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="개념 이해도 업데이트 중 오류가 발생했습니다"
        )

@router.get("/", response_model=List[StudentResponse])
async def search_students(
    name: Optional[str] = None,
    school: Optional[str] = None,
    grade: Optional[int] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """학생 검색"""
    try:
        students = StudentService.search_students(
            db=db,
            name=name,
            school=school,
            grade=grade,
            limit=min(limit, 1000)  # 최대 1000개로 제한
        )

        return [
            StudentResponse(
                id=student.id,
                student_code=student.student_code,
                name=student.name,
                grade=student.grade,
                school=student.school,
                concepts=student.concepts,
                notes=student.notes,
                parent_email=student.parent_email,
                created_at=student.created_at.isoformat(),
                updated_at=student.updated_at.isoformat() if student.updated_at else None
            )
            for student in students
        ]

    except Exception as e:
        logger.error(f"학생 검색 실패: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="학생 검색 중 오류가 발생했습니다"
        )

@router.get("/{student_code}/weak-concepts")
async def get_weak_concepts(
    student_code: str,
    threshold: int = 3,
    db: Session = Depends(get_db)
):
    """학생의 약한 개념 조회"""
    student = StudentService.get_student_by_code(db, student_code)
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"학생을 찾을 수 없습니다: {student_code}"
        )

    weak_concepts = student.get_weak_concepts(threshold)
    
    return {
        "student_code": student_code,
        "name": student.name,
        "threshold": threshold,
        "weak_concepts": weak_concepts,
        "count": len(weak_concepts)
    }

@router.get("/{student_code}/strong-concepts")
async def get_strong_concepts(
    student_code: str,
    threshold: int = 4,
    db: Session = Depends(get_db)
):
    """학생의 강한 개념 조회"""
    student = StudentService.get_student_by_code(db, student_code)
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"학생을 찾을 수 없습니다: {student_code}"
        )

    strong_concepts = student.get_strong_concepts(threshold)
    
    return {
        "student_code": student_code,
        "name": student.name,
        "threshold": threshold,
        "strong_concepts": strong_concepts,
        "count": len(strong_concepts)
    }

@router.delete("/{student_code}")
async def delete_student(
    student_code: str,
    db: Session = Depends(get_db)
):
    """학생 삭제"""
    try:
        success = StudentService.delete_student(db, student_code)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"학생을 찾을 수 없습니다: {student_code}"
            )

        logger.info(f"학생 삭제 완료: {student_code}")
        return {"message": f"학생이 성공적으로 삭제되었습니다: {student_code}"}

    except Exception as e:
        logger.error(f"학생 삭제 실패: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="학생 삭제 중 오류가 발생했습니다"
        )
