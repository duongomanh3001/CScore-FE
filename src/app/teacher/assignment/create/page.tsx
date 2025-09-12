"use client";

import { useState, useEffect } from 'react';
import { withAuth } from "@/components/hoc/withAuth";
import { Role } from "@/types/auth";
import { CourseService } from "@/services/course.service";
import { AssignmentService } from "@/services/assignment.service";
import { CourseResponse } from "@/types/api";
import MainLayout from "@/components/layouts/MainLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";

function CreateAssignmentPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'EXERCISE' as 'EXERCISE' | 'EXAM' | 'PROJECT' | 'QUIZ',
    courseId: 0,
    maxScore: 100,
    timeLimit: 60,
    startTime: '',
    endTime: '',
    allowLateSubmission: false,
    autoGrade: false,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const teacherCourses = await CourseService.getTeacherCourses();
      setCourses(teacherCourses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      alert('Không thể tải danh sách khóa học');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.courseId) {
      alert('Vui lòng chọn khóa học');
      return;
    }

    setLoading(true);
    try {
      const assignmentData = {
        ...formData,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
      };

      await AssignmentService.createAssignment(assignmentData);
      alert('Tạo bài tập thành công!');
      router.push('/teacher');
    } catch (error) {
      console.error('Failed to create assignment:', error);
      alert('Có lỗi xảy ra khi tạo bài tập');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) : value
    }));
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/teacher" 
              className="text-slate-600 hover:text-slate-900"
            >
              ← Quay lại
            </Link>
          </div>
          <h1 className="text-[#ff6a00] font-semibold text-xl">Tạo bài tập mới</h1>
          <p className="text-slate-600 text-sm mt-1">
            Tạo bài tập cho sinh viên trong khóa học của bạn
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tiêu đề bài tập *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                  placeholder="Nhập tiêu đề bài tập"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Khóa học *
                </label>
                <select
                  name="courseId"
                  required
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                >
                  <option value={0}>Chọn khóa học</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                placeholder="Mô tả chi tiết về bài tập"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Loại bài tập *
                </label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                >
                  <option value="EXERCISE">Bài tập</option>
                  <option value="EXAM">Bài thi</option>
                  <option value="PROJECT">Dự án</option>
                  <option value="QUIZ">Kiểm tra nhanh</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Điểm tối đa *
                </label>
                <input
                  type="number"
                  name="maxScore"
                  required
                  min={1}
                  max={1000}
                  value={formData.maxScore}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Thời gian (phút) *
                </label>
                <input
                  type="number"
                  name="timeLimit"
                  required
                  min={1}
                  max={600}
                  value={formData.timeLimit}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>
            </div>

            {/* Time Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Thời gian bắt đầu
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Thời gian kết thúc
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="allowLateSubmission"
                  checked={formData.allowLateSubmission}
                  onChange={handleInputChange}
                  className="rounded border-slate-300 text-[#ff6a00] focus:ring-[#ff6a00]"
                />
                <span className="text-sm font-medium text-slate-700">
                  Cho phép nộp bài muộn
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="autoGrade"
                  checked={formData.autoGrade}
                  onChange={handleInputChange}
                  className="rounded border-slate-300 text-[#ff6a00] focus:ring-[#ff6a00]"
                />
                <span className="text-sm font-medium text-slate-700">
                  Tự động chấm điểm
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Link
                href="/teacher"
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
              >
                Hủy
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-[#ff6a00] border border-transparent rounded-md hover:bg-[#e55a00] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang tạo...' : 'Tạo bài tập'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default withAuth(CreateAssignmentPage, {
  requiredRoles: [Role.TEACHER],
});
