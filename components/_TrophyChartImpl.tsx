'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function TrophyChartImpl({ data }: { data: any[] }) {
  const calculateDomain = () => {
    if (!data || data.length === 0) return [0, 1000];
    
    const trophies = data.map(d => d.trophies);
    const min = Math.min(...trophies);
    const max = Math.max(...trophies);
    
    const range = max - min;
    const margin = Math.max(range * 0.1, 50);
    
    return [
      Math.floor((min - margin) / 50) * 50,
      Math.ceil((max + margin) / 50) * 50
    ];
  };
  
  const [minDomain, maxDomain] = calculateDomain();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, left: 20, right: 20, bottom: 20 }}>
        <XAxis 
          dataKey="label" 
          stroke="#6B7280" 
          fontSize={12}
          tick={{ fill: '#9CA3AF', fontWeight: 300 }}
          tickLine={{ stroke: '#374151' }}
          axisLine={{ stroke: '#374151' }}
          interval="preserveStartEnd"
        />
        <YAxis 
          width={80} 
          stroke="#6B7280" 
          fontSize={12}
          domain={[minDomain, maxDomain]}
          tickFormatter={(value) => value.toLocaleString()}
          tick={{ fill: '#9CA3AF', fontWeight: 300 }}
          tickLine={{ stroke: '#374151' }}
          axisLine={{ stroke: '#374151' }}
        />
        <Tooltip 
          contentStyle={{ 
            background: 'rgba(0, 0, 0, 0.95)', 
            border: '1px solid #374151', 
            borderRadius: 24, 
            color: '#fff',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            fontWeight: 300
          }}
          labelStyle={{ color: '#9CA3AF', fontWeight: 400 }}
          formatter={(value: any) => [
            <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{value.toLocaleString()}</span>, 
            'Troféus Elite'
          ]}
        />
        <Line 
          type="monotone" 
          dataKey="trophies" 
          stroke="#FFFFFF" 
          strokeWidth={3} 
          dot={{ fill: '#FFFFFF', strokeWidth: 0, r: 4 }}
          activeDot={{ 
            r: 8, 
            stroke: '#FFFFFF', 
            strokeWidth: 3, 
            fill: '#000000',
            filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.8))'
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}