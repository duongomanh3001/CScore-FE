"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/types/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, getUserDisplayName, getRoleName, canAccessAdmin, canAccessTeacher } = useRoleAccess();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo-cscore.svg" alt="CSCORE" width={28} height={28} />
          <span className="hidden sm:inline">CSCORE</span>
        </Link>
        
        <nav className="flex items-center gap-6 text-sm text-slate-700">
          <Link href="/" className={`hover:text-blue-600 ${pathname === "/" ? "text-blue-600" : ""}`}>
            Trang chủ
          </Link>
          
          {isAuthenticated ? (
            <>
              {canAccessAdmin() && (
                <Link href="/admin" className={`hover:text-blue-600 ${pathname.startsWith("/admin") ? "text-blue-600" : ""}`}>
                  Quản trị
                </Link>
              )}
              {canAccessTeacher() && (
                <Link href="/teacher" className={`hover:text-blue-600 ${pathname.startsWith("/teacher") ? "text-blue-600" : ""}`}>
                  Giảng dạy
                </Link>
              )}
              <Link href="/student" className={`hover:text-blue-600 ${pathname.startsWith("/student") ? "text-blue-600" : ""}`}>
                Khóa học
              </Link>
              
              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center gap-2 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-slate-50">
                  <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline">{getUserDisplayName()}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-3 border-b border-slate-100">
                    <div className="font-medium text-slate-900">{getUserDisplayName()}</div>
                    <div className="text-sm text-slate-500">{getRoleName()}</div>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 text-red-600"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/student" className={`hover:text-blue-600 ${pathname.startsWith("/student") ? "text-blue-600" : ""}`}>
                Khóa học
              </Link>
              <Link href="/login" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700">
                Đăng nhập
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
