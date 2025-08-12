# fxcanli — Güvenli Teknik Analiz Eğitim Platformu (Frontend)

Modern, güvenli ve ölçeklenebilir bir eğitim platformunun Next.js (App Router) + TailwindCSS ile geliştirilmiş frontend kodları.

## Özellikler
- Premium eğitim sayfası (kategori filtreleme, dinamik CTA)
- Dashboard (karşılama, KPI grafikleri — Recharts, modül kartları, son videolar)
- Video oynatıcı (Canvas overlay: ad+TC hareketli, indirme/PiP engelleri)
- Giriş + OTP, Kayıt (doğrulamalar), Ödeme akışı, Bildirim merkezi
- Mobil alt navigasyon, responsive tasarım, marka teması

## Ekran Görüntüleri
Aşağıdaki görseller `public/` içine eklendi. Örnek yerleşim:

![Dashboard](./public/screenshot-dashboard.png)
![Premium](./public/screenshot-premium.png)
![Player](./public/screenshot-player.png)

> İsimler farklıysa lütfen görsel adlarını güncelleyin.

## Kurulum
```bash
npm i
npm run dev
# http://localhost:3000
```

Çevresel değişkenler (`.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Katalog
- `src/app/page.tsx` — Premium eğitim listesi
- `src/app/dashboard/page.tsx` — Panel (grafikler + modüller)
- `src/app/videos/[id]/page.tsx` — DRM URL ile oynatma
- `src/app/videos/demo/page.tsx` — Demo oynatıcı
- `src/app/login/page.tsx`, `src/app/register/page.tsx`
- `src/app/payment/page.tsx`
- `src/app/notifications/page.tsx`
- `src/components/ui/VideoPlayer.tsx` — overlay + güvenlik kısıtları
- `src/lib/api.ts` — backend istekleri (timeout + açıklayıcı hata)

## Notlar
- Backend yoksa dashboard istekleri hata verebilir. `NEXT_PUBLIC_API_URL` değerini ayarlayın ve backend’i başlatın.
- Grafikler Recharts ile sağlanır. İleride gerçek metriklerle beslenecektir.

## Lisans
Bu depo proje kapsamında kullanılmak üzere hazırlanmıştır.
