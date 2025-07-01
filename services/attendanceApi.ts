import axios from "axios";

export interface Attendance {
  _id: string;
  enrollmentId: string;
  sessionId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchAttendances(page = 1, limit = 2000): Promise<{ data: Attendance[] }> {
  const res = await axios.get(`https://ai-alert-5ea310f83e0b.herokuapp.com/api/attendances?page=${page}&limit=${limit}`);
  return { data: res.data.data };
}

export async function updateAttendance(id: string, data: { status: string }) {
  const res = await axios.patch(`https://ai-alert-5ea310f83e0b.herokuapp.com/api/attendances/${id}`, data);
  return res.data;
} 