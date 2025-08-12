'use client';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';

export default function AdminUsersPage(){
  // Backend hazır olunca kullanıcıları çekeceğiz
  const users = [] as Array<{id:string; full_name:string; email:string; membership_end?:string}>;
  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="p-6">
          <div className="bg-white border rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-4">Kullanıcılar</h2>
            <div className="text-gray-600">Backend entegrasyonu ile doldurulacak.</div>
          </div>
        </div>
      </main>
    </>
  );
}
