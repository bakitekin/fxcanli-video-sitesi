'use client';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import ModuleCard from '@/components/ui/ModuleCard';
import { Compass, Ruler, Shapes, ShieldCheck } from 'lucide-react';
import { GradientArea, RadialGauge } from '@/components/ui/Charts';

const modules = [
  { key: 'baslangic', title: 'Başlangıç ve Altyapı', items: [1,2,3,4,5,6,7,8], icon: <Compass size={18}/>, color: 'orange', progress: 45 },
  { key: 'fibo', title: 'Fibonacci ve Zaman', items: [9,10,11,12,13], icon: <Ruler size={18}/>, color: 'purple', progress: 62 },
  { key: 'formasyon', title: 'Formasyonlar', items: [14,15,16,17,18,19], icon: <Shapes size={18}/>, color: 'blue', progress: 30 },
  { key: 'strateji', title: 'Strateji & Risk', items: [20,21,22,30,31,32], icon: <ShieldCheck size={18}/>, color: 'yellow', progress: 18 },
];

const areaData = Array.from({length: 14}).map((_,i)=>({ name: `G${i+1}`, value: Math.round(5 + Math.random()*15)}));

export default function DashboardPage(){
  const [me, setMe] = useState<{full_name:string; tc_no:string; membership_end?: string} | null>(null);
  const [videos, setVideos] = useState<Array<{id:string; title:string}>>([]);

  useEffect(()=>{(async()=>{
    try{
      const meRes = await api.me();
      setMe(meRes as any);
      const v = await api.listVideos();
      setVideos(v);
    }catch(e){console.error(e)}
  })()},[]);

  const membershipCountdown = useMemo(()=>{
    if(!me?.membership_end) return null;
    const end = new Date(me.membership_end).getTime();
    const now = Date.now();
    const diff = Math.max(0, end - now);
    const days = Math.floor(diff / (1000*60*60*24));
    return `${days} gün kaldı`;
  },[me?.membership_end]);

  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="p-6 space-y-6">
          {/* Karşılama */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-black via-[#2b2b2b] to-brand-black text-white p-6">
            <div className="absolute right-10 -top-8 h-40 w-40 rounded-full bg-brand-orange/20 blur-3xl"/>
            <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-brand-orange/10 blur-3xl"/>
            <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">Hoş geldin {me?.full_name ?? ''}</h2>
                <p className="text-sm text-white/70">fxcanli Premium üyeliğin: {membershipCountdown ?? '—'}</p>
              </div>
              <Link href="/payment" className="px-4 py-2 rounded-lg bg-brand-orange text-white">Üyeliği Uzat</Link>
            </div>
          </div>

          {/* Üst Grid: Recharts bileşenleri */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="rounded-xl border bg-white p-6">
              <div className="text-sm text-gray-600">Genel İlerleme</div>
              <RadialGauge value={62} />
            </div>
            <div className="rounded-xl border bg-white p-6 xl:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">Son 2 Hafta Aktivite</div>
              </div>
              <GradientArea data={areaData} />
            </div>
          </div>

          {/* Modüller */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Modüller</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {modules.map(m=> (
                <ModuleCard key={m.key} title={m.title} lessons={m.items.length} progress={m.progress} icon={m.icon} color={m.color as any} />
              ))}
            </div>
          </section>

          {/* Son Videolar */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Son Videolar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {videos.slice(0,6).map(v => (
                <Link key={v.id} href={`/videos/${v.id}`} className="rounded-xl border p-4 bg-white hover:shadow">
                  <div className="font-semibold">{v.title}</div>
                  <div className="text-sm text-gray-600">Tıklayıp izleyin</div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
