"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlayCircle, CreditCard } from 'lucide-react';

const MobileNav = () => {
  const pathname = usePathname();
  const items = [
    { href: '/dashboard', label: 'Panel', icon: <LayoutDashboard size={20}/> },
    { href: '/videos/demo', label: 'Demo', icon: <PlayCircle size={20}/> },
    { href: '/payment', label: 'Ödeme', icon: <CreditCard size={20}/> },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-black text-white border-t border-white/10">
      <ul className="grid grid-cols-3">
        {items.map(i => {
          const active = pathname === i.href;
          return (
            <li key={i.href}>
              <Link href={i.href} className={`flex flex-col items-center justify-center py-2 ${active ? 'text-brand-orange' : 'text-white'}`}>
                {i.icon}
                <span className="text-xs mt-1">{i.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileNav;
