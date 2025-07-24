// 재무 데이터
const roeData = {
    labels: ['2020', '2021', '2022', '2023'],
    datasets: [
        {
            label: '삼성전자',
            data: [9.2, 17.4, 16.1, 12.8],
            borderColor: '#1f77b4',
            backgroundColor: '#1f77b4',
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.4
        },
        {
            label: 'LG전자',
            data: [6.8, 8.9, 7.2, 8.4],
            borderColor: '#ff7f0e',
            backgroundColor: '#ff7f0e',
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.4
        },
        {
            label: '업종평균',
            data: [7.5, 11.2, 9.8, 9.2],
            borderColor: '#2ca02c',
            backgroundColor: '#2ca02c',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderDash: [5, 5],
            tension: 0.4
        }
    ]
};

const operatingMarginData = {
    labels: ['2020', '2021', '2022', '2023'],
    datasets: [
        {
            label: '삼성전자',
            data: [15.6, 28.4, 16.3, 11.2],
            borderColor: '#d62728',
            backgroundColor: '#d62728',
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.4
        },
        {
            label: 'LG전자',
            data: [3.2, 4.8, 3.9, 4.1],
            borderColor: '#9467bd',
            backgroundColor: '#9467bd',
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.4
        },
        {
            label: '업종평균',
            data: [8.1, 12.5, 8.7, 6.8],
            borderColor: '#8c564b',
            backgroundColor: '#8c564b',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderDash: [5, 5],
            tension: 0.4
        }
    ]
};

const radarData = {
    labels: ['수익성', '안정성', '활동성', '성장성', '유동성'],
    datasets: [
        {
            label: '삼성전자',
            data: [85, 90, 75, 60, 85],
            borderColor: '#1f77b4',
            backgroundColor: 'rgba(31, 119, 180, 0.3)',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        },
        {
            label: 'LG전자',
            data: [65, 70, 80, 75, 70],
            borderColor: '#ff7f0e',
            backgroundColor: 'rgba(255, 127, 14, 0.3)',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }
    ]
};

// 차트 옵션 설정
const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        intersect: false,
        mode: 'index'
    },
    plugins: {
        legend: {
            position: 'top',
            labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                    size: 12,
                    weight: '500'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#ddd',
            borderWidth: 1,
            callbacks: {
                label: function(context) {
                    return context.dataset.label + ': ' + context.parsed.y + '%';
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                drawBorder: false
            },
            ticks: {
                font: {
                    size: 11
                }
            }
        },
        y: {
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                drawBorder: false
            },
            ticks: {
                font: {
                    size: 11
                },
                callback: function(value) {
                    return value + '%';
                }
            }
        }
    }
};

const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                padding: 15,
                font: {
                    size: 12,
                    weight: '500'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#ddd',
            borderWidth: 1
        }
    },
    scales: {
        r: {
            beginAtZero: true,
            max: 100,
            ticks: {
                stepSize: 20,
                font: {
                    size: 10
                }
            },
            grid: {
                color: 'rgba(0, 0, 0, 0.1)'
            },
            angleLines: {
                color: 'rgba(0, 0, 0, 0.1)'
            },
            pointLabels: {
                font: {
                    size: 12,
                    weight: '500'
                }
            }
        }
    },
    layout: {
        padding: {
            top: 20,
            bottom: 20,
            left: 20,
            right: 20
        }
    }
};

// 차트 생성 함수
function createCharts() {
    // ROE 차트
    const roeCtx = document.getElementById('roeChart').getContext('2d');
    new Chart(roeCtx, {
        type: 'line',
        data: roeData,
        options: {
            ...lineChartOptions,
            scales: {
                ...lineChartOptions.scales,
                y: {
                    ...lineChartOptions.scales.y,
                    title: {
                        display: true,
                        text: 'ROE (%)',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            }
        }
    });

    // 영업이익률 차트
    const operatingMarginCtx = document.getElementById('operatingMarginChart').getContext('2d');
    new Chart(operatingMarginCtx, {
        type: 'line',
        data: operatingMarginData,
        options: {
            ...lineChartOptions,
            scales: {
                ...lineChartOptions.scales,
                y: {
                    ...lineChartOptions.scales.y,
                    title: {
                        display: true,
                        text: '영업이익률 (%)',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            }
        }
    });

    // 레이더 차트
    const radarCtx = document.getElementById('radarChart').getContext('2d');
    new Chart(radarCtx, {
        type: 'radar',
        data: radarData,
        options: radarChartOptions
    });
}

// 페이지 로드 시 차트 생성
document.addEventListener('DOMContentLoaded', function() {
    createCharts();
});

// 윈도우 리사이즈 시 차트 반응형 처리
window.addEventListener('resize', function() {
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.resize();
    });
});