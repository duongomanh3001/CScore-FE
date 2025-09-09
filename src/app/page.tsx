'use client';

import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Hero from '../../components/ui/Hero';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect authenticated users to their respective dashboards
      switch (user.role) {
        case 'ADMIN':
          router.push('/admin');
          break;
        case 'TEACHER':
          router.push('/teacher');
          break;
        case 'STUDENT':
          router.push('/student');
          break;
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Tính năng nổi bật
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Hệ thống chấm điểm tự động hiện đại và hiệu quả
            </p>
          </div>
          
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Chấm điểm tự động</h3>
              <p className="mt-2 text-base text-gray-500">
                Hệ thống chấm điểm tự động nhanh chóng và chính xác
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Báo cáo chi tiết</h3>
              <p className="mt-2 text-base text-gray-500">
                Thống kê và báo cáo kết quả học tập chi tiết
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Quản lý người dùng</h3>
              <p className="mt-2 text-base text-gray-500">
                Quản lý học sinh, giáo viên và quản trị viên dễ dàng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Sẵn sàng bắt đầu?</span>
            <span className="block text-blue-200">Đăng nhập ngay hôm nay.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
              >
                Đăng nhập
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
