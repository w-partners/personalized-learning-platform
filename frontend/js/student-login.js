// 학생 로그인 기능 확장

// 기존 로그인 함수 확장
function enhanceLoginForStudent() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    // 기존 submit 이벤트 리스너 제거하고 새로 추가
    form.removeEventListener('submit', handleLogin);
    form.addEventListener('submit', handleStudentLogin);
}

async function handleStudentLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.querySelector('.user-type.active').dataset.type;
    
    // 입력 검증
    if (!username || !password) {
        showError('username', '사용자명과 비밀번호를 입력해주세요.');
        return;
    }
    
    // 로딩 상태
    showLoading(true);
    clearErrors();
    
    try {
        if (userType === 'admin') {
            // 관리자 로그인 (기존 로직)
            if (username === 'admin' && password === 'admin') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userType', 'admin');
                localStorage.setItem('username', username);
                
                showSuccess('관리자 로그인 성공!');
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1000);
            } else {
                showError('password', '관리자 계정이 올바르지 않습니다.');
            }
        } else if (userType === 'student') {
            // 학생 데모 계정 확인
            if (username === 'student' && password === 'student123') {
                // 김민준 학생 데이터 설정
                const studentData = {
                    id: "STU001",
                    name: "김민준",
                    email: "minjun.kim@student.edu",
                    grade: "고등학교 2학년",
                    class: "2-3",
                    studentNumber: "20250017",
                    type: "student"
                };
                
                // 로그인 정보 저장
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userType', 'student');
                localStorage.setItem('studentData', JSON.stringify(studentData));
                
                // 데모 데이터 로드
                loadDemoData();
                
                showSuccess('학생 로그인 성공! 김민준님 환영합니다.');
                setTimeout(() => {
                    window.location.href = 'student/dashboard.html';
                }, 1000);
            } else {
                // 실제 API 호출 (백엔드 연동 시)
                try {
                    const response = await fetch('/api/auth/student-login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: username,
                            password: password
                        })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('userType', 'student');
                        localStorage.setItem('studentData', JSON.stringify(data.student));
                        localStorage.setItem('authToken', data.token);
                        
                        showSuccess(`로그인 성공! ${data.student.name}님 환영합니다.`);
                        setTimeout(() => {
                            window.location.href = 'student/dashboard.html';
                        }, 1000);
                    } else {
                        const error = await response.json();
                        showError('password', error.message || '로그인에 실패했습니다.');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    showError('password', '네트워크 오류가 발생했습니다. 데모 계정을 사용해보세요.');
                }
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('password', '로그인 처리 중 오류가 발생했습니다.');
    } finally {
        showLoading(false);
    }
}

// 자동 완성 기능
function addAutoComplete() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput && passwordInput) {
        // 학생 버튼 클릭 시 자동 완성
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('user-type') && e.target.dataset.type === 'student') {
                setTimeout(() => {
                    usernameInput.placeholder = '데모: student';
                    passwordInput.placeholder = '데모: student123';
                }, 100);
            } else if (e.target.classList.contains('user-type') && e.target.dataset.type === 'admin') {
                setTimeout(() => {
                    usernameInput.placeholder = '데모: admin';
                    passwordInput.placeholder = '데모: admin';
                }, 100);
            }
        });
        
        // 더블클릭으로 자동 입력
        usernameInput.addEventListener('dblclick', () => {
            const userType = document.querySelector('.user-type.active').dataset.type;
            if (userType === 'student') {
                usernameInput.value = 'student';
                passwordInput.value = 'student123';
            } else if (userType === 'admin') {
                usernameInput.value = 'admin';
                passwordInput.value = 'admin';
            }
        });
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 데모 데이터 미리 로드
    if (typeof loadDemoData === 'function') {
        loadDemoData();
    }
    
    // 로그인 기능 확장
    enhanceLoginForStudent();
    
    // 자동 완성 기능 추가
    addAutoComplete();
});
