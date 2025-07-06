// common/js/chart-utils.js

// 공통 차트 유틸리티 함수들
const ChartUtils = {
    // 차트 색상 팔레트
    colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#06b6d4',
        light: '#f1f5f9',
        dark: '#1e293b'
    },

    // 차트 그라데이션 생성
    createGradient: function(ctx, color1, color2) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
    },

    // 반응형 차트 기본 옵션
    getResponsiveOptions: function() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true
                }
            },
            elements: {
                point: {
                    radius: 6,
                    hoverRadius: 8,
                    borderWidth: 2
                },
                line: {
                    borderWidth: 3,
                    tension: 0.4
                }
            }
        };
    },

    // 한국 원화 포맷팅
    formatKRW: function(value) {
        return value.toLocaleString('ko-KR') + '원';
    },

    // 백분율 포맷팅
    formatPercent: function(value, decimals = 1) {
        return value.toFixed(decimals) + '%';
    },

    // 거래량 포맷팅 (M, K 단위)
    formatVolume: function(value) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        }
        return value.toString();
    },

    // 주식 데이터 생성기
    generateStockData: function(startPrice, days, volatility = 0.03) {
        const data = [];
        let currentPrice = startPrice;
        
        for (let i = 0; i < days; i++) {
            const randomChange = (Math.random() - 0.5) * 2 * volatility;
            currentPrice = currentPrice * (1 + randomChange);
            
            data.push({
                date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
                price: Math.round(currentPrice),
                volume: Math.floor(Math.random() * 50000000) + 10000000
            });
        }
        return data;
    },

    // 이동평균선 계산
    calculateMovingAverage: function(data, period) {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                result.push(null);
            } else {
                const sum = data.slice(i - period + 1, i + 1)
                    .reduce((acc, val) => acc + val.price, 0);
                result.push(Math.round(sum / period));
            }
        }
        return result;
    },

    // RSI 계산
    calculateRSI: function(data, period = 14) {
        const gains = [];
        const losses = [];
        
        for (let i = 1; i < data.length; i++) {
            const change = data[i].price - data[i-1].price;
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? Math.abs(change) : 0);
        }
        
        const rsi = [];
        for (let i = 0; i < gains.length; i++) {
            if (i < period - 1) {
                rsi.push(null);
            } else {
                const avgGain = gains.slice(i - period + 1, i + 1)
                    .reduce((acc, val) => acc + val, 0) / period;
                const avgLoss = losses.slice(i - period + 1, i + 1)
                    .reduce((acc, val) => acc + val, 0) / period;
                
                const rs = avgGain / (avgLoss || 1);
                rsi.push(100 - (100 / (1 + rs)));
            }
        }
        return rsi;
    },

    // 볼린저 밴드 계산
    calculateBollingerBands: function(data, period = 20, multiplier = 2) {
        const ma = this.calculateMovingAverage(data, period);
        const upper = [];
        const lower = [];
        
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                upper.push(null);
                lower.push(null);
            } else {
                const slice = data.slice(i - period + 1, i + 1);
                const mean = ma[i];
                const variance = slice.reduce((acc, val) => 
                    acc + Math.pow(val.price - mean, 2), 0) / period;
                const stdDev = Math.sqrt(variance);
                
                upper.push(Math.round(mean + (stdDev * multiplier)));
                lower.push(Math.round(mean - (stdDev * multiplier)));
            }
        }
        
        return { upper, lower, middle: ma };
    },

    // 차트 업데이트 애니메이션
    updateChartWithAnimation: function(chart, newData) {
        chart.data = newData;
        chart.update('active');
    },

    // 차트 리사이즈 핸들러
    handleResize: function(chart) {
        window.addEventListener('resize', function() {
            chart.resize();
        });
    }
};

// 탭 전환 공통 함수
function showTab(tabName) {
    // 모든 탭 숨기기
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // 모든 버튼 비활성화
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 선택된 탭 보이기
    const selectedTab = document.getElementById('tab-' + tabName);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }
    
    // 클릭된 버튼 활성화
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // 차트 초기화 이벤트 발생
    window.dispatchEvent(new CustomEvent('tabChanged', { detail: tabName }));
}

// 차트 로딩 상태 관리
const LoadingManager = {
    show: function(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
                    <div style="text-align: center;">
                        <div style="border: 4px solid #f3f4f6; border-radius: 50%; border-top: 4px solid #3b82f6; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                        <p style="margin-top: 15px; color: #6b7280;">차트를 불러오는 중...</p>
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
        }
    },

    hide: function(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<canvas id="' + containerId.replace('Container', 'Chart') + '"></canvas>';
        }
    }
};

// 에러 핸들링
const ErrorHandler = {
    showError: function(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #ef4444;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">⚠</div>
                    <h4>차트를 불러올 수 없습니다</h4>
                    <p style="margin-top: 10px; color: #6b7280;">${message}</p>
                </div>
            `;
        }
    }
};

// 브라우저 호환성 체크
function checkBrowserCompatibility() {
    if (!window.Chart) {
        ErrorHandler.showError('main-content', 'Chart.js 라이브러리를 불러올 수 없습니다.');
        return false;
    }
    return true;
}

// 페이지 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    checkBrowserCompatibility();
    
    // 첫 번째 탭 자동 활성화
    const firstTabButton = document.querySelector('.tab-button');
    if (firstTabButton) {
        firstTabButton.click();
    }
});