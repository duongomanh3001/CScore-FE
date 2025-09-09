export type Assignment = {
  id: string;
  title: string;
  status: "in-progress" | "done";
  description?: string;
  deadline?: string; // plain text for mock
  note?: string;
  openedAt?: string; // ISO string
  dueAt?: string; // ISO string
  grade?: number; // mock grading score (0-100)
};

export type Course = {
  id: string; // slug/id
  title: string;
  code: string;
  percent: number;
  gradient?: string;
  logoText?: string;
  classGroup?: string;
  assignments: Assignment[];
};

export const courses: Course[] = [
  {
    id: "nosql-mongodb-42030146601",
    title: "NoSQL MongoDB(42030146601)",
    code: "CNTT_HK1_25_26",
    percent: 18,
    logoText: "mongoDB",
    gradient: "from-emerald-50 to-emerald-100",
    classGroup: "DHKTPM19A",
    assignments: [
      {
        id: "w3",
        title: "Tuần 03 (In-Progress)",
        status: "in-progress",
        description:
          "Bài 3.1: sử dụng collection phải tạo thực hiện một số câu lệnh cơ bản • Bài 3.2: sử dụng collection QLSV thực hiện một số câu lệnh truy vấn (find) • Bài 3.3: sử dụng collection QLSV (sử dụng bài 3.2) thực hiện các câu lệnh truy vấn (find)",
        deadline: "23h59p ngày 25/05/2025",
        openedAt: "2025-05-06T00:00:00.000Z",
        dueAt: "2025-05-13T00:00:00.000Z",
  grade: 7.33,
        note: "đặt tên file là 'STT_HoTen_MSSV'. Tên database là 'MSSV'. Tên collection là 'TenTap'",
      },
      { id: "w2", title: "Tuần 02 (Done)", status: "done" },
      { id: "w1", title: "Tuần 01 (Done)", status: "done" },
    ],
  },
  {
    id: "cnmt-ung-dung",
    title: "Công nghệ môi trường phát triển ứng dụng",
    code: "CNTT_HK2_24_25",
    percent: 12,
    gradient: "from-fuchsia-500 via-purple-500 to-indigo-500",
    assignments: [
      { id: "w1", title: "Tuần 01 (Done)", status: "done" },
    ],
  },
  {
    id: "kien-truc-thiet-ke-phan-mem",
    title: "Kiến trúc và Thiết kế phần mềm",
    code: "CNTT_HK2_24_25",
    percent: 6,
    gradient: "from-rose-400 via-pink-500 to-fuchsia-500",
    assignments: [
      { id: "w1", title: "Tuần 01 (Done)", status: "done" },
    ],
  },
  {
    id: "pretest-ktpm-hki-2025-2026",
    title: "Pretest_Kỹ thuật phần mềm_HKI_2025_2026",
    code: "CNTT_HK1_25_26",
    percent: 0,
    gradient: "from-slate-200 to-slate-300",
    assignments: [],
  },
  {
    id: "quan-ly-du-an-cntt-4200340694",
    title: "Quản lý dự án CNTT(4200340694)",
    code: "CNTT_HK2_24_25",
    percent: 29,
    gradient: "from-cyan-400 to-blue-600",
    assignments: [
      { id: "w2", title: "Tuần 02 (Done)", status: "done" },
    ],
  },
];

export function getCourseById(id: string) {
  return courses.find((c) => c.id === id);
}

export function getAssignment(courseId: string, assignmentId: string) {
  const c = getCourseById(courseId);
  if (!c) return undefined;
  return c.assignments.find((a) => a.id === assignmentId);
}
