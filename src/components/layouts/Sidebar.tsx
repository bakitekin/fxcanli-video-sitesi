'use client';

import {
  LayoutDashboard,
  PlayCircle,
  CreditCard,
  Users,
  FileVideo2,
  Settings2,
  HelpCircle,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

const Sidebar = () => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  const userItems: NavItem[] = [
    { icon: <LayoutDashboard size={22} />, path: "/dashboard", label: "Panel" },
    { icon: <PlayCircle size={22} />, path: "/", label: "Premium Eğitim" },
    { icon: <PlayCircle size={22} />, path: "/videos/demo", label: "Demo İzle" },
    { icon: <CreditCard size={22} />, path: "/payment", label: "Ödemeler" },
    { icon: <HelpCircle size={22} />, path: "/notifications", label: "Bildirimler" },
  ];

  const adminItems: NavItem[] = [
    { icon: <FileVideo2 size={22} />, path: "/admin/videos", label: "Videolar" },
    { icon: <Users size={22} />, path: "/admin/users", label: "Kullanıcılar" },
    { icon: <Settings2 size={22} />, path: "#", label: "Ayarlar" },
  ];

  const bottomItems: NavItem[] = [
    { icon: <Settings2 size={22} />, path: "#", label: "Tercihler" },
  ];

  const renderLink = (item: NavItem) => {
    const isActive = pathname === item.path;
    const base =
      "flex items-center gap-3 rounded-xl px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange/60";
    const state = isActive
      ? "bg-white/10 text-white"
      : "text-gray-300 hover:text-white hover:bg-white/5";

    return (
      <Link
        href={item.path}
        key={item.path}
        aria-current={isActive ? "page" : undefined}
        className={`${base} ${state}`}
        title={item.label}
      >
        <span className="shrink-0">{item.icon}</span>
        <span
          className="pointer-events-none opacity-0 translate-x-[-6px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap"
        >
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <aside className="group h-screen bg-brand-black text-white w-20 md:hover:w-64 transition-all duration-300 flex flex-col items-stretch py-4 md:py-6 border-r border-white/10 fixed md:static z-40">
      {/* Logo */}
      <div className="flex items-center px-3 mb-6 md:mb-8">
        <div className="text-brand-orange font-bold text-2xl">fx</div>
        <span className="ml-3 text-lg font-semibold opacity-0 md:group-hover:opacity-100 transition-opacity hidden md:inline">fxcanli</span>
      </div>

      {/* Section title */}
      <div className="px-3 mb-2">
        <span className="text-xs uppercase tracking-wider text-white/50 opacity-0 md:group-hover:opacity-100 transition-opacity">
          {isAdmin ? 'Yönetim' : 'Öğrenme'}
        </span>
      </div>

      {/* Top Navigation */}
      <nav className="flex flex-col space-y-2 flex-grow px-2 pb-10">{/* pb for sticky footer */}
        {(isAdmin ? adminItems : userItems).map(renderLink)}
      </nav>

      {/* Sticky footer to avoid empty bottom */}
      <div className="mt-auto w-full px-3 pb-2">
        <div className="text-[10px] text-white/40 hidden md:block">© fxcanli</div>
      </div>
    </aside>
  );
};

export default Sidebar;
