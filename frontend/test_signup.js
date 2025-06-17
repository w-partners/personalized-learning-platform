// 가상 사용자 회원가입 테스트 시뮬레이션
console.log("=== AI 학습도우미 예팸 회원가입 테스트 ===");

// 가상 사용자 데이터
const testUsers = [
    {
        name: "김학생",
        type: "student", 
        email: "kim.student@test.com",
        password: "test123456"
    },
    {
        name: "이선생님",
        type: "teacher",
        email: "lee.teacher@test.com", 
        password: "teacher123"
    },
    {
        name: "박학부모",
        type: "parent",
        email: "park.parent@test.com",
        password: "parent123"
    }
];

// 회원가입 시뮬레이션
function simulateSignup(user) {
    console.log(`\n--- ${user.name} (${user.type}) 회원가입 시뮬레이션 ---`);
    
    // 1. 사용자 유형 선택
    console.log(`✓ 사용자 유형 선택: ${user.type}`);
    
    // 2. 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(user.email)) {
        console.log(`✓ 이메일 검증 통과: ${user.email}`);
    } else {
        console.log(`✗ 이메일 검증 실패: ${user.email}`);
        return false;
    }
    
    // 3. 비밀번호 강도 체크
    let strength = 0;
    if (user.password.length >= 6) strength++;
    if (user.password.length >= 8) strength++;
    if (/[A-Z]/.test(user.password)) strength++;
    if (/[0-9]/.test(user.password)) strength++;
    if (/[^A-Za-z0-9]/.test(user.password)) strength++;
    
    const strengthLevel = Math.min(strength, 3);
    const strengthText = ['', '약함', '보통', '강함'][strengthLevel];
    console.log(`✓ 비밀번호 강도: ${strengthText} (${strengthLevel}/3)`);
    
    // 4. 회원가입 처리
    const userData = {
        email: user.email,
        password: user.password,
        userType: user.type,
        registeredAt: new Date().toISOString()
    };
    
    console.log(`✓ 회원가입 데이터 생성:`, userData);
    console.log(`✓ ${user.name} 회원가입 완료!`);
    
    return true;
}

// 학생 정보 등록 시뮬레이션
function simulateStudentRegister() {
    console.log(`\n--- 학생 정보 등록 시뮬레이션 ---`);
    
    const studentData = {
        name: "김학생",
        grade: "중2", 
        school: "서울중학교",
        class: "3반",
        learningGoals: "수학 기초 실력 향상, 영어 회화 능력 개발",
        conceptLevels: {
            "math-basic": 3,
            "math-function": 2,
            "english-vocabulary": 4,
            "english-grammar": 3,
            "science-physics": 2,
            "science-chemistry": 3
        }
    };
    
    console.log(`✓ 기본 정보 입력:`, {
        name: studentData.name,
        grade: studentData.grade, 
        school: studentData.school,
        class: studentData.class
    });
    
    console.log(`✓ 학습 목표:`, studentData.learningGoals);
    console.log(`✓ 개념별 이해도:`, studentData.conceptLevels);
    
    // 간단한 학생 코드 생성
    const prefixes = ['STAR', 'HERO', 'WISE', 'BRIGHT', 'SMART'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 9000) + 1000;
    const studentCode = prefix + number;
    
    console.log(`✓ 학생 코드 발급: ${studentCode}`);
    console.log(`✓ 학생 정보 등록 완료!`);
    
    return studentCode;
}

// 관리자 로그인 시뮬레이션
function simulateAdminLogin() {
    console.log(`\n--- 관리자 로그인 시뮬레이션 ---`);
    
    const adminCredentials = {
        username: "admin",
        password: "admin"
    };
    
    console.log(`✓ 관리자 ID 입력: ${adminCredentials.username}`);
    console.log(`✓ 비밀번호 입력: ${"*".repeat(adminCredentials.password.length)}`);
    
    if (adminCredentials.username === "admin" && adminCredentials.password === "admin") {
        console.log(`✓ 관리자 로그인 성공!`);
        console.log(`✓ 관리자 대시보드로 리다이렉트`);
        return true;
    } else {
        console.log(`✗ 관리자 로그인 실패`);
        return false;
    }
}

// 테스트 실행
testUsers.forEach(user => {
    simulateSignup(user);
});

simulateStudentRegister();
simulateAdminLogin();

console.log(`\n=== 테스트 완료 ===`);
