import axios from "axios";

const BASE_URL = "https://ai-alert-5ea310f83e0b.herokuapp.com";

export interface Attendance {
  _id: string;
  enrollmentId: string;
  sessionId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceListResponse {
  data: Attendance[];
  totalItems: number;
  totalPage: number;
}

export async function fetchAttendances(page: number = 1, limit: number = 100): Promise<AttendanceListResponse> {
  const res = await axios.get(`${BASE_URL}/api/attendances`, {
    params: { page, limit }
  });
  return res.data;
} 