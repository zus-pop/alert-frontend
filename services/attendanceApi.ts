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

export async function updateAttendance(id: string, data: { status: string }) {
  const res = await api.patch(`/attendances/${id}`, data);
  return res.data;
} 