'use client';
import React, { useMemo } from 'react';

export type HeatCell = { date: string; value: number }; // ISO yyyy-mm-dd

const COLORS = ['#e5e7eb', '#fde3db', '#fdc6bb', '#fb9b85', '#ff5734'];
const levelFor = (v: number) => (v <= 0 ? 0 : v < 2 ? 1 : v < 4 ? 2 : v < 6 ? 3 : 4);

function lastNDays(n: number): string[] {
  const arr: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

export default function HeatmapCalendar({ data, weeks = 12 }: { data?: HeatCell[]; weeks?: number }) {
  const days = useMemo(() => {
    const keys = lastNDays(weeks * 7);
    const map = new Map<string, number>();
    (data ?? keys.map(k => ({ date: k, value: Math.round(Math.random() * 6) }))).forEach((d) => {
      map.set(d.date, d.value);
    });
    return keys.map((k) => ({ date: k, value: map.get(k) ?? 0 }));
  }, [data, weeks]);

  // Haftalara böl
  const columns = Array.from({ length: weeks }).map((_, c) => days.slice(c * 7, c * 7 + 7));
  const weekDay = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  return (
    <div className="flex items-start gap-3 w-full justify-center">
      <div className="hidden sm:grid grid-rows-7 gap-1 text-[10px] text-gray-400 pt-1">
        {weekDay.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="flex gap-1 p-2 rounded-xl border bg-gradient-to-br from-white to-gray-50">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-1">
            {col.map((d) => (
              <div
                key={d.date}
                className="h-4 w-4 md:h-3 md:w-3 rounded"
                style={{ background: COLORS[levelFor(d.value)] }}
                title={`${d.date} • ${d.value} dk`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="hidden md:flex items-center gap-2 ml-2 text-xs text-gray-500">
        <span>Az</span>
        <div className="flex items-center gap-1">
          {COLORS.map((c, i) => (
            <span key={i} className="h-3 w-3 rounded" style={{ background: c }} />
          ))}
        </div>
        <span>Çok</span>
      </div>
    </div>
  );
}
