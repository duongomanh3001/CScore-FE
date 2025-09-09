import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl text-red-500 mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Không có quyền truy cập</h1>
        <p className="text-slate-500 mb-6">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>
        <Link
          href="/"
          className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
