// Chart.js 수정 스크립트

function fixChartConfig() {
    // 기존 차트 설정 수정
    window.initializeCharts = function() {
        // 진행률 차트 (도넛형)
        const progressCtx = document.getElementById('progressChart').getContext('2d');
        new Chart(progressCtx, {
            type: 'doughnut',
            data: {
                labels: ['수학', '국어', '영어', '과학', '사회'],
                datasets: [{
                    data: [85, 72, 91, 68, 79],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB', 
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                layout: {
                    padding: 10
                }
            }
        });

        // 성취도 차트 (막대형)
        const achievementCtx = document.getElementById('achievementChart').getContext('2d');
        new Chart(achievementCtx, {
            type: 'bar',
            data: {
                labels: ['수학', '국어', '영어', '과학', '사회'],
                datasets: [{
                    label: '성취도 (%)',
                    data: [88, 76, 94, 71, 82],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                layout: {
                    padding: 10
                }
            }
        });
    };
}

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', function() {
    fixChartConfig();
    setTimeout(initializeCharts, 100); // 약간의 지연 후 차트 초기화
});
