import { api } from './api';

export interface Student {
  _id: string;
  studentCode?: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  password?: string;
  image?: string;
  deviceTokens?: string[];
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  learnedSemester?: number;
}

export interface StudentListResponse {
  data: Student[];
  totalItems: number;
  totalPage: number;
}

export async function fetchStudents(page: number = 1, limit: number = 10): Promise<StudentListResponse> {
  const res = await api.get('/students', {
    params: { page, limit }
  });
  return res.data;
}

export interface CreateStudentPayload {
  studentCode: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
}

export interface UpdateStudentPayload extends Partial<CreateStudentPayload> {
  majorId?: string;
  comboId?: string;
  curriculumId?: string;
  learnedSemester?: number;
}

export async function createStudent(data: CreateStudentPayload) {
  const res = await api.post('/students', data);
  return res.data;
}

export async function updateStudent(id: string, data: UpdateStudentPayload) {
  const res = await api.patch(`/students/${id}`, data);
  return res.data;
}

export async function restoreStudent(id: string) {
  const res = await api.patch(`/students/${id}/restore`);
  return res.data;
}

export async function deleteStudent(id: string) {
  const res = await api.delete(`/students/${id}`);
  return res.data;
} 