"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { withAuth } from "@/components/hoc/withAuth";
import { Role } from "@/types/auth";
import { use } from "react";
import { AssignmentService } from "@/services/assignment.service";
import { CourseService } from "@/services/course.service";
import { StudentAssignmentResponse, CourseResponse } from "@/types/api";
import MainLayout from "@/components/layouts/MainLayout";

type Props = { params: Promise<{ id: string; aid: string }> };

function formatDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  const weekday = d.toLocaleDateString("vi-VN", { weekday: "long" });
  const date = d.toLocaleDateString("vi-VN");
  const time = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return `${weekday}, ${date}, ${time}`;
}

function AssignmentDetails({ params }: Props) {
  const resolvedParams = use(params);
  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [assignment, setAssignment] = useState<StudentAssignmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const courseId = parseInt(resolvedParams.id);
        const assignmentId = parseInt(resolvedParams.aid);
        
        const [courseData, assignmentData] = await Promise.all([
          CourseService.getStudentCourseById(courseId),
          AssignmentService.getAssignmentForStudent(assignmentId),
        ]);

        setCourse(courseData);
        setAssignment(assignmentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
        console.error('Failed to fetch assignment data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, resolvedParams.aid]);

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-64 mb-4"></div>
            <div className="h-64 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !course || !assignment) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl px-4 py-10 space-y-2">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{error || 'Không tìm thấy bài tập'}</p>
          </div>
          <Link href={`/student/course/${resolvedParams.id}`} className="text-blue-600 hover:underline">← Quay lại khóa học</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* breadcrumb-like header */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/student" className="hover:underline">Trang chủ</Link>
        <span>/</span>
        <Link href={`/student/course/${course.id}`} className="hover:underline">{course.name}</Link>
        <span className="ml-auto">
          <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ${
            assignment.type === 'EXERCISE' ? 'bg-blue-600/90 text-white' :
            assignment.type === 'EXAM' ? 'bg-red-600/90 text-white' :
            assignment.type === 'PROJECT' ? 'bg-orange-600/90 text-white' :
            assignment.type === 'QUIZ' ? 'bg-green-600/90 text-white' :
            'bg-gray-600/90 text-white'
          }`}>
            {assignment.type === 'EXERCISE' ? 'Bài tập' :
             assignment.type === 'EXAM' ? 'Bài thi' :
             assignment.type === 'PROJECT' ? 'Dự án' :
             assignment.type === 'QUIZ' ? 'Kiểm tra nhanh' : assignment.type}
          </span>
        </span>
      </div>

      <div className="mt-3 rounded-md border bg-white">
        <div className="p-4 border-b">
          <div className="text-sm text-rose-600 font-medium flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-rose-600 text-white text-xs">📄</span>
            Bài tập lập trình
          </div>
          <h1 className="text-lg font-semibold mt-2">{assignment.title}</h1>
          <div className="mt-2 text-sm space-y-1 text-slate-600">
            <div><span className="font-semibold">Điểm tối đa:</span> {assignment.maxScore}</div>
            <div><span className="font-semibold">Thời gian giới hạn:</span> {assignment.timeLimit} phút</div>
            {assignment.endTime && (
              <div><span className="font-semibold">Hạn nộp:</span> {formatDate(assignment.endTime)}</div>
            )}
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-rose-600 font-semibold">Mô tả bài tập</h2>
          <div className="mt-3 text-sm">
            <div className="bg-slate-50 border rounded-lg p-4">
              <div className="prose prose-sm max-w-none">
                {assignment.description && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-900">Mô tả:</h3>
                    <p className="text-slate-700 whitespace-pre-wrap">{assignment.description}</p>
                  </div>
                )}
                {assignment.requirements && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-900">Yêu cầu:</h3>
                    <p className="text-slate-700 whitespace-pre-wrap">{assignment.requirements}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-semibold text-slate-900">Số câu hỏi:</h3>
                    <p className="text-slate-700">{assignment.totalQuestions || 1} câu</p>
                  </div>
                  {assignment.totalTestCases > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900">Test Cases:</h3>
                      <p className="text-slate-700">{assignment.totalTestCases} test cases</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Questions Preview */}
          {assignment.questions && assignment.questions.length > 0 && (
            <>
              <h2 className="text-rose-600 font-semibold mt-6">Danh sách câu hỏi</h2>
              <div className="mt-3 space-y-3">
                {assignment.questions.map((question, index) => (
                  <div key={question.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900">
                        Câu {index + 1}: {question.title}
                      </h3>
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          question.questionType === 'PROGRAMMING' ? 'bg-blue-100 text-blue-800' :
                          question.questionType === 'MULTIPLE_CHOICE' ? 'bg-green-100 text-green-800' :
                          question.questionType === 'ESSAY' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {question.questionType === 'PROGRAMMING' ? 'Lập trình' :
                           question.questionType === 'MULTIPLE_CHOICE' ? 'Trắc nghiệm' :
                           question.questionType === 'ESSAY' ? 'Tự luận' :
                           question.questionType === 'TRUE_FALSE' ? 'Đúng/Sai' : question.questionType}
                        </span>
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-800 rounded font-medium">
                          {question.points} điểm
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">
                      {question.description}
                    </p>
                    
                    <div className="text-xs text-slate-500 flex gap-4">
                      <span>Thứ tự: {question.orderIndex}</span>
                      {question.publicTestCases && question.publicTestCases.length > 0 && (
                        <span>Test cases công khai: {question.publicTestCases.length}</span>
                      )}
                      {question.options && question.options.length > 0 && (
                        <span>Lựa chọn: {question.options.length}</span>
                      )}
                      <span className={question.isAnswered ? 'text-green-600' : 'text-orange-600'}>
                        {question.isAnswered ? 'Đã trả lời' : 'Chưa trả lời'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 className="text-rose-600 font-semibold mt-6">Trạng thái bài nộp</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-3 text-sm">
            <div className="rounded-md border bg-white p-4">
              <div className="space-y-2">
                <div>
                  <div className="text-slate-600">Trạng thái bài nộp</div>
                  <div className="font-medium">
                    {assignment.isSubmitted ? 'Đã nộp bài' : 'Chưa nộp bài'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-600">Điểm tốt nhất</div>
                  <div className="font-medium text-emerald-600">
                    {assignment.currentScore !== undefined && assignment.currentScore !== null ? `${assignment.currentScore}/${assignment.maxScore}` : 'Chưa có điểm'}
                  </div>
                </div>
                {assignment.submissionTime && (
                  <div>
                    <div className="text-slate-600">Thời gian nộp</div>
                    <div className="text-slate-700">{formatDate(assignment.submissionTime)}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-md border bg-white p-4">
              <div className="space-y-2">
                <div>
                  <div className="text-slate-600">Trạng thái chấm điểm</div>
                  <div className="font-medium">
                    {assignment.submissionStatus === 'GRADED' ? 'Đã chấm điểm' : 
                     assignment.submissionStatus === 'SUBMITTED' ? 'Chờ chấm điểm' : 'Chưa chấm điểm'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-600">Tạo lúc</div>
                  <div className="font-medium">{formatDate(assignment.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <Link 
              href={`/student/course/${course.id}/assignment/${assignment.id}/attempt`} 
              className="h-10 inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Bắt đầu làm bài
            </Link>
          </div>
        </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default withAuth(AssignmentDetails, {
  requiredRoles: [Role.STUDENT, Role.TEACHER, Role.ADMIN],
});
