import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Scatter, ScatterChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Activity, Calculator } from 'lucide-react';

const VolumeCorrelationAnalyzer = () => {
  const [selectedStock, setSelectedStock] = useState('삼성전자');
  const [timeframe, setTimeframe] = useState('30');
  const [correlationValue, setCorrelationValue] = useState(0);
  const [obvData, setObvData] = useState([]);
  
  // 실제 한국 주식 데이터를 모사한 샘플 데이터
  const generateSampleData = (days = 30) => {
    const data = [];
    let price = 60000;
    let volume = 15000000;
    let obv = 0;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      // 주가 변동 시뮬레이션 (일반적인 주식 움직임)
      const priceChange = (Math.random() - 0.5) * 0.06; // ±3% 변동
      price = Math.max(price * (1 + priceChange), 45000);
      
      // 거래량 변동 시뮬레이션 (주가 변동과 약간의 상관관계)
      const volumeMultiplier = 1 + (Math.abs(priceChange) * 2) + (Math.random() - 0.5) * 0.4;
      volume = Math.max(volume * volumeMultiplier, 5000000);
      
      // OBV 계산
      if (i > 0) {
        const prevPrice = data[i-1].price;
        if (price > prevPrice) {
          obv += volume;
        } else if (price < prevPrice) {
          obv -= volume;
        }
      }
      
      data.push({
        date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        price: Math.round(price),
        volume: Math.round(volume),
        obv: obv,
        priceChange: i > 0 ? ((price - data[i-1].price) / data[i-1].price * 100) : 0,
        volumeMA: i >= 5 ? data.slice(Math.max(0, i-4), i+1).reduce((sum, item) => sum + item.volume, 0) / 5 : volume
      });
    }
    
    return data;
  };

  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const data = generateSampleData(parseInt(timeframe));
    console.log('Generated data:', data); // 디버깅용
    setStockData(data);
    setObvData(data);
    
    // 상관계수 계산
    if (data.length > 1) {
      const prices = data.map(d => d.priceChange);
      const volumes = data.map(d => d.volume);
      const correlation = calculateCorrelation(prices, volumes);
      setCorrelationValue(correlation);
      console.log('Correlation:', correlation); // 디버깅용
    }
  }, [selectedStock, timeframe]);

  const calculateCorrelation = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
    const sumXX = x.reduce((total, xi) => total + xi * xi, 0);
    const sumYY = y.reduce((total, yi) => total + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  };

  const getCorrelationColor = (corr) => {
    if (corr > 0.7) return '#059669'; // green-600
    if (corr > 0.3) return '#d97706'; // yellow-600  
    if (corr > -0.3) return '#6b7280'; // gray-600
    if (corr > -0.7) return '#ea580c'; // orange-600
    return '#dc2626'; // red-600
  };

  const getCorrelationText = (corr) => {
    if (corr > 0.7) return '강한 양의 상관관계';
    if (corr > 0.3) return '양의 상관관계';
    if (corr > -0.3) return '상관관계 없음';
    if (corr > -0.7) return '음의 상관관계';
    return '강한 음의 상관관계';
  };

  const stockOptions = [
    '삼성전자', 'SK하이닉스', 'LG전자', 'NAVER', '카카오',
    'LG화학', '현대차', 'POSCO홀딩스', '삼성SDI', 'KB금융'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2">거래량-주가 상관관계 분석 도구</h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">한국 주식시장의 거래량과 주가 움직임을 실시간으로 분석합니다</p>
        </div>

      {/* 설정 패널 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <div className="bg-gray-50 p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">분석 종목</label>
          <select 
            value={selectedStock} 
            onChange={(e) => setSelectedStock(e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            {stockOptions.map(stock => (
              <option key={stock} value={stock}>{stock}</option>
            ))}
          </select>
        </div>
        
        <div className="bg-gray-50 p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">분석 기간</label>
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            <option value="15">15일</option>
            <option value="30">30일</option>
            <option value="60">60일</option>
            <option value="90">90일</option>
          </select>
        </div>
      </div>

      {/* 메트릭 카드들 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-blue-600 font-semibold mb-1 sm:mb-2">현재 주가</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-800">
                {stockData && stockData.length > 0 ? stockData[stockData.length - 1].price.toLocaleString() : 0}원
              </p>
            </div>
            <TrendingUp className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-green-600 font-semibold mb-1 sm:mb-2">일 거래량</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-800">
                {stockData && stockData.length > 0 ? (stockData[stockData.length - 1].volume / 10000).toFixed(0) : 0}만주
              </p>
            </div>
            <BarChart3 className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-purple-600 font-semibold mb-1 sm:mb-2">상관계수</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-800">
                {correlationValue.toFixed(3)}
              </p>
            </div>
            <Calculator className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-orange-600 font-semibold mb-1 sm:mb-2">가격 변동률</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-800">
                {stockData && stockData.length > 0 ? 
                  (stockData[stockData.length - 1].priceChange > 0 ? '+' : '') + 
                  stockData[stockData.length - 1].priceChange.toFixed(2) : 0}%
              </p>
            </div>
            <Activity className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* 주가와 거래량 복합 차트 */}
      <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">주가 및 거래량 추이</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="price" orientation="left" />
            <YAxis yAxisId="volume" orientation="right" />
            <Tooltip 
              formatter={(value, name) => [
                name === 'price' ? `${value.toLocaleString()}원` : 
                name === 'volume' ? `${(value/10000).toFixed(0)}만주` : value,
                name === 'price' ? '주가' : 
                name === 'volume' ? '거래량' : name
              ]}
            />
            <Legend />
            <Line yAxisId="price" type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={3} name="주가" />
            <Bar yAxisId="volume" dataKey="volume" fill="#10b981" opacity={0.7} name="거래량" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* OBV 차트 */}
      <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">OBV (On Balance Volume) 분석</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={obvData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${(value/100000000).toFixed(1)}억`, 'OBV']}
            />
            <Legend />
            <Line type="monotone" dataKey="obv" stroke="#7c3aed" strokeWidth={3} name="OBV" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 상관관계 산점도 */}
      <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">거래량-주가변동률 상관관계 산점도</h2>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="priceChange" 
              type="number" 
              domain={['dataMin', 'dataMax']}
              name="주가변동률(%)"
            />
            <YAxis 
              dataKey="volume" 
              type="number" 
              domain={['dataMin', 'dataMax']}
              name="거래량"
            />
            <Tooltip 
              formatter={(value, name) => [
                name === 'volume' ? `${(value/10000).toFixed(0)}만주` : `${value.toFixed(2)}%`,
                name === 'volume' ? '거래량' : '주가변동률'
              ]}
            />
            <Scatter name="데이터 포인트" dataKey="volume" fill="#f59e0b" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* 분석 결과 해석 */}
      <div className="bg-gray-50 p-4 sm:p-5 lg:p-6 rounded-lg">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">분석 결과 해석</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-2">상관관계 분석</h3>
            <p className="text-gray-700 mb-2 text-sm sm:text-base">
              현재 {selectedStock}의 거래량과 주가변동률 간 상관계수는 <span className={`font-bold ${getCorrelationColor(correlationValue)}`}>
                {correlationValue.toFixed(3)}
              </span>로, <span className={getCorrelationColor(correlationValue)}>
                {getCorrelationText(correlationValue)}
              </span>를 보입니다.
            </p>
            {correlationValue > 0.5 && (
              <p className="text-green-700 text-xs sm:text-sm">
                • 거래량 증가 시 주가 상승 가능성이 높습니다<br/>
                • 상승 추세의 신뢰성이 높은 상태입니다
              </p>
            )}
            {correlationValue < -0.5 && (
              <p className="text-red-700 text-xs sm:text-sm">
                • 거래량 증가 시 주가 하락 압력이 존재합니다<br/>
                • 분산 또는 조정 가능성을 고려해야 합니다
              </p>
            )}
            {Math.abs(correlationValue) <= 0.5 && (
              <p className="text-gray-700 text-xs sm:text-sm">
                • 거래량과 주가 변동의 관계가 명확하지 않습니다<br/>
                • 다른 기술적 지표와 함께 종합 판단이 필요합니다
              </p>
            )}
          </div>
          
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-2">OBV 분석</h3>
            <p className="text-gray-700 mb-2 text-sm sm:text-base">
              OBV는 거래량의 누적 지표로 주가 추세의 지속성을 판단하는 데 활용됩니다.
            </p>
            <p className="text-gray-600 text-xs sm:text-sm">
              • OBV 상승 + 주가 상승: 강한 매수세, 상승 지속 가능성<br/>
              • OBV 하락 + 주가 상승: 약한 상승세, 조정 가능성<br/>
              • OBV 상승 + 주가 하락: 바닥 근접, 반등 가능성<br/>
              • OBV 하락 + 주가 하락: 강한 매도세, 하락 지속 가능성
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-3 sm:p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-yellow-800 text-xs sm:text-sm">
            <strong>투자 주의사항:</strong> 본 분석 도구는 참고용으로만 활용하시기 바랍니다. 
            실제 투자 시에는 기업의 펀더멘털, 시장 상황, 기타 기술적 지표를 종합적으로 고려하여 신중하게 결정하시기 바랍니다.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default VolumeCorrelationAnalyzer;