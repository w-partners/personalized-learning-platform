// 가상 학생 데이터 및 평가지 데이터

const DEMO_STUDENT = {
    id: "STU001",
    name: "김민준",
    email: "minjun.kim@student.edu",
    grade: "고등학교 2학년",
    class: "2-3",
    studentNumber: "20250017",
    subjects: {
        "수학": { progress: 85, achievement: 88 },
        "국어": { progress: 72, achievement: 76 },
        "영어": { progress: 91, achievement: 94 },
        "과학": { progress: 68, achievement: 71 },
        "사회": { progress: 79, achievement: 82 }
    },
    totalAssessments: 15,
    completedAssessments: 12,
    averageScore: 84.2
};

const DEMO_ASSESSMENTS = [
    {
        code: 'MATH001',
        subject: '수학',
        title: '1차함수와 그래프 이해도 평가',
        createdAt: '2025-06-15 14:30',
        submittedAt: '2025-06-15 15:45',
        result: '85점',
        status: 'completed',
        score: 85,
        maxScore: 100,
        difficulty: '중급',
        topics: ['1차함수', '그래프', '기울기', '절편'],
        timeSpent: 75, // 분
        questions: [
            {
                number: 1,
                text: 'y = 2x + 3의 그래프에서 x절편을 구하시오.',
                studentAnswer: 'x = -1.5',
                correctAnswer: 'x = -1.5',
                score: 10,
                maxScore: 10,
                feedback: '정답입니다! x절편을 구하는 방법을 정확히 알고 있습니다.',
                concept: '절편',
                difficulty: '기본'
            },
            {
                number: 2,
                text: '두 일차함수 y = 3x + 1과 y = -x + 5의 교점을 구하시오.',
                studentAnswer: '(1, 4)',
                correctAnswer: '(1, 4)',
                score: 15,
                maxScore: 15,
                feedback: '완벽합니다! 연립방정식을 정확히 풀었습니다.',
                concept: '연립방정식',
                difficulty: '중급'
            },
            {
                number: 3,
                text: 'y = -2x + 4의 그래프가 지나는 두 점을 찾아 그래프를 그리시오.',
                studentAnswer: '(0, 4), (2, 0)',
                correctAnswer: '(0, 4), (2, 0)',
                score: 20,
                maxScore: 20,
                feedback: '정확한 두 점을 찾아 그래프를 잘 그렸습니다.',
                concept: '그래프 그리기',
                difficulty: '기본'
            },
            {
                number: 4,
                text: '직선 y = 2x - 3에 평행하고 점 (1, 5)를 지나는 직선의 방정식을 구하시오.',
                studentAnswer: 'y = 2x + 3',
                correctAnswer: 'y = 2x + 3',
                score: 15,
                maxScore: 15,
                feedback: '평행선의 기울기가 같다는 조건을 잘 활용했습니다.',
                concept: '평행선',
                difficulty: '중급'
            },
            {
                number: 5,
                text: '연립방정식 {2x + 3y = 7, 4x - y = 1}의 해를 구하시오.',
                studentAnswer: 'x = 1, y = 2',
                correctAnswer: 'x = 1, y = 1.67',
                score: 5,
                maxScore: 20,
                feedback: '계산 과정에서 실수가 있었습니다. 소거법이나 대입법을 다시 연습해보세요.',
                concept: '연립방정식',
                difficulty: '고급'
            },
            {
                number: 6,
                text: '일차부등식 3x - 2 ≤ 7의 해를 구하고 수직선 위에 나타내시오.',
                studentAnswer: 'x ≤ 3',
                correctAnswer: 'x ≤ 3',
                score: 20,
                maxScore: 20,
                feedback: '일차부등식과 수직선 표현 모두 완벽합니다!',
                concept: '부등식',
                difficulty: '기본'
            }
        ],
        analysis: {
            strengths: ['1차함수 기본 개념 이해', '그래프 해석 능력', '절편 계산'],
            weaknesses: ['복잡한 연립방정식 계산', '정확한 계산 능력'],
            recommendations: ['연립방정식 풀이 방법 재학습', '계산 실수 줄이기 연습', '유사 문제 추가 풀이']
        }
    },
    {
        code: 'ENG002',
        subject: '영어',
        title: '현재완료 시제 활용 평가',
        createdAt: '2025-06-16 10:20',
        submittedAt: '2025-06-16 11:10',
        result: '92점',
        status: 'completed',
        score: 92,
        maxScore: 100,
        difficulty: '중급',
        topics: ['Present Perfect', 'Have/Has', 'Past Participle'],
        timeSpent: 50,
        questions: [
            {
                number: 1,
                text: 'Fill in the blank: I _____ (live) in Seoul for 5 years.',
                studentAnswer: 'have lived',
                correctAnswer: 'have lived',
                score: 15,
                maxScore: 15,
                feedback: 'Perfect! You understand the present perfect tense well.',
                concept: 'Present Perfect Duration',
                difficulty: '기본'
            },
            {
                number: 2,
                text: 'Choose the correct form: She _____ her homework yet. (not finish)',
                studentAnswer: "hasn't finished",
                correctAnswer: "hasn't finished", 
                score: 15,
                maxScore: 15,
                feedback: 'Excellent use of negative present perfect!',
                concept: 'Present Perfect Negative',
                difficulty: '중급'
            },
            {
                number: 3,
                text: 'Translate: "나는 방금 저녁을 먹었다."',
                studentAnswer: 'I have just had dinner.',
                correctAnswer: 'I have just had dinner.',
                score: 20,
                maxScore: 20,
                feedback: 'Perfect translation using present perfect with "just"!',
                concept: 'Present Perfect + Just',
                difficulty: '중급'
            },
            {
                number: 4,
                text: 'Which is correct? a) I went to Paris last year. b) I have been to Paris last year.',
                studentAnswer: 'a',
                correctAnswer: 'a',
                score: 15,
                maxScore: 15,
                feedback: 'Correct! Past simple is used with specific time references.',
                concept: 'Present Perfect vs Past Simple',
                difficulty: '고급'
            },
            {
                number: 5,
                text: 'Complete: How long _____ you _____ (study) English?',
                studentAnswer: 'have, been studying',
                correctAnswer: 'have, been studying',
                score: 20,
                maxScore: 20,
                feedback: 'Great! Present perfect continuous for ongoing actions.',
                concept: 'Present Perfect Continuous',
                difficulty: '고급'
            },
            {
                number: 6,
                text: 'Find the error: "I have seen this movie yesterday."',
                studentAnswer: 'should be "I saw this movie yesterday"',
                correctAnswer: 'should be "I saw this movie yesterday"',
                score: 7,
                maxScore: 15,
                feedback: 'Good correction, but explanation could be clearer about why past simple is needed.',
                concept: 'Present Perfect vs Past Simple',
                difficulty: '고급'
            }
        ],
        analysis: {
            strengths: ['현재완료 기본 형태 이해', '부정문 구조', '번역 능력'],
            weaknesses: ['현재완료와 과거시제 구분', '문법 설명 능력'],
            recommendations: ['시제 구분 연습', '문법 용어 학습', '다양한 상황별 예문 연습']
        }
    },
    {
        code: 'KOR003',
        subject: '국어',
        title: '고전문학 작품 분석 평가',
        createdAt: '2025-06-17 09:15',
        submittedAt: '-',
        result: '미제출',
        status: 'pending',
        score: 0,
        maxScore: 100,
        difficulty: '고급',
        topics: ['고전소설', '인물분석', '주제의식', '문학사적 의의'],
        timeSpent: 0,
        dueDate: '2025-06-18 23:59'
    },
    {
        code: 'SCI004',
        subject: '과학',
        title: '화학 반응식과 몰 개념',
        createdAt: '2025-06-16 16:45',
        submittedAt: '2025-06-17 08:30',
        result: '78점',
        status: 'completed',
        score: 78,
        maxScore: 100,
        difficulty: '고급',
        topics: ['화학반응식', '몰', '아보가드로수', '화학량론'],
        timeSpent: 95,
        questions: [
            {
                number: 1,
                text: '탄소 12g에 포함된 원자의 개수는 몇 개인가?',
                studentAnswer: '6.022 × 10²³개',
                correctAnswer: '6.022 × 10²³개',
                score: 15,
                maxScore: 15,
                feedback: '아보가드로 수를 정확히 알고 있습니다.',
                concept: '아보가드로수',
                difficulty: '기본'
            },
            {
                number: 2,
                text: 'CH₄ + 2O₂ → CO₂ + 2H₂O 반응에서 메탄 2몰이 완전연소될 때 생성되는 물의 몰수는?',
                studentAnswer: '4몰',
                correctAnswer: '4몰',
                score: 20,
                maxScore: 20,
                feedback: '화학량론을 잘 이해하고 있습니다.',
                concept: '화학량론',
                difficulty: '중급'
            },
            {
                number: 3,
                text: '32g의 산소(O₂)는 몇 몰인가? (O=16)',
                studentAnswer: '1몰',
                correctAnswer: '1몰',
                score: 15,
                maxScore: 15,
                feedback: '분자량 계산이 정확합니다.',
                concept: '몰계산',
                difficulty: '기본'
            },
            {
                number: 4,
                text: '2Al + 3CuSO₄ → Al₂(SO₄)₃ + 3Cu 반응에서 알루미늄 5.4g으로부터 얻을 수 있는 구리의 질량은?',
                studentAnswer: '19.05g',
                correctAnswer: '19.05g',
                score: 13,
                maxScore: 25,
                feedback: '계산은 맞으나 과정 설명이 부족했습니다.',
                concept: '복합 화학량론',
                difficulty: '고급'
            },
            {
                number: 5,
                text: '0.1M NaCl 용액 500mL에 포함된 Na⁺ 이온의 개수는?',
                studentAnswer: '3.011 × 10²²개',
                correctAnswer: '3.011 × 10²²개',
                score: 15,
                maxScore: 25,
                feedback: '답은 맞으나 용액의 몰농도 개념 설명이 더 필요합니다.',
                concept: '용액의 몰농도',
                difficulty: '고급'
            }
        ],
        analysis: {
            strengths: ['기본 몰 개념 이해', '단순 화학량론 계산', '아보가드로수 활용'],
            weaknesses: ['복잡한 계산 과정 설명', '용액 관련 개념', '문제 해결 과정 기술'],
            recommendations: ['계산 과정 단계별 정리', '용액 농도 개념 보강', '서술형 답안 작성 연습']
        }
    }
];

// 추가 학습 통계 데이터
const DEMO_STATS = {
    weeklyStudyTime: [4.5, 6.2, 5.8, 7.1, 6.8, 8.2, 5.5], // 최근 7일
    subjectDistribution: {
        '수학': 35,
        '영어': 25,
        '과학': 20,
        '국어': 15,
        '사회': 5
    },
    performanceTrend: [
        { date: '2025-06-10', score: 78 },
        { date: '2025-06-12', score: 82 },
        { date: '2025-06-15', score: 85 },
        { date: '2025-06-16', score: 92 },
        { date: '2025-06-17', score: 78 }
    ],
    achievements: [
        { name: '수학 마스터', icon: '🔢', earned: true, description: '수학 평가 5회 연속 80점 이상' },
        { name: '영어 전문가', icon: '🗣️', earned: true, description: '영어 평가 평균 90점 이상' },
        { name: '과학 탐구자', icon: '🔬', earned: false, description: '과학 평가 10회 완료' },
        { name: '꾸준한 학습자', icon: '📚', earned: true, description: '30일 연속 학습' },
        { name: '완벽주의자', icon: '💯', earned: false, description: '만점 평가 3회 달성' }
    ],
    recentActivity: [
        { 
            type: 'assessment_completed',
            title: '영어 현재완료 시제 평가 완료',
            score: 92,
            time: '2시간 전',
            icon: '✅'
        },
        {
            type: 'study_goal_achieved', 
            title: '일일 학습 목표 달성',
            score: null,
            time: '5시간 전',
            icon: '🎯'
        },
        {
            type: 'assessment_started',
            title: '화학 반응식 평가 시작',
            score: null,
            time: '1일 전',
            icon: '▶️'
        }
    ]
};

// 로컬스토리지에 데모 데이터 저장
function loadDemoData() {
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('studentData', JSON.stringify(DEMO_STUDENT));
    localStorage.setItem('demoAssessments', JSON.stringify(DEMO_ASSESSMENTS));
    localStorage.setItem('demoStats', JSON.stringify(DEMO_STATS));
    
    console.log('✅ 데모 데이터가 로드되었습니다.');
    console.log('학생:', DEMO_STUDENT.name);
    console.log('평가지 수:', DEMO_ASSESSMENTS.length);
}

// 데모 모드 확인
function isDemoMode() {
    return localStorage.getItem('demoMode') === 'true';
}

// 데모 데이터 가져오기
function getDemoData(key) {
    if (isDemoMode()) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    return null;
}

// 데모 모드 초기화
if (typeof window !== 'undefined') {
    loadDemoData();
}
