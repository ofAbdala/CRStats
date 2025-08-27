'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function Impl({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, left: 10, right: 10, bottom: 20 }}>
        <XAxis dataKey="label" hide />
        <YAxis 
          width={60} 
          stroke="#6B7280" 
          fontSize={12}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip 
          contentStyle={{ 
            background: '#0A0D14', 
            border: '1px solid #1D2230', 
            borderRadius: 12, 
            color: '#fff',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}
          labelStyle={{ color: '#9CA3AF' }}
          formatter={(value: any) => [value.toLocaleString(), 'Troféus']}
        />
        <Line 
          type="monotone" 
          dataKey="trophies" 
          stroke="#1E90FF" 
          strokeWidth={3} 
          dot={{ fill: '#1E90FF', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#1E90FF', strokeWidth: 2, fill: '#FFD700' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}