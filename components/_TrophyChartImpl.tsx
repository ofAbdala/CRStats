'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function Impl({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, left: 0, right: 0, bottom: 0 }}>
        <XAxis dataKey="label" hide />
        <YAxis width={40} stroke="#888" />
        <Tooltip contentStyle={{ background: '#0a0d14', border: '1px solid #1d2230', borderRadius: 12, color: '#fff' }} />
        <Line type="monotone" dataKey="trophies" stroke="#1E90FF" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}