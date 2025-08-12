'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { api } from '@/lib/api';

export default function VideoDetailPage({ params }: { params: { id: string } }) {
  const [src, setSrc] = useState<string>('');
  const [me, setMe] = useState<{ full_name: string; tc_no: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const id = params.id;

  useEffect(() => {
    (async () => {
      try {
        const meRes = await api.me();
        setMe({ full_name: meRes.full_name, tc_no: meRes.tc_no });
        const stream = await api.getStream(id);
        setSrc(stream.drm_url);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="p-6">
          {loading ? (
            <p>Yükleniyor...</p>
          ) : src && me ? (
            <VideoPlayer src={src} fullName={me.full_name} tcNo={me.tc_no} />
          ) : (
            <p>Video bulunamadı veya yetkiniz yok.</p>
          )}
        </div>
      </main>
    </>
  );
}
