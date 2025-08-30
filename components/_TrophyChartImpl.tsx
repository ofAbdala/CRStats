'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function Impl({ data }: { data: any[] }) {
  // Calcula o domínio dinâmico baseado nos dados reais
  const calculateDomain = () => {
    if (!data || data.length === 0) return [0, 1000];
    
    const trophies = data.map(d => d.trophies);
    const min = Math.min(...trophies);
    const max = Math.max(...trophies);
    
    // Adiciona uma margem de 5% para dar contexto visual
    const range = max - min;
    const margin = Math.max(range * 0.1, 50); // Mínimo de 50 troféus de margem
    
    return [
      Math.floor((min - margin) / 50) * 50, // Arredonda para baixo em múltiplos de 50
      Math.ceil((max + margin) / 50) * 50   // Arredonda para cima em múltiplos de 50
    ];
  };
  
  const [minDomain, maxDomain] = calculateDomain();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, left: 10, right: 10, bottom: 20 }}>
        <XAxis dataKey="label" hide />
        <YAxis 
          width={60} 
          stroke="#6B7280" 
          fontSize={12}
          domain={[minDomain, maxDomain]}
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