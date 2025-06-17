// API 기본 설정
const API_BASE = '/api';

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAPIStatus();
});

// 앱 초기화
function initializeApp() {
    console.log('🚀 개인화 AI 학습 플랫폼 초기화 중...');
    
    // 개념 점수 슬라이더 이벤트
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener('input', updateScoreDisplay);
        updateScoreDisplay.call(slider); // 초기값 설정
    });
    
    // 네비게이션 스크롤 이벤트
    setupScrollNavigation();
    
    console.log('✅ 초기화 완료!');
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 학생 등록 폼
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', handleStudentSubmission);
    }
    
    // 학생코드 입력 포맷팅
    const studentCodeInput = document.getElementById('studentCode');
    if (studentCodeInput) {
        studentCodeInput.addEventListener('input', formatStudentCode);
    }
}

// 점수 표시 업데이트
function updateScoreDisplay() {
    const value = this.value;
    const scoreDisplay = this.parentElement.querySelector('.score-value');
    if (scoreDisplay) {
        scoreDisplay.textContent = value;
        
        // 색상 변경
        const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997'];
        scoreDisplay.style.color = colors[value - 1];
    }
}

// 학생코드 포맷팅
function formatStudentCode(event) {
    let value = event.target.value.replace(/[^0-9A-Z]/g, '');
    
    // 길이 제한
    if (value.length > 14) {
        value = value.substring(0, 14);
    }
    
    event.target.value = value;
    
    // 실시간 유효성 검사
    const isValid = validateStudentCode(value);
    event.target.style.borderColor = isValid ? '#28a745' : '#dc3545';
}

// 학생코드 유효성 검사
function validateStudentCode(code) {
    // 2025SE00130201 형태
    const pattern = /^20[0-9]{2}[A-Z]{2}[0-9]{3}[1-6][0-9]{2}[0-9]{2}$/;
    return pattern.test(code);
}

// 학생 등록 처리
async function handleStudentSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const studentData = {
        student_code: document.getElementById('studentCode').value,
        name: document.getElementById('studentName').value,
        grade: parseInt(document.getElementById('grade').value),
        school: document.getElementById('school').value,
        parent_email: document.getElementById('parentEmail').value || null,
        concepts: getCurrentConcepts()
    };
    
    // 유효성 검사
    if (!validateStudentData(studentData)) {
        return;
    }
    
    showLoading('학생 등록 중...');
    
    try {
        const response = await fetch(`${API_BASE}/students/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showResult('success', '✅ 학생 등록 성공!', result);
            event.target.reset();
            resetConceptScores();
        } else {
            showResult('error', '❌ 등록 실패', result);
        }
    } catch (error) {
        console.error('등록 에러:', error);
        showResult('error', '❌ 네트워크 오류', { message: error.message });
    }
}

// 현재 개념 점수 가져오기
function getCurrentConcepts() {
    const concepts = {};
    const sliders = document.querySelectorAll('input[type="range"]');
    
    sliders.forEach(slider => {
        const concept = slider.dataset.concept;
        concepts[concept] = parseInt(slider.value);
    });
    
    return concepts;
}

// 학생 데이터 유효성 검사
function validateStudentData(data) {
    if (!validateStudentCode(data.student_code)) {
        showResult('error', '❌ 유효하지 않은 학생코드', { 
            message: '형식: 2025SE00130201 (년도+지역+학교+학년+반+번호)' 
        });
        return false;
    }
    
    if (!data.name.trim()) {
        showResult('error', '❌ 이름을 입력해주세요', {});
        return false;
    }
    
    if (!data.school.trim()) {
        showResult('error', '❌ 학교명을 입력해주세요', {});
        return false;
    }
    
    return true;
}

// 개념 점수 업데이트
async function updateConcepts() {
    const studentCode = document.getElementById('studentCode').value;
    
    if (!studentCode || !validateStudentCode(studentCode)) {
        showResult('error', '❌ 유효한 학생코드를 입력해주세요', {});
        return;
    }
    
    const concepts = getCurrentConcepts();
    
    showLoading('개념 점수 업데이트 중...');
    
    try {
        const response = await fetch(`${API_BASE}/students/${studentCode}/concepts`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ concepts })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showResult('success', '✅ 개념 점수 업데이트 성공!', result);
        } else {
            showResult('error', '❌ 업데이트 실패', result);
        }
    } catch (error) {
        console.error('업데이트 에러:', error);
        showResult('error', '❌ 네트워크 오류', { message: error.message });
    }
}

// 개념 점수 초기화
function resetConceptScores() {
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.value = 3;
        updateScoreDisplay.call(slider);
    });
}

// API 상태 확인
async function checkAPIStatus() {
    const statusElement = document.getElementById('apiStatus');
    
    try {
        const response = await fetch('/health');
        const data = await response.json();
        
        if (response.ok) {
            statusElement.innerHTML = '<i class="fas fa-check-circle"></i> 시스템 정상';
            statusElement.className = 'api-status online';
        } else {
            throw new Error('Health check failed');
        }
    } catch (error) {
        statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> 시스템 오류';
        statusElement.className = 'api-status offline';
    }
}

// 결과 표시
function showResult(type, title, data) {
    const resultContent = document.getElementById('resultContent');
    
    let content = `${title}\n\n`;
    
    if (data && Object.keys(data).length > 0) {
        content += JSON.stringify(data, null, 2);
    }
    
    resultContent.textContent = content;
    resultContent.className = `result-content ${type}`;
    
    // 결과 섹션으로 스크롤
    document.getElementById('demoResults').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

// 로딩 표시
function showLoading(message) {
    const resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = `<div class="loading"></div> ${message}`;
    resultContent.className = 'result-content';
}

// 스크롤 네비게이션 설정
function setupScrollNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 활성 링크 업데이트
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // 스크롤 시 활성 섹션 업데이트
    window.addEventListener('scroll', updateActiveNavigation);
}

// 활성 네비게이션 업데이트
function updateActiveNavigation() {
    const sections = ['home', 'features', 'demo', 'api'];
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = sectionId;
            }
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// 유틸리티 함수들
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function openAPI() {
    window.open('/docs', '_blank');
}

// 에러 핸들링
window.addEventListener('error', function(e) {
    console.error('JavaScript 오류:', e.error);
    showResult('error', '❌ 클라이언트 오류', { 
        message: e.message,
        filename: e.filename,
        lineno: e.lineno 
    });
});

// 네트워크 상태 모니터링
window.addEventListener('online', function() {
    showResult('success', '🌐 네트워크 연결됨', {});
    checkAPIStatus();
});

window.addEventListener('offline', function() {
    showResult('error', '🌐 네트워크 연결 끊어짐', {});
});

console.log('🎉 AI 학습 플랫폼 JavaScript 로드 완료!');
