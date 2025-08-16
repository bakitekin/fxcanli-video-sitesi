'use client';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { api } from '@/lib/api';
import { useEffect, useState, useRef } from 'react';

export default function AdminVideosPage(){
  const [videos, setVideos] = useState<Array<{id:string; title:string}>>([]);
  const [title, setTitle] = useState('');
  const [drmUrl, setDrmUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(()=>{(async()=>{ try{ setVideos(await api.listVideos()); }catch(e){console.error(e)} })()},[]);

  const handleCreate = async (e: React.FormEvent)=>{
    e.preventDefault();
    try{
      await api.uploadVideo({ title, description: desc, drm_url: drmUrl });
      setVideos(await api.listVideos());
      setTitle(''); setDrmUrl(''); setDesc('');
    }catch(e){ console.error(e) }
  };

  const handleSelectFile = async (e: React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try{
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'admin');
      const res = await fetch('/api/storage/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error(await res.text());
      const out = await res.json() as { publicUrl?: string | null };
      if (out?.publicUrl) {
        setDrmUrl(out.publicUrl);
      }
    }catch(err){
      console.error(err);
      alert('Yükleme başarısız. Lütfen tekrar deneyin.');
    }finally{
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="p-6 space-y-6">
          <form onSubmit={handleCreate} className="bg-white border rounded-xl p-4 grid gap-3 md:grid-cols-4">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Başlık" className="border rounded px-3 py-2"/>
            <input value={drmUrl} onChange={e=>setDrmUrl(e.target.value)} placeholder="Video URL / DRM Manifest" className="border rounded px-3 py-2"/>
            <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Açıklama" className="border rounded px-3 py-2"/>
            <div className="flex items-center gap-2">
              <input ref={fileInputRef} type="file" accept="video/*" onChange={handleSelectFile} className="text-sm"/>
              <span className="text-xs text-gray-500">{uploading ? 'Yükleniyor...' : 'Dosya seç'}</span>
            </div>
            <button className="px-4 py-2 bg-brand-orange text-white rounded">Ekle</button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {videos.map(v=> (
              <div key={v.id} className="bg-white border rounded-xl p-4">
                <div className="font-semibold">{v.title}</div>
                <a className="text-brand-orange text-sm" href={`/videos/${v.id}`}>İzle</a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
