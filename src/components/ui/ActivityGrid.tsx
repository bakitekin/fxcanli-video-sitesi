import React from 'react';

interface ActivityGridProps {
  days: number[]; // 42 değer 0-4 yoğunluk
}

const levels = ["#e5e7eb", "#fde3db", "#fdc6bb", "#fb9b85", "#ff5734"]; 

const ActivityGrid: React.FC<ActivityGridProps> = ({ days }) => {
  const cells = new Array(42).fill(0).map((_,i)=> days[i] ?? 0);
  const weekDays = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];
  return (
    <div className="flex gap-2 items-start">
      <div className="grid grid-rows-7 gap-1 text-[10px] text-gray-400 pt-3">
        {weekDays.map(d=> <span key={d}>{d}</span>)}
      </div>
      <div className="p-2 rounded-xl border bg-gradient-to-br from-white to-gray-50">
        <div className="grid grid-cols-7 gap-1">
          {cells.map((v,i)=> (
            <div key={i} className="h-3 w-3 rounded" style={{ background: levels[Math.max(0, Math.min(4, v))]}} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityGrid;
