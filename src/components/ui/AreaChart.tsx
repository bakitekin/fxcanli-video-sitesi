import React from 'react';

interface AreaChartProps {
  points: number[];
  width?: number;
  height?: number;
}

const AreaChart: React.FC<AreaChartProps> = ({ points, width = 320, height = 100 }) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const scaleX = (i: number) => (i / (points.length - 1)) * width;
  const scaleY = (p: number) => height - ((p - min) / (max - min + 0.0001)) * height;

  const lineD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i).toFixed(1)} ${scaleY(p).toFixed(1)}`)
    .join(' ');
  const fillPath = `${lineD} L ${width} ${height} L 0 ${height} Z`;

  // grid lines (4 rows)
  const rows = [0.25, 0.5, 0.75].map(r => (
    <line key={r} x1={0} x2={width} y1={height * r} y2={height * r} stroke="#e5e7eb" strokeDasharray="4 4" />
  ));

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}> 
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff5734" stopOpacity={0.38} />
          <stop offset="100%" stopColor="#ff5734" stopOpacity={0.05} />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff5734" />
          <stop offset="100%" stopColor="#be94f5" />
        </linearGradient>
      </defs>
      {rows}
      <path d={fillPath} fill="url(#areaGrad)" />
      <path d={lineD} fill="none" stroke="url(#lineGrad)" strokeWidth={2} />
      {points.map((p,i)=> (
        <circle key={i} cx={scaleX(i)} cy={scaleY(p)} r={2.5} fill="#ff5734" />
      ))}
    </svg>
  );
};

export default AreaChart;
