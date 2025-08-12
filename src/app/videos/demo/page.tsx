'use client';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import VideoPlayer from '@/components/ui/VideoPlayer';
import Link from 'next/link';

const demoSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const outline = [
  { title: 'TradingView Kullanımı', dur: '58 dk' },
  { title: 'MetaTrader 4 Kurulum & Ayarlar', dur: '27 dk' },
  { title: 'Mum Formasyonlar Matematiği', dur: '50 dk' },
  { title: 'Destek-Direnç (Kanal)', dur: '64 dk' },
];

export default function DemoWatchPage(){
  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          <div className="xl:col-span-2 space-y-4">
            <VideoPlayer src={demoSrc} fullName="Demo Kullanıcı" tcNo="00000000000" />
            <div className="rounded-xl border bg-white p-4">
              <h1 className="text-xl font-semibold mb-1">Premium Teknik Analiz Eğitimi — Demo</h1>
              <p className="text-gray-600 text-sm">Bu sayfa, DRM akışına bağlanmadan arayüzü göstermek için örnek bir videoyu kullanır. Gerçek akışta VdoCipher DRM URL'i kullanılacaktır.</p>
              <div className="mt-3 flex gap-2">
                <Link href="/dashboard" className="px-3 py-2 rounded-lg bg-gray-200">Panele Dön</Link>
                <Link href="/payment" className="px-3 py-2 rounded-lg bg-brand-orange text-white">Üyelik Satın Al</Link>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border bg-white p-4">
              <h2 className="font-semibold mb-2">Ders İçeriği</h2>
              <ul className="space-y-2">
                {outline.map((o,i)=> (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span>{i+1}. {o.title}</span>
                    <span className="text-gray-500">{o.dur}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <h2 className="font-semibold mb-2">İpuçları</h2>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Video üzerinde ad + TC, sahtecilik önlemek için hareketlidir.</li>
                <li>Gerçek yayın DRM ile korunacaktır.</li>
                <li>Üyelik aktif kullanıcılar tek cihazdan izleyebilir.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}
