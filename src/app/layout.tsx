import type { Metadata } from "next";
import { Kodchasan } from "next/font/google";
import "@/styles/globals.css";
import MobileNav from "@/components/layouts/MobileNav";
import GlobalProtection from "@/components/ui/GlobalProtection";

const kodchasan = Kodchasan({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "fxcanli",
  description: "Teknik Analiz Eğitim Platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={kodchasan.className} suppressHydrationWarning>
        <div className="flex min-h-screen pb-14 md:pb-0">{/* mobile space for bottom nav */}
          <GlobalProtection />
          {children}
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
