import React from 'react';

interface RadialProgressProps {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ value, size = 120, stroke = 10, label }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (clamped / 100) * c;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="radialGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff5734" />
          <stop offset="100%" stopColor="#be94f5" />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
      <circle
        cx={size/2}
        cy={size/2}
        r={r}
        stroke="url(#radialGrad)"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-brand-black" fontSize={18} fontWeight={700}>
        {Math.round(clamped)}%
      </text>
      {label && (
        <text x="50%" y={size-8} textAnchor="middle" className="fill-gray-500" fontSize={12}>{label}</text>
      )}
    </svg>
  );
};

export default RadialProgress;
