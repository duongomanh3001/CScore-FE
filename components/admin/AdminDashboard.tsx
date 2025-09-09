"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminCourseManagement from '@/components/admin/AdminCourseManagement';
import CsvUploadModal from '@/components/admin/CsvUploadModal';
import { UserService } from '@/services/user.service';
import { CourseService } from '@/services/course.service';
import { Role } from '@/types/auth';
import { Toaster } from 'react-hot-toast';

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalAssignments: number;
  activeCourses: number;
}

export default function AdminDashboard() {
  const { state, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvModalType, setCsvModalType] = useState<'teachers' | 'students' | 'enrollment'>('teachers');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalAssignments: 0,
    activeCourses: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not admin
  if (!hasRole(Role.ADMIN)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Truy cập bị từ chối</h1>
          <p className="text-slate-600">Bạn không có quyền truy cập trang này.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [users, courses] = await Promise.all([
        UserService.getAllUsers(),
        CourseService.getAllCourses()
      ]);

      const students = users.filter(user => user.role === Role.STUDENT);
      const teachers = users.filter(user => user.role === Role.TEACHER);
      const activeCourses = courses.filter(course => course.isActive);

      setStats({
        totalUsers: users.length,
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalCourses: courses.length,
        totalAssignments: 0, // This would need to be fetched separately
        activeCourses: activeCourses.length
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: '📊' },
    { id: 'courses', label: 'Quản lý khóa học', icon: '📚' },
    { id: 'users', label: 'Quản lý người dùng', icon: '👥' },
    { id: 'reports', label: 'Báo cáo', icon: '📈' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Tổng số người dùng</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Sinh viên</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Giáo viên</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalTeachers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Tổng số khóa học</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalCourses}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Khóa học đang hoạt động</p>
              <p className="text-2xl font-bold text-slate-900">{stats.activeCourses}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Tổng số bài tập</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalAssignments}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('courses')}
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="text-sm font-medium text-emerald-800">Tạo khóa học</div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="text-2xl mb-2">👤</div>
            <div className="text-sm font-medium text-blue-800">Quản lý user</div>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-purple-800">Xem báo cáo</div>
          </button>
          <button
            onClick={loadDashboardStats}
            className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-sm font-medium text-gray-800">Làm mới</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      {/* CSV Import Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Import CSV</h3>
        <p className="text-slate-600 mb-6">
          Import hàng loạt giáo viên và sinh viên từ file CSV
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setCsvModalType('teachers');
              setCsvModalOpen(true);
            }}
            className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <div>
                <h4 className="font-medium text-purple-900">Import Giáo Viên</h4>
                <p className="text-sm text-purple-700">Thêm nhiều giáo viên cùng lúc</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setCsvModalType('students');
              setCsvModalOpen(true);
            }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <h4 className="font-medium text-green-900">Import Sinh Viên</h4>
                <p className="text-sm text-green-700">Thêm nhiều sinh viên cùng lúc</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quản lý người dùng</h3>
        <p className="text-slate-600">
          Các chức năng quản lý người dùng chi tiết sẽ được triển khai sau...
        </p>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Tổng người dùng</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-900">{stats.totalTeachers}</div>
            <div className="text-sm text-blue-600">Giáo viên</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-900">{stats.totalStudents}</div>
            <div className="text-sm text-green-600">Sinh viên</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Báo cáo hệ thống</h3>
      <p className="text-slate-600">Chức năng báo cáo sẽ được triển khai sau...</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bảng điều khiển Quản trị viên
          </h1>
          <p className="text-slate-600">
            Chào mừng trở lại, {state.user?.fullName}! Quản lý hệ thống CSCORE của bạn.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
            <button onClick={() => setError(null)} className="ml-4 text-red-900">×</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'courses' && <AdminCourseManagement />}
          {activeTab === 'users' && renderUserManagement()}
          {activeTab === 'reports' && renderReports()}
        </div>

        {/* CSV Upload Modal */}
        <CsvUploadModal
          isOpen={csvModalOpen}
          onClose={() => setCsvModalOpen(false)}
          type={csvModalType}
          onSuccess={() => {
            loadDashboardStats(); // Refresh stats after import
          }}
        />
      </div>
    </div>
  );
}
