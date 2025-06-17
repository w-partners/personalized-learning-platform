"""
인증 관련 API 라우터
로그인, 로그아웃, 토큰 검증 등
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
import hashlib
import jwt
import os
from datetime import datetime, timedelta
from typing import Optional

from app.database import get_db

router = APIRouter(tags=["Authentication"])
security = HTTPBearer()

# JWT 설정
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "learning-platform-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    student_info: dict

class StudentInfo(BaseModel):
    id: int
    username: str
    name: str
    student_code: str
    grade: int
    school: str

def hash_password(password: str) -> str:
    """비밀번호 해시 생성"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """JWT 토큰 생성"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """JWT 토큰 검증"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """학생 로그인"""
    
    # 사용자 인증 확인
    auth_query = text("""
        SELECT sa.id, sa.username, sa.student_id, s.name, s.student_code, s.grade, s.school
        FROM student_auth sa
        JOIN students s ON sa.student_id = s.id
        WHERE sa.username = :username AND sa.password_hash = :password_hash AND sa.is_active = TRUE
    """)
    
    password_hash = hash_password(request.password)
    result = db.execute(auth_query, {
        "username": request.username,
        "password_hash": password_hash
    }).fetchone()
    
    if not result:
        raise HTTPException(
            status_code=401, 
            detail="잘못된 사용자명 또는 비밀번호입니다"
        )
    
    # 마지막 로그인 시간 업데이트
    update_login_query = text("""
        UPDATE student_auth 
        SET last_login = NOW() 
        WHERE username = :username
    """)
    db.execute(update_login_query, {"username": request.username})
    db.commit()
    
    # JWT 토큰 생성
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": request.username, "student_id": result[2]},
        expires_delta=access_token_expires
    )
    
    # 학생 정보
    student_info = {
        "id": result[2],
        "username": result[1],
        "name": result[3],
        "student_code": result[4],
        "grade": result[5],
        "school": result[6]
    }
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        student_info=student_info
    )

@router.get("/me", response_model=StudentInfo)
async def get_current_user(username: str = Depends(verify_token), db: Session = Depends(get_db)):
    """현재 로그인한 사용자 정보 조회"""
    
    user_query = text("""
        SELECT sa.id, sa.username, s.id, s.name, s.student_code, s.grade, s.school
        FROM student_auth sa
        JOIN students s ON sa.student_id = s.id
        WHERE sa.username = :username AND sa.is_active = TRUE
    """)
    
    result = db.execute(user_query, {"username": username}).fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")
    
    return StudentInfo(
        id=result[2],
        username=result[1],
        name=result[3],
        student_code=result[4],
        grade=result[5],
        school=result[6]
    )

@router.post("/logout")
async def logout():
    """로그아웃 (클라이언트에서 토큰 삭제)"""
    return {"message": "로그아웃되었습니다"}

@router.get("/test-accounts")
async def get_test_accounts(db: Session = Depends(get_db)):
    """테스트용 계정 목록 조회"""
    
    accounts_query = text("""
        SELECT sa.username, s.name, s.student_code, s.grade, s.school
        FROM student_auth sa
        JOIN students s ON sa.student_id = s.id
        WHERE sa.is_active = TRUE
        ORDER BY sa.username
    """)
    
    result = db.execute(accounts_query).fetchall()
    
    return {
        "message": "테스트용 로그인 계정 목록",
        "password": "test123",
        "accounts": [
            {
                "username": row[0],
                "name": row[1],
                "student_code": row[2],
                "grade": row[3],
                "school": row[4]
            }
            for row in result
        ]
    }
