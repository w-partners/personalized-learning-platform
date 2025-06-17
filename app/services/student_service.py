"""
학생 정보 관리 CRUD 서비스
데이터베이스 작업을 추상화한 비즈니스 로직
"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models import Student
from sqlalchemy import Integer
from typing import List, Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class StudentService:
    """학생 정보 관리 서비스 클래스"""

    @staticmethod
    def create_student(
        db: Session,
        student_code: str,
        name: str,
        grade: int,
        school: str,
        concepts: Optional[Dict[str, int]] = None,
        notes: Optional[str] = None,
        parent_email: Optional[str] = None
    ) -> Student:
        """새 학생 생성"""
        try:
            student = Student(
                student_code=student_code,
                name=name,
                grade=grade,
                school=school,
                concepts=concepts or {},
                notes=notes,
                parent_email=parent_email
            )
            
            db.add(student)
            db.commit()
            db.refresh(student)
            
            logger.info(f"학생 생성 완료: {student_code}")
            return student
            
        except IntegrityError:
            db.rollback()
            raise ValueError(f"이미 존재하는 학생코드입니다: {student_code}")
        except Exception as e:
            db.rollback()
            logger.error(f"학생 생성 실패: {e}")
            raise

    @staticmethod
    def get_student_by_code(db: Session, student_code: str) -> Optional[Student]:
        """학생코드로 학생 조회"""
        return db.query(Student).filter(Student.student_code == student_code).first()

    @staticmethod
    def get_student_by_id(db: Session, student_id: int) -> Optional[Student]:
        """ID로 학생 조회"""
        return db.query(Student).filter(Student.id == student_id).first()

    @staticmethod
    def get_students_by_school_grade(
        db: Session, 
        school: str, 
        grade: int,
        limit: int = 100
    ) -> List[Student]:
        """학교와 학년으로 학생 목록 조회"""
        return (db.query(Student)
                .filter(Student.school == school, Student.grade == grade)
                .limit(limit)
                .all())

    @staticmethod
    def update_student_concepts(
        db: Session,
        student_code: str,
        concepts: Dict[str, int]
    ) -> Optional[Student]:
        """학생의 개념별 이해도 업데이트"""
        student = StudentService.get_student_by_code(db, student_code)
        if not student:
            return None

        try:
            # 기존 개념들과 병합
            if student.concepts is None:
                student.concepts = {}
            
            student.concepts.update(concepts)
            db.commit()
            db.refresh(student)
            
            logger.info(f"개념 이해도 업데이트 완료: {student_code}")
            return student
            
        except Exception as e:
            db.rollback()
            logger.error(f"개념 이해도 업데이트 실패: {e}")
            raise

    @staticmethod
    def get_weak_students_by_concept(
        db: Session,
        concept: str,
        threshold: int = 3,
        limit: int = 50
    ) -> List[Student]:
        """특정 개념에서 약한 학생들 조회"""
        return (db.query(Student)
                .filter(Student.concepts[concept].cast(Integer) <= threshold)
                .limit(limit)
                .all())

    @staticmethod
    def get_students_by_concept_range(
        db: Session,
        concept: str,
        min_score: int,
        max_score: int,
        limit: int = 50
    ) -> List[Student]:
        """특정 개념에서 점수 범위에 해당하는 학생들 조회"""
        return (db.query(Student)
                .filter(
                    Student.concepts[concept].cast(Integer) >= min_score,
                    Student.concepts[concept].cast(Integer) <= max_score
                )
                .limit(limit)
                .all())

    @staticmethod
    def delete_student(db: Session, student_code: str) -> bool:
        """학생 삭제"""
        student = StudentService.get_student_by_code(db, student_code)
        if not student:
            return False

        try:
            db.delete(student)
            db.commit()
            logger.info(f"학생 삭제 완료: {student_code}")
            return True
            
        except Exception as e:
            db.rollback()
            logger.error(f"학생 삭제 실패: {e}")
            raise

    @staticmethod
    def get_concept_statistics(db: Session, concept: str) -> Dict[str, Any]:
        """특정 개념의 통계 정보"""
        students = db.query(Student).filter(Student.concepts.has_key(concept)).all()
        
        if not students:
            return {"concept": concept, "count": 0}

        scores = [student.concepts[concept] for student in students]
        
        return {
            "concept": concept,
            "count": len(scores),
            "average": sum(scores) / len(scores),
            "min_score": min(scores),
            "max_score": max(scores),
            "score_distribution": {
                str(i): scores.count(i) for i in range(1, 6)
            }
        }

    @staticmethod
    def search_students(
        db: Session,
        name: Optional[str] = None,
        school: Optional[str] = None,
        grade: Optional[int] = None,
        limit: int = 100
    ) -> List[Student]:
        """학생 검색"""
        query = db.query(Student)
        
        if name:
            query = query.filter(Student.name.contains(name))
        if school:
            query = query.filter(Student.school.contains(school))
        if grade:
            query = query.filter(Student.grade == grade)
            
        return query.limit(limit).all()
