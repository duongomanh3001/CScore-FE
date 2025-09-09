"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/ui/CourseCard";
import AssignmentCard from "@/components/ui/AssignmentCard";
import { withAuth } from "@/components/hoc/withAuth";
import { Role } from "@/types/auth";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { CourseService } from "@/services/course.service";
import { DashboardService } from "@/services/dashboard.service";
import { AssignmentService } from "@/services/assignment.service";
import { CourseResponse, StudentDashboardResponse, StudentAssignmentResponse } from "@/types/api";
import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";

function StudentDashboard() {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [assignments, setAssignments] = useState<StudentAssignmentResponse[]>([]);
  const [dashboardData, setDashboardData] = useState<StudentDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getUserDisplayName, getRoleName } = useRoleAccess();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch enrolled courses, dashboard data, and assignments
        const [enrolledCourses, dashboard, availableAssignments] = await Promise.all([
          CourseService.getEnrolledCourses(),
          DashboardService.getStudentDashboard(),
          AssignmentService.getAssignmentsForStudent(),
        ]);

        setCourses(enrolledCourses);
        setDashboardData(dashboard);
        setAssignments(availableAssignments);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu';
        if (errorMessage.includes('không mong muốn') || errorMessage.includes('Network Error') || errorMessage.includes('failed to fetch')) {
          setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc liên hệ quản trị viên.');
        } else {
          setError(errorMessage);
        }
        console.error('Failed to fetch student data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-48 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-[#ff6a00] font-semibold text-xl">
          Chào mừng, {getUserDisplayName()}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {getRoleName()} - Tổng quan về khóa học
        </p>
      </div>

      {/* Dashboard Stats */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-emerald-600">{dashboardData.totalCourses}</div>
            <div className="text-sm text-slate-500">Khóa học đã đăng ký</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{dashboardData.totalAssignments}</div>
            <div className="text-sm text-slate-500">Tổng bài tập</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-green-600">{dashboardData.completedAssignments}</div>
            <div className="text-sm text-slate-500">Đã hoàn thành</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="text-2xl font-bold text-orange-600">{dashboardData.pendingAssignments}</div>
            <div className="text-sm text-slate-500">Chưa hoàn thành</div>
          </div>
        </div>
      )}

      {/* Courses Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Các khóa học của tôi</h2>
        
        {courses.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
            <p className="text-slate-500 mb-4">Bạn chưa đăng ký khóa học nào</p>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700">
              Xem khóa học có sẵn
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard 
                key={course.id}
                title={course.name}
                code={course.code}
                percent={0} // You might want to calculate progress percentage
                gradient="from-emerald-500 to-emerald-600"
                logoText={course.code.substring(0, 2).toUpperCase()}
                href={`/student/course/${course.id}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Assignments Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Bài tập từ giảng viên</h2>
        
        {assignments.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
            <p className="text-slate-500">Chưa có bài tập nào được giao</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        )}
      </div>
      </div>
    </MainLayout>
  );
}

export default withAuth(StudentDashboard, {
  requiredRoles: [Role.STUDENT, Role.TEACHER, Role.ADMIN],
});
