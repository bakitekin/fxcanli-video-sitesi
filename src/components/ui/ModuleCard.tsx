import React from 'react';
import Link from 'next/link';

interface ModuleCardProps {
  title: string;
  lessons: number;
  progress: number; // 0-100
  icon: React.ReactNode;
  href?: string;
  color?: 'yellow' | 'purple' | 'orange' | 'blue';
}

const colorMap = {
  yellow: 'text-brand-yellow',
  purple: 'text-brand-purple',
  orange: 'text-brand-orange',
  blue: 'text-blue-500',
} as const;

const bgMap = {
  yellow: 'bg-brand-yellow/15',
  purple: 'bg-brand-purple/15',
  orange: 'bg-brand-orange/15',
  blue: 'bg-blue-500/15',
} as const;

const barMap = {
  yellow: 'bg-brand-yellow',
  purple: 'bg-brand-purple',
  orange: 'bg-brand-orange',
  blue: 'bg-blue-500',
} as const;

const ModuleCard: React.FC<ModuleCardProps> = ({ title, lessons, progress, icon, href = '#', color = 'orange' }) => {
  const colorCls = colorMap[color];
  const bgCls = bgMap[color];
  const barCls = barMap[color];
  return (
    <div className={`rounded-2xl border p-5 bg-white hover:shadow transition`}> 
      <div className="flex items-start justify-between mb-4">
        <div className={`h-10 w-10 rounded-xl grid place-items-center ${bgCls}`}>
          <span className={`${colorCls}`}>{icon}</span>
        </div>
        <span className="text-xs bg-black/5 text-black px-2 py-1 rounded-full">{lessons} ders</span>
      </div>
      <h4 className="font-semibold text-lg mb-3">{title}</h4>
      <div className="mb-3">
        <div className="w-full h-2.5 bg-gray-200 rounded-full">
          <div className={`h-2.5 rounded-full ${barCls}`} style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
        </div>
        <div className="mt-1 text-xs text-gray-600">İlerleme: {Math.round(progress)}%</div>
      </div>
      <Link href={href} className="inline-flex items-center px-3 py-2 rounded-lg bg-brand-black text-white text-sm">
        Devam Et
      </Link>
    </div>
  );
};

export default ModuleCard;
