'use client';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Lock, PlayCircle, Shield } from 'lucide-react';

const steps = [
  { id: 'v1', title: 'TradingView Kullanımı', locked: false },
  { id: 'v2', title: 'MetaTrader 4 Kurulumu', locked: true },
  { id: 'v3', title: 'Mum Formasyonlar Matematiği', locked: true },
];

export default function PaymentPage(){
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [paid, setPaid] = useState(false);

  useEffect(()=>{(async()=>{
    try{ const r = await api.createPayment({ packageId: 'premium' }); setIframeUrl(r.iframeUrl); }
    catch(e){ console.error(e); }
  })()},[]);

  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Sol: Paket ve ödeme iframe */}
          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-6">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="text-brand-orange"/>
                <h1 className="text-xl font-semibold">fxcanli Premium — Aylık Üyelik</h1>
              </div>
              <p className="text-gray-600 text-sm">Ödeme tamamlandığında kilitli videoların kilidi açılır ve sıradaki derse otomatik geçiş yapılır.</p>
              <div className="mt-3 rounded-xl border bg-black/5 p-3">
                {iframeUrl ? (
                  <iframe src={iframeUrl} className="w-full h-[520px] bg-white" />
                ) : (
                  <p>Ödeme sayfası yükleniyor...</p>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={()=>setPaid(true)} className="px-3 py-2 rounded-lg bg-brand-orange text-white">Test: Ödemeyi Tamamla</button>
                {paid && <Link href="/videos/demo" className="px-3 py-2 rounded-lg bg-brand-black text-white">Sıradaki Videoya Geç</Link>}
              </div>
            </div>
          </div>

          {/* Sağ: Video akışı */}
          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="font-semibold mb-4">Eğitim Akışı</h2>
              <ol className="space-y-3">
                {steps.map((s, idx)=> (
                  <li key={s.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {paid || !s.locked || idx===0 ? (
                        <PlayCircle className="text-brand-orange"/>
                      ) : (
                        <Lock className="text-gray-400"/>
                      )}
                      <span className={`${(paid || !s.locked || idx===0) ? '' : 'text-gray-400'}`}>{idx+1}. {s.title}</span>
                    </div>
                    {(paid || !s.locked || idx===0) ? (
                      <CheckCircle2 className="text-green-600"/>
                    ) : null}
                  </li>
                ))}
              </ol>
              <p className="text-xs text-gray-500 mt-3">Not: Ödeme onaylandığında bir sonraki dersin kilidi otomatik açılır.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
