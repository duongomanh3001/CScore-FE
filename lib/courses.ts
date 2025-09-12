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
