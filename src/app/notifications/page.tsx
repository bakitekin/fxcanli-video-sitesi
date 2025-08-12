'use client';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import Toggle from '@/components/ui/Toggle';
import { useMemo, useState } from 'react';
import { Bell, Mail, MessageSquare, Shield, Filter, PlayCircle } from 'lucide-react';
import NotificationCard, { NotificationType } from '@/components/ui/NotificationCard';

const initialHistory = [
  { id: 1, title: 'Yeni Video: Fibonacci Projection', body: 'Fibonacci Projection konusunun detayları ve örnekleri yayında.', time: '2 saat önce', type: 'video' as NotificationType, unread: true },
  { id: 2, title: 'Üyelik hatırlatma', body: 'Üyeliğinizin bitmesine 3 gün kaldı. Yenilemek için tıklayın.', time: 'Dün', type: 'push' as NotificationType },
  { id: 3, title: 'Ödev kontrol randevusu', body: 'Perşembe 20:00 için randevunuz onaylandı.', time: '3 gün önce', type: 'email' as NotificationType },
  { id: 4, title: 'SMS Doğrulama', body: 'Giriş doğrulama kodunuz: 472961', time: 'Geçen hafta', type: 'sms' as NotificationType },
];

export default function NotificationsPage(){
  const [prefs, setPrefs] = useState({ push: true, email: true, sms: false });
  const [history, setHistory] = useState(initialHistory);
  const [filter, setFilter] = useState<'all'|NotificationType>('all');

  const filtered = useMemo(()=> history.filter(h => filter==='all' ? true : h.type===filter), [history, filter]);

  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="p-6 space-y-6">
          {/* Hero */}
          <div className="rounded-2xl bg-gradient-to-r from-brand-black to-[#1f1f1f] text-white p-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">Bildirim Merkezi</h1>
              <p className="text-white/70 text-sm">Yeni videolar, ödevler ve üyelik hatırlatmaları tek yerde.</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={()=>setFilter('all')} className={`px-3 py-1.5 rounded-lg ${filter==='all'?'bg-white text-black':'bg-white/10'}`}>Tümü</button>
              <button onClick={()=>setFilter('video')} className={`px-3 py-1.5 rounded-lg ${filter==='video'?'bg-white text-black':'bg-white/10'}`}>Video</button>
              <button onClick={()=>setFilter('push')} className={`px-3 py-1.5 rounded-lg ${filter==='push'?'bg-white text-black':'bg-white/10'}`}>Push</button>
              <button onClick={()=>setFilter('email')} className={`px-3 py-1.5 rounded-lg ${filter==='email'?'bg-white text-black':'bg-white/10'}`}>E‑posta</button>
              <button onClick={()=>setFilter('sms')} className={`px-3 py-1.5 rounded-lg ${filter==='sms'?'bg-white text-black':'bg-white/10'}`}>SMS</button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Tercihler */}
            <div className="space-y-4">
              <div className="rounded-2xl border bg-white p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="text-brand-orange"/>
                  <h2 className="text-lg font-semibold">Tercihler</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">Hangi kanallardan bildirim almak istediğini seç.</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><Bell/> <span>Web Push</span></div>
                    <Toggle checked={prefs.push} onChange={(v)=>setPrefs(p=>({...p, push:v}))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><Mail/> <span>E‑posta</span></div>
                    <Toggle checked={prefs.email} onChange={(v)=>setPrefs(p=>({...p, email:v}))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><MessageSquare/> <span>SMS</span></div>
                    <Toggle checked={prefs.sms} onChange={(v)=>setPrefs(p=>({...p, sms:v}))} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-6">
                <h3 className="font-semibold mb-2">Örnek Anons</h3>
                <NotificationCard
                  type="video"
                  title="Harmonik: Gartley Yayında"
                  body="Gartley formasyonuna giriş, ölçümler ve giriş/çıkış stratejileri"
                  time="Şimdi"
                  unread
                  actionLabel="İzle"
                  onAction={()=>location.assign('/videos/demo')}
                />
              </div>
            </div>

            {/* Geçmiş */}
            <div className="xl:col-span-2 space-y-4">
              <div className="rounded-2xl border bg-white p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">Son Bildirimler</h2>
                  <div className="md:hidden">
                    <button className="px-3 py-1.5 rounded-lg bg-gray-100 flex items-center gap-2" onClick={()=>setFilter('all')}><Filter size={16}/> Filtre</button>
                  </div>
                </div>
                <div className="space-y-3">
                  {filtered.map(n => (
                    <NotificationCard key={n.id} type={n.type} title={n.title} body={n.body} time={n.time} unread={n.unread as any} actionLabel={n.type==='video' ? 'İzle' : undefined} onAction={()=> n.type==='video' && (location.href='/videos/demo')} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
