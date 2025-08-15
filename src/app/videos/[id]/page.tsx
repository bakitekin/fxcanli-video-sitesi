'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import VideoPlayer from '@/components/ui/VideoPlayer';
import DrmVideoPlayer from '@/components/ui/DrmVideoPlayer';
import { api } from '@/lib/api';

export default function VideoDetailPage() {
  const [src, setSrc] = useState<string>('');
  const [drm, setDrm] = useState<null | { manifestUrl: string; licenseServers: Record<string,string>; fairplayCertUrl?: string }>(null);
  const [me, setMe] = useState<{ full_name: string; tc_no: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ id: string }>();
  const id = params?.id;

  useEffect(() => {
    (async () => {
      try {
        const meRes = await api.me();
        setMe({ full_name: meRes.full_name, tc_no: meRes.tc_no });
        const proxied = await fetch(`/api/videos/stream/${id}`, { credentials: 'include' }).then(r=>r.json());
        if (proxied?.drm?.manifestUrl && proxied?.drm?.licenseServers) {
          setDrm({
            manifestUrl: proxied.drm.manifestUrl,
            licenseServers: proxied.drm.licenseServers,
            fairplayCertUrl: proxied.drm.fairplayCertUrl,
          });
        } else if (proxied?.m3u8) {
          setSrc(proxied.m3u8);
        }
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
          ) : me && (drm || src) ? (
            drm ? (
              <DrmVideoPlayer
                manifestUrl={drm.manifestUrl}
                licenseServers={drm.licenseServers}
                fairplayCertUrl={drm.fairplayCertUrl}
                fullName={me.full_name}
                tcNo={me.tc_no}
              />
            ) : (
              <VideoPlayer src={src} fullName={me.full_name} tcNo={me.tc_no} />
            )
          ) : (
            <p>Video bulunamadı veya yetkiniz yok.</p>
          )}
        </div>
      </main>
    </>
  );
}
