import { api } from './api';

export interface Grade {
  type: string;
  weight: number;
  score: number | null;
}

export interface GradeInput {
  type: string;
  weight: number;
  score: number;
}

export interface EnrollmentInput {
  courseId: string;
  studentId: string;
  grade: GradeInput[];
}

export interface Enrollment {
  _id: string;
  courseId: string;
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
  };
  enrollmentDate: string;
  grade: Grade[];
  status: string;
}

export interface EnrollmentListResponse {
  data: Enrollment[];
  totalItems: number;
  totalPage: number;
}

export async function fetchEnrollments(page: number = 1, limit: number = 10): Promise<EnrollmentListResponse> {
  const res = await api.get('/enrollments', {
    params: { page, limit }
  });
  return res.data;
}

export async function createEnrollment(data: EnrollmentInput) {
  return api.post('/enrollments', data);
}

export async function updateEnrollment(id: string, data: EnrollmentInput) {
  return api.patch(`/enrollments/${id}`, data);
}

export async function deleteEnrollment(id: string) {
  return api.delete(`/enrollments/${id}`);
} 