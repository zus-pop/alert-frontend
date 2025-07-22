import { api } from './api';

export interface Attendance {
  _id: string;
  enrollmentId: string;
  sessionId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchAttendances(page = 1, limit = 2000, sortBy = "createdAt", order = "asc"): Promise<{ data: Attendance[] }> {
  const res = await api.get('/attendances', {
    params: { page, limit, sortBy, order }
  });
  return { data: res.data.data };
}

export async function fetchAttendancesByStudentEnrollment(studentId: string, enrollmentId: string): Promise<{ data: Attendance[] }> {
  const res = await api.get(`/students/${studentId}/enrollments/${enrollmentId}/attendances`);
  return { data: res.data.data || res.data };
}

export async function updateAttendance(id: string, data: { status: string }) {
  const res = await api.patch(`/attendances/${id}`, data);
  return res.data;
}

export async function createAttendance(data: { enrollmentId: string; sessionId: string; status: string }) {
  const res = await api.post('/attendances', data);
  return res.data;
}

export async function deleteAttendance(id: string) {
  const res = await api.delete(`/attendances/${id}`);
  return res.data;
} 