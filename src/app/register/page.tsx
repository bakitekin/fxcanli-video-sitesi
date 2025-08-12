'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { api } from '@/lib/api';
import { BadgeCheck, Eye, EyeOff, IdCard, Lock, Mail, Phone, Shield } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    tc_no: '',
    email: '',
    phone: '',
    password: '',
    password_confirm: '',
    terms: false,
  });
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const isEmailValid = useMemo(
    () => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)),
    [formData.email]
  );
  const isTcValid = useMemo(
    () => (/^\d{11}$/.test(formData.tc_no)),
    [formData.tc_no]
  );
  const isPhoneValid = useMemo(
    () => (/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))),
    [formData.phone]
  );
  const isPwdStrong = useMemo(
    () => formData.password.length >= 8,
    [formData.password]
  );
  const isPwdMatch = formData.password && formData.password === formData.password_confirm;

  const canSubmit =
    formData.full_name.trim().length >= 3 &&
    isTcValid &&
    isEmailValid &&
    isPhoneValid &&
    isPwdStrong &&
    isPwdMatch &&
    formData.terms;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined); setSuccess(undefined);
    if (!canSubmit) { setError('Lütfen formu geçerli şekilde doldurun.'); return; }
    try {
      setLoading(true);
      await api.register({
        full_name: formData.full_name,
        tc_no: formData.tc_no,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      setSuccess('Kayıt başarılı! Giriş sayfasına yönlendirebilirsiniz.');
    } catch (err: any) {
      setError(err.message || 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
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
                  <div className="h-10 w-10 rounded-xl bg-white/10 grid place-items-center"><Shield/></div>
                  <div>
                    <h2 className="text-2xl font-bold">Güvenli Kayıt</h2>
                    <p className="text-white/70">DRM + OTP + Tek cihazda oturum</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3"><BadgeCheck className="text-brand-orange" size={20}/> 32+ video, ödev kontrol ve canlı webinar</li>
                  <li className="flex items-center gap-3"><BadgeCheck className="text-brand-orange" size={20}/> Üyelik bitmeden bildirim (SMS + e‑posta + push)</li>
                  <li className="flex items-center gap-3"><BadgeCheck className="text-brand-orange" size={20}/> Fxcanli Trade Club topluluğu</li>
                </ul>
                <div className="pt-2 text-white/70 text-sm">Zaten üye misin? <Link className="text-white underline" href="/login">Giriş yap</Link></div>
              </div>
            </div>

            {/* Sağ form paneli */}
            <div className="bg-white rounded-2xl border p-6 lg:p-8 self-center">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <h1 className="text-2xl font-semibold">Hesap Oluştur</h1>
                  <p className="text-gray-600">Devam etmek için bilgilerini gir</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ad Soyad</label>
                    <Input id="full_name" name="full_name" type="text" placeholder="Adınız Soyadınız" value={formData.full_name} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">TC Kimlik No</label>
                    <div className="relative">
                      <IdCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <Input id="tc_no" name="tc_no" inputMode="numeric" pattern="[0-9]*" placeholder="11 haneli" value={formData.tc_no} onChange={e=>handleChange({ ...e, target: { ...e.target, value: e.target.value.replace(/\D/g,'') } } as any)} className="pl-9" />
                    </div>
                    {!isTcValid && formData.tc_no.length>0 && <p className="text-xs text-red-600">TC no 11 haneli olmalı</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">E‑posta</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <Input id="email" name="email" type="email" placeholder="ornek@eposta.com" value={formData.email} onChange={handleChange} className="pl-9" />
                    </div>
                    {!isEmailValid && formData.email.length>0 && <p className="text-xs text-red-600">Geçerli bir e‑posta girin</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefon</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <Input id="phone" name="phone" inputMode="tel" placeholder="5xxxxxxxxx" value={formData.phone} onChange={e=>handleChange({ ...e, target: { ...e.target, value: e.target.value.replace(/\D/g,'') } } as any)} className="pl-9" />
                    </div>
                    {!isPhoneValid && formData.phone.length>0 && <p className="text-xs text-red-600">En az 10 hane olmalı</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Şifre</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <Input id="password" name="password" type={showPwd? 'text':'password'} placeholder="En az 8 karakter" value={formData.password} onChange={handleChange} className="pl-9 pr-10" />
                      <button type="button" onClick={()=>setShowPwd(s=>!s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">{showPwd? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                    </div>
                    {!isPwdStrong && formData.password.length>0 && <p className="text-xs text-red-600">Şifre en az 8 karakter olmalı</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Şifre Tekrar</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <Input id="password_confirm" name="password_confirm" type={showPwd2? 'text':'password'} placeholder="********" value={formData.password_confirm} onChange={handleChange} className="pl-9 pr-10" />
                      <button type="button" onClick={()=>setShowPwd2(s=>!s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">{showPwd2? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                    </div>
                    {!isPwdMatch && formData.password_confirm.length>0 && <p className="text-xs text-red-600">Şifreler uyuşmuyor</p>}
                  </div>
                </div>

                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} className="h-4 w-4"/>
                  <span>
                    <Link className="underline" href="#">Şartlar ve Koşullar</Link>'ı okudum ve kabul ediyorum.
                  </span>
                </label>

                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && <p className="text-green-700 text-sm">{success}</p>}
                <Button type="submit" className="w-full" disabled={loading || !canSubmit}>
                  {loading ? 'Gönderiliyor...' : 'Kayıt Ol'}
                </Button>
                <div className="text-sm text-gray-600">Zaten bir hesabın var mı? <Link href="/login" className="text-brand-black underline">Giriş yap</Link></div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
