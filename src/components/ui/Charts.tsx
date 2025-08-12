import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

export function GradientArea({ data }: { data: Array<{ name: string; value: number }> }){
  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff5734" stopOpacity={0.5}/>
            <stop offset="95%" stopColor="#ff5734" stopOpacity={0.05}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="name" hide/>
        <YAxis hide/>
        <Tooltip cursor={{ stroke: '#eee' }} formatter={(v)=>[` ${v}`, 'Değer']} />
        <Area type="monotone" dataKey="value" stroke="#ff5734" fillOpacity={1} fill="url(#colorA)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RadialGauge({ value }: { value: number }){
  const data = [{ name: 'Progress', value, fill: '#ff5734' }];
  return (
    <ResponsiveContainer width="100%" height={160}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={14} data={data} startAngle={180} endAngle={0}>
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar background dataKey="value" cornerRadius={8} />
        {/* merkezde yüzde */}
        <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-current" fontSize={18} fontWeight={700}>{value}%</text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
