// 학생 페이지 전용 JavaScript

class StudentDashboard {
    constructor() {
        this.apiBase = '/api';
        this.studentId = this.getStudentId();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadStudentData();
    }

    bindEvents() {
        // 전역 이벤트 리스너 설정
        document.addEventListener('DOMContentLoaded', () => {
            this.checkAuth();
        });

        // 네비게이션 이벤트
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '../login.html') {
                    this.logout();
                }
            });
        });
    }

    // 인증 확인
    checkAuth() {
        const studentData = localStorage.getItem('studentData');
        if (!studentData) {
            window.location.href = '../login.html';
            return;
        }

        const student = JSON.parse(studentData);
        this.updateUserInfo(student);
    }

    // 사용자 정보 업데이트
    updateUserInfo(student) {
        const nameElements = document.querySelectorAll('#studentName');
        nameElements.forEach(el => {
            el.textContent = `${student.name}님`;
        });
    }

    // 학생 ID 가져오기
    getStudentId() {
        const studentData = localStorage.getItem('studentData');
        if (studentData) {
            return JSON.parse(studentData).id;
        }
        return null;
    }

    // 학생 데이터 로드
    async loadStudentData() {
        try {
            const response = await fetch(`${this.apiBase}/students/${this.studentId}`);
            if (response.ok) {
                const studentData = await response.json();
                this.updateDashboard(studentData);
            }
        } catch (error) {
            console.error('학생 데이터 로드 실패:', error);
            this.showError('데이터를 불러오는데 실패했습니다.');
        }
    }

    // 대시보드 업데이트
    updateDashboard(data) {
        if (typeof updateProgressCharts === 'function') {
            updateProgressCharts(data.subjects || {});
        }
        
        if (typeof updateRecentActivity === 'function') {
            updateRecentActivity(data.recentAssessments || []);
        }
    }

    // 평가 데이터 로드
    async loadAssessments(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters);
            const response = await fetch(`${this.apiBase}/students/${this.studentId}/assessments?${queryParams}`);
            
            if (response.ok) {
                const assessments = await response.json();
                return assessments;
            } else {
                throw new Error('평가 목록 로드 실패');
            }
        } catch (error) {
            console.error('평가 로드 실패:', error);
            this.showError('평가 목록을 불러오는데 실패했습니다.');
            return [];
        }
    }

    // 특정 평가 상세 정보 로드
    async loadAssessmentDetail(assessmentCode) {
        try {
            const response = await fetch(`${this.apiBase}/students/${this.studentId}/assessments/${assessmentCode}`);
            
            if (response.ok) {
                const assessment = await response.json();
                return assessment;
            } else {
                throw new Error('평가 상세 정보 로드 실패');
            }
        } catch (error) {
            console.error('평가 상세 정보 로드 실패:', error);
            this.showError('평가 상세 정보를 불러오는데 실패했습니다.');
            return null;
        }
    }

    // PDF 다운로드
    async downloadPDF(assessmentCode) {
        try {
            const response = await fetch(`${this.apiBase}/students/${this.studentId}/assessments/${assessmentCode}/pdf`);
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${assessmentCode}_평가지.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                this.showSuccess('PDF 다운로드가 완료되었습니다.');
            } else {
                throw new Error('PDF 다운로드 실패');
            }
        } catch (error) {
            console.error('PDF 다운로드 실패:', error);
            this.showError('PDF 다운로드에 실패했습니다.');
        }
    }

    // 재평가 요청
    async requestRetake(assessmentCode) {
        try {
            const response = await fetch(`${this.apiBase}/students/${this.studentId}/assessments/${assessmentCode}/retake`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                this.showSuccess('재평가 요청이 완료되었습니다. 새로운 문제가 생성됩니다.');
                return result;
            } else {
                throw new Error('재평가 요청 실패');
            }
        } catch (error) {
            console.error('재평가 요청 실패:', error);
            this.showError('재평가 요청에 실패했습니다.');
            return null;
        }
    }

    // 학습 목표 업데이트
    async updateLearningGoal(goalId, completed) {
        try {
            const response = await fetch(`${this.apiBase}/students/${this.studentId}/goals/${goalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed })
            });

            if (response.ok) {
                this.showSuccess('학습 목표가 업데이트되었습니다.');
                return true;
            } else {
                throw new Error('목표 업데이트 실패');
            }
        } catch (error) {
            console.error('목표 업데이트 실패:', error);
            this.showError('목표 업데이트에 실패했습니다.');
            return false;
        }
    }

    // 이해도 업데이트
    async updateConceptUnderstanding(conceptId, level) {
        try {
            const response = await fetch(`${this.apiBase}/students/${this.studentId}/understanding`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ conceptId, level })
            });

            if (response.ok) {
                this.showSuccess('이해도가 업데이트되었습니다.');
                return true;
            } else {
                throw new Error('이해도 업데이트 실패');
            }
        } catch (error) {
            console.error('이해도 업데이트 실패:', error);
            this.showError('이해도 업데이트에 실패했습니다.');
            return false;
        }
    }

    // 로그아웃
    logout() {
        localStorage.removeItem('studentData');
        localStorage.removeItem('authToken');
        window.location.href = '../login.html';
    }

    // 성공 메시지 표시
    showSuccess(message) {
        this.showAlert(message, 'success');
    }

    // 에러 메시지 표시
    showError(message) {
        this.showAlert(message, 'error');
    }

    // 정보 메시지 표시
    showInfo(message) {
        this.showAlert(message, 'info');
    }

    // 알림 표시
    showAlert(message, type = 'info') {
        // 기존 알림 제거
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // 새 알림 생성
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        // 페이지 상단에 삽입
        const container = document.querySelector('.dashboard-container, .detail-container, .assessments-container');
        if (container) {
            container.insertBefore(alert, container.firstChild);
        }

        // 3초 후 자동 제거
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 3000);
    }

    // 로딩 상태 표시
    showLoading(element) {
        if (element) {
            element.innerHTML = '<div class="loading">데이터를 불러오는 중...</div>';
        }
    }

    // 로딩 상태 숨기기
    hideLoading(element) {
        if (element) {
            const loading = element.querySelector('.loading');
            if (loading) {
                loading.remove();
            }
        }
    }

    // 날짜 포맷팅
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 점수 색상 반환
    getScoreColor(score, maxScore = 100) {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 90) return '#38a169'; // 초록
        if (percentage >= 80) return '#3182ce'; // 파랑
        if (percentage >= 70) return '#ed8936'; // 주황
        return '#e53e3e'; // 빨강
    }

    // 과목별 색상 반환
    getSubjectColor(subject) {
        const colors = {
            '수학': '#FF6384',
            '국어': '#36A2EB',
            '영어': '#FFCE56',
            '과학': '#4BC0C0',
            '사회': '#9966FF',
            '기타': '#C9CBCF'
        };
        return colors[subject] || colors['기타'];
    }
}

// 유틸리티 함수들
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 전역 학생 대시보드 인스턴스
let studentDashboard;

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    studentDashboard = new StudentDashboard();
});

// 전역 함수들 (HTML에서 직접 호출하기 위해)
function downloadPDF(code) {
    if (studentDashboard) {
        studentDashboard.downloadPDF(code);
    }
}

function retakeAssessment() {
    const code = document.getElementById('codeDisplay')?.textContent;
    if (code && studentDashboard) {
        if (confirm('이 평가를 다시 보시겠습니까?')) {
            studentDashboard.requestRetake(code);
        }
    }
}

function viewAssessment(code) {
    window.location.href = `assessment-detail.html?code=${code}`;
}
