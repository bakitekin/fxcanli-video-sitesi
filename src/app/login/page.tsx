'use client';
import { useMemo, useState } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Bell, Eye, EyeOff, Film, Mail, Shield, Smartphone, User } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage(){
  const [step, setStep] = useState<'login'|'otp'|'done'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|undefined>();
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = useMemo(()=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),[email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(undefined);
    try{
      const res = await api.login({ email, password });
      if(res.otpRequired){ setStep('otp'); } else { setStep('done'); }
    }catch(err:any){ setError(err.message) } finally{ setLoading(false); }
  };
  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(undefined);
    try{ await api.otpVerify({ code: otp }); setStep('done'); }
    catch(err:any){ setError(err.message) } finally{ setLoading(false); }
  };

  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="p-6">
          <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Sol tanıtım paneli */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-black to-[#1f1f1f] text-white p-8">
              <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-brand-orange/20 blur-3xl" />
              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 grid place-items-center"><Film/></div>
                  <div>
                    <h2 className="text-2xl font-bold">fxcanli Premium</h2>
                    <p className="text-white/70">Teknik analiz eğitim videoları</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <Shield className="text-brand-orange" size={20}/>
                    <span>DRM korumalı yayın ve hareketli overlay</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Smartphone className="text-brand-orange" size={20}/>
                    <span>Tek cihazda oturum, yeni cihazda SMS OTP</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Bell className="text-brand-orange" size={20}/>
                    <span>Üyelik hatırlatma ve yeni video bildirimleri</span>
                  </li>
                </ul>
                <div className="pt-2 text-white/70 text-sm">Henüz hesabın yok mu? <Link className="text-white underline" href="/register">Hemen kaydol</Link></div>
              </div>
            </div>

            {/* Sağ form paneli */}
            <div className="bg-white rounded-2xl border p-6 lg:p-8 self-center">
              {step==='login' && (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-semibold">Giriş Yap</h2>
                    <p className="text-gray-600">E‑posta ve şifrenle devam et</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">E‑posta</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                      <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="ornek@eposta.com" className="pl-9"/>
                    </div>
                    {!isEmailValid && email.length>0 && (
                      <p className="text-xs text-red-600">Geçerli bir e‑posta girin</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Şifre</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                      <Input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Şifre" type={showPassword? 'text':'password'} className="pl-9 pr-10"/>
                      <button type="button" onClick={()=>setShowPassword(s=>!s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                      </button>
                    </div>
                    <div className="text-right">
                      <a className="text-sm text-gray-500 hover:underline" href="#">Şifremi unuttum</a>
                    </div>
                  </div>

                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <Button disabled={loading || !isEmailValid} className="w-full">{loading?'Gönderiliyor...':'Giriş Yap'}</Button>
                  <div className="text-sm text-gray-600">Hesabın yok mu? <Link href="/register" className="text-brand-black underline">Kayıt ol</Link></div>
                </form>
              )}

              {step==='otp' && (
                <form onSubmit={handleOtp} className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-semibold">SMS Doğrulama</h2>
                    <p className="text-gray-600">Telefonuna gelen 6 haneli kodu gir</p>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    <Input inputMode="numeric" pattern="[0-9]*" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,''))} className="col-span-6 text-center tracking-widest" placeholder="••••••"/>
                  </div>
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <Button disabled={loading || otp.length<6} className="w-full">{loading?'Doğrulanıyor...':'Doğrula'}</Button>
                  <div className="text-sm text-gray-600">Kod gelmedi mi? <button type="button" className="underline">Kodu tekrar gönder</button></div>
                </form>
              )}

              {step==='done' && (
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">Giriş başarılı</h2>
                  <p className="text-gray-600">Dashboard'a yönlendirebilirsiniz.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
