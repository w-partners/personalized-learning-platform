// 인증 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 폼 요소들
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    
    // 비밀번호 강도 체크
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
    
    // 회원가입 폼 처리
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // 로그인 폼 처리
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 소셜 로그인 버튼들
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', handleSocialLogin);
    });
});

// 비밀번호 강도 체크
function checkPasswordStrength(e) {
    const password = e.target.value;
    const strengthBar = document.querySelector('.strength-bar::after');
    const strengthText = document.querySelector('.strength-text');
    
    let strength = 0;
    let strengthLabel = '';
    
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    if (strength < 50) {
        strengthLabel = '약함';
    } else if (strength < 75) {
        strengthLabel = '보통';
    } else {
        strengthLabel = '강함';
    }
    
    // CSS 변수로 강도 업데이트
    document.documentElement.style.setProperty('--password-strength', strength + '%');
    if (strengthText) {
        strengthText.textContent = `비밀번호 강도: ${strengthLabel}`;
    }
}

// 회원가입 처리
async function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // 비밀번호 확인
    if (data.password !== data.confirmPassword) {
        showMessage('error', '비밀번호가 일치하지 않습니다.');
        return;
    }
    
    // 이용약관 동의 확인
    if (!document.getElementById('agreeTerms').checked) {
        showMessage('error', '이용약관에 동의해주세요.');
        return;
    }
    
    try {
        showLoading(true);
        
        // API 호출 (실제 구현 시)
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showMessage('success', '회원가입이 완료되었습니다!');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            const error = await response.json();
            showMessage('error', error.message || '회원가입에 실패했습니다.');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showMessage('error', '서버 오류가 발생했습니다.');
    } finally {
        showLoading(false);
    }
}

// 로그인 처리
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        showLoading(true);
        
        // API 호출 (실제 구현 시)
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userInfo', JSON.stringify(result.user));
            
            showMessage('success', '로그인되었습니다!');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            const error = await response.json();
            showMessage('error', error.message || '로그인에 실패했습니다.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('error', '서버 오류가 발생했습니다.');
    } finally {
        showLoading(false);
    }
}

// 소셜 로그인 처리
function handleSocialLogin(e) {
    const provider = e.currentTarget.classList.contains('google') ? 'google' : 'github';
    
    showMessage('info', `${provider} 로그인 기능은 준비 중입니다.`);
    
    // 실제 구현 시
    // window.location.href = `/api/auth/${provider}`;
}

// 메시지 표시
function showMessage(type, message) {
    // 기존 메시지 제거
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${getMessageIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // 스타일 적용
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideIn 0.3s ease;
        background: ${getMessageColor(type)};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(messageDiv);
    
    // 자동 제거
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 4000);
}

function getMessageIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'times-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

function getMessageColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    return colors[type] || '#3b82f6';
}

// 로딩 상태 표시
function showLoading(show) {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
        if (show) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    .strength-bar::after {
        width: var(--password-strength, 0%);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
