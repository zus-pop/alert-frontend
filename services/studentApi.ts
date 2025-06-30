import axios from "axios";

const BASE_URL = "https://ai-alert-5ea310f83e0b.herokuapp.com";

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
}

export interface StudentListResponse {
  data: Student[];
  totalItems: number;
  totalPage: number;
}

export async function fetchStudents(page: number = 1, limit: number = 10): Promise<StudentListResponse> {
  const res = await axios.get(`${BASE_URL}/api/students`, {
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

export async function createStudent(data: CreateStudentPayload) {
  const res = await axios.post(`${BASE_URL}/api/students`, data);
  return res.data;
}

export async function updateStudent(id: string, data: Partial<CreateStudentPayload>) {
  const res = await axios.patch(`${BASE_URL}/api/students/${id}`, data);
  return res.data;
}

export async function restoreStudent(id: string) {
  const res = await axios.patch(`${BASE_URL}/api/students/${id}/restore`);
  return res.data;
}

export async function deleteStudent(id: string) {
  const res = await axios.delete(`${BASE_URL}/api/students/${id}`);
  return res.data;
} 