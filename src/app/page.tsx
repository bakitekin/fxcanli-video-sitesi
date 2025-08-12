'use client';

import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";
import CourseCard from "@/components/ui/CourseCard";
import { useMemo, useState } from "react";

const courseData = [
  {
    key: "baslangic",
    category: "Başlangıç ve Altyapı",
    title: "TradingView & MetaTrader Ustası",
    subtitle: "Platform kurulumu, mum matematiği ve temel trend okuma",
    progress: 35,
    lessons: 6,
    totalLessons: 12,
    students: ["a", "b", "c"],
    additionalStudents: 120,
    color: "yellow" as const,
  },
  {
    key: "fibo",
    category: "Fibonacci ve Zaman",
    title: "Fibonacci ile Piyasa Haritalama",
    subtitle: "Retracement, Extension, Expansion ve Projection uygulamaları",
    progress: 58,
    lessons: 8,
    totalLessons: 14,
    students: ["d", "e", "f"],
    additionalStudents: 80,
    color: "purple" as const,
  },
  {
    key: "harmonik",
    category: "Harmonik Formasyonlar",
    title: "Gartley'den Butterfly'a Harmonik Yolculuk",
    subtitle: "AB=CD, Bat, Crab, Cypher, Butterfly senaryoları",
    progress: 72,
    lessons: 10,
    totalLessons: 16,
    students: ["g", "h", "i"],
    additionalStudents: 24,
    color: "blue" as const,
  },
  {
    key: "strateji",
    category: "Strateji ve Risk Yönetimi",
    title: "Boss & 2618 ile Strateji Tasarımı",
    subtitle: "Backtest, hedef/stop, risk ve yatırım psikolojisi",
    progress: 20,
    lessons: 5,
    totalLessons: 12,
    students: ["j", "k", "l"],
    additionalStudents: 42,
    color: "orange" as const,
  },
];

export default function HomePage() {
  const [filter, setFilter] = useState<"all" | "baslangic" | "fibo" | "harmonik" | "strateji">("all");
  const filtered = useMemo(
    () => courseData.filter((c) => (filter === "all" ? true : c.key === filter)),
    [filter]
  );

  const ctaFor = (p: number) => (p <= 0 ? "Başlat" : p >= 100 ? "Tekrar İzle" : "Devam Et");

  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="p-6">
          <section>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <h2 className="text-3xl font-bold">Premium Teknik Analiz Eğitimi</h2>
              <div className="flex flex-wrap gap-2">
                <button onClick={()=>setFilter('all')} className={`px-4 py-2 rounded-lg ${filter==='all' ? 'bg-brand-black text-white' : 'bg-gray-200'}`}>Tümü</button>
                <button onClick={()=>setFilter('baslangic')} className={`px-4 py-2 rounded-lg ${filter==='baslangic' ? 'bg-brand-black text-white' : 'bg-gray-200'}`}>Başlangıç</button>
                <button onClick={()=>setFilter('fibo')} className={`px-4 py-2 rounded-lg ${filter==='fibo' ? 'bg-brand-black text-white' : 'bg-gray-200'}`}>Fibonacci</button>
                <button onClick={()=>setFilter('harmonik')} className={`px-4 py-2 rounded-lg ${filter==='harmonik' ? 'bg-brand-black text-white' : 'bg-gray-200'}`}>Harmonik</button>
                <button onClick={()=>setFilter('strateji')} className={`px-4 py-2 rounded-lg ${filter==='strateji' ? 'bg-brand-black text-white' : 'bg-gray-200'}`}>Strateji</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(({ key, ...rest }) => (
                <CourseCard key={key} {...rest} ctaText={ctaFor(rest.progress)} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
