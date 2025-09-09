"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function ClientNavbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder navbar during SSR
    return (
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
            <span className="hidden sm:inline">CSCORE</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-slate-700">
            <span>Trang chủ</span>
          </nav>
        </div>
      </header>
    );
  }

  return <Navbar />;
}
