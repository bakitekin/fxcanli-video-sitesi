import { Bell, Search } from "lucide-react";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 md:p-6 bg-brand-white sticky top-0 z-30">
      <div className="min-w-0">
        <h1 className="text-lg md:text-2xl font-bold truncate">Welcome to fxcanli</h1>
        <p className="text-gray-500 text-xs md:text-sm">Teknik analiz eğitim videolarına hemen başla.</p>
      </div>
      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="relative hidden sm:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Ara"
            className="pl-9 pr-3 py-2 rounded-full border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-orange w-40 md:w-56"
          />
        </div>
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell size={22} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2 md:space-x-3">
          <Image
            src="https://i.pravatar.cc/40?u=kacie"
            alt="Kullanıcı"
            width={36}
            height={36}
            className="rounded-full"
          />
          <div className="hidden sm:block">
            <p className="font-semibold leading-none">Kullanıcı</p>
            <p className="text-xs text-gray-500 leading-none">@fxcanli</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
